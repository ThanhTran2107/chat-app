import { User } from "../models/User.js";
import { FriendRequest } from "../models/FriendRequest.js";
import { Friend } from "../models/Friend.js";
import { io, onlineUsers } from "../socket/index.js";

export const sendFriendRequest = async (req, res) => {
  try {
    const { to, message } = req.body;

    const from = req.user._id;

    if (from.toString() === to.toString())
      return res
        .status(400)
        .json({ message: "You cannot send friend request to yourself" });

    const userExits = await User.exists({ _id: to });

    if (!userExits) return res.status(404).json({ message: "User not found" });

    let userA = from.toString();
    let userB = to.toString();

    if (userA > userB) [userA, userB] = [userB, userA];

    const [alreadyFriends, existingRequest] = await Promise.all([
      Friend.findOne({ userA, userB }),
      FriendRequest.findOne({
        $or: [
          { from, to },
          { from: to, to: from },
        ],
      }),
    ]);

    if (alreadyFriends)
      return res.status(400).json({ message: "You are already friends" });

    if (existingRequest)
      return res.status(400).json({ message: "Friend request already exists" });

    const request = await FriendRequest.create({ from, to, message });

    await request.populate("from", "_id username displayName avatarUrl");
    await request.populate("to", "_id username displayName avatarUrl");

    const recipientSocketId = onlineUsers.get(to.toString());
    if (recipientSocketId)
      io.to(recipientSocketId).emit("friend-request-received", request);

    return res
      .status(200)
      .json({ message: "Friend request sent successfully", request });
  } catch (e) {
    console.error("Send friend request error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    const request = await FriendRequest.findById(requestId);

    if (!request)
      return res.status(404).json({ message: "Friend request not found" });

    if (request.to.toString() !== userId.toString())
      return res.status(403).json({ message: "You are not authorized" });

    const friend = await Friend.create({
      userA: request.from,
      userB: request.to,
    });

    await FriendRequest.findByIdAndDelete(requestId);

    const from = await User.findById(request.from)
      .select("_id displayName avatarUrl")
      .lean();

    const senderSocketId = onlineUsers.get(request.from.toString());

    if (senderSocketId)
      io.to(senderSocketId).emit("friend-request-accepted", {
        requestId,
        acceptedBy: userId.toString(),
        newFriend: {
          _id: from?._id,
          displayName: from?.displayName,
          avatarUrl: from?.avatarUrl,
        },
      });

    return res.status(200).json({
      message: "Friend request accepted successfully",
      newFriend: {
        _id: from?._id,
        displayName: from?.displayName,
        avatarUrl: from?.avatarUrl,
      },
    });
  } catch (e) {
    console.error("Accept friend request error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const declineFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    const request = await FriendRequest.findById(requestId);

    if (!request)
      return res.status(404).json({ message: "Friend request not found" });

    if (request.to.toString() !== userId.toString())
      return res.status(403).json({ message: "You are not authorized" });

    await FriendRequest.findByIdAndDelete(requestId);

    const senderSocketId = onlineUsers.get(request.from.toString());

    if (senderSocketId)
      io.to(senderSocketId).emit("friend-request-declined", {
        requestId,
        declinedBy: userId.toString(),
      });

    return res
      .status(204)
      .json({ message: "Friend request declined successfully" });
  } catch (e) {
    console.error("Decline friend request error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllFriends = async (req, res) => {
  try {
    const userId = req.user._id;

    const friendShips = await Friend.find({
      $or: [{ userA: userId }, { userB: userId }],
    })
      .populate("userA", "_id displayName avatarUrl")
      .populate("userB", "_id displayName avatarUrl")
      .lean();

    if (!friendShips.length) return res.status(200).json({ friends: [] });

    const friends = friendShips.map((fs) =>
      fs.userA._id.toString() === userId.toString() ? fs.userB : fs.userA,
    );

    return res.status(200).json({ friends });
  } catch (e) {
    console.error("Get all friends error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getFriendRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const populateFields = "_id username displayName avatarUrl";

    const [sent, received] = await Promise.all([
      FriendRequest.find({ from: userId }).populate("to", populateFields),
      FriendRequest.find({ to: userId }).populate("from", populateFields),
    ]);

    return res.status(200).json({ sent, received });
  } catch (e) {
    console.error("Get friend requests error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};
