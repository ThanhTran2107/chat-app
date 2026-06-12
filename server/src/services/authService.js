import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { Session } from "../models/Session.js";

const ACCESS_TOKEN_TTL = "30m";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // 14 days

export const createSessionForUser = async (user, res) => {
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

export const createSocialUser = async ({
  email,
  displayName,
  firstName,
  lastName,
  avatarUrl,
  authProvider,
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
    authProvider: authProvider || "google",
    email: email.toLowerCase().trim(),
    displayName: displayName || `${lastName ?? ""} ${firstName ?? ""}`.trim(),
    avatarUrl,
    emailVerified: true,
  });
};

export const createEmailVerificationToken = async (user) => {
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationTokenHash = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  const verificationTokenExpiry = new Date(
    Date.now() + 24 * 60 * 60 * 1000,
  );

  user.emailVerificationToken = verificationTokenHash;
  user.emailVerificationExpires = verificationTokenExpiry;

  await user.save();

  return verificationToken;
};
