import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User } from "../models/User.js";
import { Session } from "../models/Session.js";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "../libs/mailer.js";
import { validatePassword } from "../utils/validation.js";
import {
  createSessionForUser,
  createSocialUser,
  createEmailVerificationToken,
} from "../services/authService.js";
import {
  getGoogleUserInfo,
  getFacebookUserInfo,
} from "../services/oauthService.js";

const ACCESS_TOKEN_TTL = "30m";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // 14 days
const RESET_TOKEN_TTL = 30 * 60 * 1000; // 30 minutes

export const register = async (req, res) => {
  try {
    const { username, password, email, firstName, lastName } = req.body;

    if (!username || !password || !email || !firstName || !lastName)
      return res.status(400).json({ message: "All fields are required" });

    // check if the username or email already exists
    const duplicateUsername = await User.findOne({ username });
    const duplicateEmail = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (duplicateUsername)
      return res.status(409).json({ message: "Username already exists" });

    if (duplicateEmail)
      return res.status(409).json({ message: "Email already exists" });

    const passwordError = validatePassword(password);
    if (passwordError) return res.status(400).json({ message: passwordError });

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create a new user with email verification required
    const user = await User.create({
      username,
      hashedPassword,
      authProvider: "local",
      email: email.toLowerCase().trim(),
      displayName: `${lastName} ${firstName}`,
      emailVerified: false,
    });

    const verificationToken = await createEmailVerificationToken(user);

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const verifyUrl = `${clientUrl}${process.env.EMAIL_VERIFY_PATH || "/verify-email"}?token=${verificationToken}`;

    await sendVerificationEmail({
      to: user.email,
      url: verifyUrl,
    });

    return res.status(201).json({
      message:
        "Registration successful. Please verify your email before logging in.",
    });
  } catch (e) {
    console.error("Registration error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logIn = async (req, res) => {
  try {
    // get inputs
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    // get hashedPassword from the database to compare with the input password
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    if (user.authProvider !== "local")
      return res.status(403).json({
        message:
          "This account is linked to social login. Please sign in with Google or Facebook, or set a local password first.",
      });

    if (!user.emailVerified)
      return res.status(403).json({
        message:
          "Email not verified. Please verify your email or request a new verification link.",
      });

    // verify password
    const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordCorrect)
      return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = await createSessionForUser(user, res);

    return res.status(200).json({ accessToken });
  } catch (e) {
    console.error("Login error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken)
      return res
        .status(400)
        .json({ message: "Google access token is required" });

    const googleUser = await getGoogleUserInfo(accessToken);
    const email = googleUser.email?.toLowerCase().trim();

    if (!email || !googleUser.email_verified)
      return res.status(401).json({ message: "Invalid Google account" });

    let user = await User.findOne({ email });

    if (!user)
      user = await createSocialUser({
        email,
        displayName: googleUser.name,
        firstName: googleUser.given_name,
        lastName: googleUser.family_name,
        avatarUrl: googleUser.picture,
        authProvider: "google",
      });

    if (!user.emailVerified) {
      user.emailVerified = true;
      await user.save();
    }

    const token = await createSessionForUser(user, res);

    return res.status(200).json({ accessToken: token });
  } catch (e) {
    console.error("Google login error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const facebookLogin = async (req, res) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken)
      return res
        .status(400)
        .json({ message: "Facebook access token is required" });

    const fbUser = await getFacebookUserInfo(accessToken);
    const email = fbUser.email?.toLowerCase().trim();

    if (!email)
      return res.status(401).json({ message: "Invalid Facebook account" });

    let user = await User.findOne({ email });

    if (!user) {
      const pictureUrl = fbUser.picture?.data?.url;
      console.log("Facebook user info:", { fbUser, pictureUrl });

      user = await createSocialUser({
        email,
        displayName:
          `${fbUser.first_name ?? ""} ${fbUser.last_name ?? ""}`.trim(),
        firstName: fbUser.first_name,
        lastName: fbUser.last_name,
        avatarUrl: pictureUrl,
        authProvider: "facebook",
      });
    }

    if (!user.emailVerified) {
      user.emailVerified = true;
      await user.save();
    }

    const token = await createSessionForUser(user, res);

    return res.status(200).json({ accessToken: token });
  } catch (e) {
    console.error("Facebook login error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logOut = async (req, res) => {
  try {
    // get refresh token from cookie
    const token = req.cookies?.refreshToken;

    if (token) {
      // delete refresh token from Session
      await Session.deleteOne({ refreshToken: token });

      // clear cookie
      res.clearCookie("refreshToken");
    }

    return res.sendStatus(204);
  } catch (e) {
    console.error("Logout error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) return res.status(404).json({ message: "Email does not exist" });

    const provider = user.authProvider || "local";
    if (provider !== "local")
      return res.status(400).json({
        message:
          "This account is linked to social login. Please sign in with Google or Facebook, or set a local password first.",
      });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const resetTokenExpiry = new Date(Date.now() + RESET_TOKEN_TTL);

    user.passwordResetToken = resetTokenHash;
    user.passwordResetExpires = resetTokenExpiry;
    await user.save();

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const resetUrl = `${clientUrl}${process.env.PASSWORD_RESET_PATH || "/reset-password"}?token=${resetToken}`;

    await sendPasswordResetEmail({
      to: user.email,
      url: resetUrl,
    });

    return res
      .status(200)
      .json({ message: "If that email exists, a reset link has been sent." });
  } catch (e) {
    console.error("Forgot password error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const token = req.body?.token || req.query?.token;

    if (!token)
      return res
        .status(400)
        .json({ message: "Verification token is required" });

    const verificationTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      emailVerificationToken: verificationTokenHash,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user)
      return res
        .status(400)
        .json({ message: "Invalid or expired verification token" });

    if (!user.emailVerified) {
      user.emailVerified = true;
      await user.save();
    }

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (e) {
    console.error("Verify email error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user)
      return res.status(200).json({
        message: "If that email exists, a verification link has been sent.",
      });

    if (user.authProvider !== "local")
      return res.status(400).json({
        message:
          "This account is linked to social login. Please sign in with Google or Facebook.",
      });

    if (user.emailVerified)
      return res.status(200).json({ message: "Email is already verified." });

    const verificationToken = await createEmailVerificationToken(user);
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const verifyUrl = `${clientUrl}${process.env.EMAIL_VERIFY_PATH || "/verify-email"}?token=${verificationToken}`;

    await sendVerificationEmail({
      to: user.email,
      url: verifyUrl,
    });

    return res
      .status(200)
      .json({ message: "Verification email has been resent." });
  } catch (e) {
    console.error("Resend verification email error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password)
      return res
        .status(400)
        .json({ message: "Token and new password are required" });

    const passwordError = validatePassword(password);
    if (passwordError) return res.status(400).json({ message: passwordError });

    const resetTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: resetTokenHash,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user)
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });

    user.hashedPassword = await bcrypt.hash(password, 10);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    return res
      .status(200)
      .json({ message: "Password has been reset successfully" });
  } catch (e) {
    console.error("Reset password error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const session = await Session.findOne({ refreshToken: token });

    if (!session)
      return res
        .status(403)
        .json({ message: "Refresh token is invalid or revoked" });

    if (session.expiresAt < new Date())
      return res.status(403).json({ message: "Token expired" });

    const accessToken = jwt.sign(
      { userId: session.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL },
    );

    return res.status(200).json({ accessToken });
  } catch (e) {
    console.error("Refresh token error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};
