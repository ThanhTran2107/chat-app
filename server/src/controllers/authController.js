import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User } from "../models/User.js";
import { Session } from "../models/Session.js";

const ACCESS_TOKEN_TTL = "30m";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // 14 days

export const register = async (req, res) => {
  try {
    const { username, password, email, firstName, lastName } = req.body;

    if (!username || !password || !email || !firstName || !lastName)
      return res.status(400).json({ message: "All fields are required" });

    // kiểm tra username tồn tại chưa
    const duplicate = await User.findOne({ username });

    if (duplicate)
      return res.status(409).json({ message: "Username already exists" });

    // mã hóa password
    const hashedPassword = await bcrypt.hash(password, 10);

    // tạo user mới
    await User.create({
      username,
      hashedPassword,
      email,
      displayName: `${lastName} ${firstName}`,
    });

    return res.sendStatus(204);
  } catch (e) {
    console.error("Registration error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const createSessionForUser = async (user, res) => {
  const accessToken = jwt.sign(
    { userId: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_TTL },
  );

  const refreshToken = crypto.randomBytes(64).toString("hex");

  await Session.create({
    userId: user._id,
    refreshToken,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: REFRESH_TOKEN_TTL,
  });

  return accessToken;
};

const createSocialUser = async ({
  email,
  displayName,
  firstName,
  lastName,
  avatarUrl,
}) => {
  let usernameBase = email
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
    
  if (!usernameBase) usernameBase = "user";

  let username = usernameBase;
  let counter = 1;

  while (await User.findOne({ username })) {
    username = `${usernameBase}${counter}`;
    counter += 1;
  }

  const randomPassword = crypto.randomBytes(32).toString("hex");
  const hashedPassword = await bcrypt.hash(randomPassword, 10);

  return User.create({
    username,
    hashedPassword,
    email: email.toLowerCase().trim(),
    displayName: displayName || `${lastName ?? ""} ${firstName ?? ""}`.trim(),
    avatarUrl,
  });
};

const getGoogleUserInfo = async (accessToken) => {
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${encodeURIComponent(accessToken)}`,
  );

  if (!response.ok) {
    throw new Error("Google token validation failed");
  }

  return response.json();
};

const getFacebookUserInfo = async (accessToken) => {
  const response = await fetch(
    `https://graph.facebook.com/me?fields=id,email,first_name,last_name,picture&access_token=${encodeURIComponent(accessToken)}`,
  );

  if (!response.ok) throw new Error("Facebook token validation failed");

  return response.json();
};

export const logIn = async (req, res) => {
  try {
    // lấy inputs
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    // lấy hashedPassword từ db để so với password input
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // kiểm tra password
    const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordCorrect)
      return res.status(401).json({ message: "Invalid credentials" });

    // nếu khớp, tạo accessToken với JWT
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL },
    );

    // tạo refreshToken
    const refreshToken = crypto.randomBytes(64).toString("hex");

    // tạo session mới để lưu refreshToken
    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });

    // trả refresh token về trong cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: REFRESH_TOKEN_TTL,
    });

    // trả refresh token về trong response
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
      });

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
      });
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
    // lấy refresh token từ cookie
    const token = req.cookies?.refreshToken;

    if (token) {
      // xóa refresh token trong Session
      await Session.deleteOne({ refreshToken: token });

      // xóa cookie
      res.clearCookie("refreshToken");
    }

    return res.sendStatus(204);
  } catch (e) {
    console.error("Logout error:", e);
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
