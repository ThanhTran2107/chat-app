import { Server } from "socket.io";
import http from "http";
import express from "express";
import { socketMiddleware } from "../middlewares/socketMiddleware.js";
import { getUserConversationsForSocketIo } from "../controllers/conversationController.js";
import { Friend } from "../models/Friend.js";
import { User } from "../models/User.js";

export const app = express();

export const httpServer = http.createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

export const onlineUsers = new Map(); // {userId: socketId }

const getFriendIds = async (userId) => {
  const friendShips = await Friend.find({
    $or: [{ userA: userId }, { userB: userId }],
  }).lean();

  return friendShips.map((fs) =>
    fs.userA.toString() === userId.toString()
      ? fs.userB.toString()
      : fs.userA.toString(),
  );
};

export const notifyFriendsOfUserPresence = async (userId, status) => {
  const friendIds = await getFriendIds(userId);

  if (!friendIds.length) return;

  for (const friendId of friendIds) {
    const friendSocketId = onlineUsers.get(friendId);
    if (!friendSocketId) continue;

    io.to(friendSocketId).emit("friend-presence-changed", {
      userId,
      status,
    });
  }
};

export const sendInitialFriendPresence = async (socket, userId) => {
  const friendIds = await getFriendIds(userId);

  if (!friendIds.length) return;

  const visibleOnlineFriends = await User.find({
    _id: { $in: friendIds },
    showOnlineStatus: { $ne: false },
  })
    .select("_id")
    .lean();

  const onlineFriendIds = visibleOnlineFriends
    .map((friend) => friend._id.toString())
    .filter((id) => onlineUsers.has(id));

  onlineFriendIds.forEach((friendId) => {
    socket.emit("friend-presence-changed", {
      userId: friendId,
      status: "online",
    });
  });
};

io.use(socketMiddleware);

io.on("connection", async (socket) => {
  const user = socket.user;

  console.log(`${user.displayName} online with socket ID: ${socket.id}`);

  const userId = user._id.toString();
  onlineUsers.set(userId, socket.id);

  io.emit("online-users", Array.from(onlineUsers.keys()));

  const conversationIds = await getUserConversationsForSocketIo(user._id);
  conversationIds.forEach((conversationId) => socket.join(conversationId));

  await sendInitialFriendPresence(socket, userId);
  await notifyFriendsOfUserPresence(
    userId,
    user.showOnlineStatus !== false ? "online" : "offline",
  );

  socket.on("join-conversation", (conversationId) =>
    socket.join(conversationId),
  );

  socket.join(user._id.toString());

  socket.on("disconnect", async () => {
    onlineUsers.delete(userId);
    io.emit("online-users", Array.from(onlineUsers.keys()));

    await notifyFriendsOfUserPresence(userId, "offline");

    console.log(`${user.displayName} offline with socket ID: ${socket.id}`);
  });
});
