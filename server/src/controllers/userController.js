import { User } from "../models/User.js";
import { uploadImageFromBuffer } from "../middlewares/uploadMiddleware.js";

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

export const uploadAvatar = async (req, res) => {
  try {
    const file = req.file;
    const userId = req.user._id;

    if (!file) return res.status(400).json({ message: "File is required" });

    const result = await uploadImageFromBuffer(file.buffer);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        avatarUrl: result.secure_url,
        avatarId: result.public_id,
      },
      { new: true },
    ).select("avatarUrl");

    if (!updatedUser.avatarUrl)
      return res.status(400).json({ message: "Failed to update user avatar" });

    return res.status(200).json({ avatarUrl: updatedUser.avatarUrl });
  } catch (e) {
    console.error("Upload avatar error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};
