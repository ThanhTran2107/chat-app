import { User } from "../models/User.js";

export const authMe = async (req, res) => {
  try {
    const user = req.user;

    return res.status(200).json({ user });
  } catch (e) {
    console.error("Auth me error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const searchUserByUsername = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username || username.trim() === "")
      return res.status(400).json({ message: "Username is required" });

    const users = await User.findOne({ username }).select(
      "_id displayName username avatarUrl",
    );

    return res.status(200).json({ users });
  } catch (e) {
    console.error("Search user error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};
