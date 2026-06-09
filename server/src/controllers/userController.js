import { User } from "../models/User.js";
import { notifyFriendsOfUserPresence, onlineUsers } from "../socket/index.js";
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

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { displayName, username, email, phoneNumber, bio, showOnlineStatus } =
      req.body;

    const updates = {};

    if (displayName !== undefined) updates.displayName = displayName;
    if (username !== undefined) updates.username = username;
    if (email !== undefined) updates.email = email;
    if (phoneNumber !== undefined) updates.phoneNumber = phoneNumber;
    if (bio !== undefined) updates.bio = bio;
    if (showOnlineStatus !== undefined)
      updates.showOnlineStatus = showOnlineStatus;

    if (Object.keys(updates).length === 0)
      return res
        .status(400)
        .json({ message: "No profile fields provided for update" });

    if (updates.username) {
      const existingUser = await User.findOne({
        username: updates.username.toLowerCase(),
        _id: { $ne: userId },
      });

      if (existingUser)
        return res.status(400).json({ message: "Username is already taken" });
    }

    if (updates.email) {
      const existingEmail = await User.findOne({
        email: updates.email.toLowerCase(),
        _id: { $ne: userId },
      });

      if (existingEmail)
        return res.status(400).json({ message: "Email is already registered" });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-hashedPassword");

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    if (showOnlineStatus !== undefined && onlineUsers.has(userId.toString())) {
      const userStatus = updatedUser.showOnlineStatus ? "online" : "offline";
      await notifyFriendsOfUserPresence(userId, userStatus);
    }

    return res.status(200).json({ user: updatedUser });
  } catch (e) {
    console.error("Update profile error:", e);
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
