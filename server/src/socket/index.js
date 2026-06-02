import { Server } from "socket.io";
import http from "http";
import express from "express";
import { socketMiddleware } from "../middlewares/socketMiddleware.js";

export const app = express();

export const httpServer = http.createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.use(socketMiddleware);

const onlineUsers = new Map(); // {userId: socketId }

io.on("connection", (socket) => {
  const user = socket.user;

  console.log(`${user.displayName} online with socket ID: ${socket.id}`);

  onlineUsers.set(user._id, socket.id);

  io.emit("online-users", Array.from(onlineUsers.keys()));

  socket.on("disconnect", () => {
    onlineUsers.delete(user._id);
    io.emit("online-users", Array.from(onlineUsers.keys()));

    console.log(`${user.displayName} offline with socket ID: ${socket.id}`);
  });
});
