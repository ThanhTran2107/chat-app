import express from "express";
import {
  checkFriendship,
  checkGroupMemberShip,
} from "../middlewares/friendMiddleware.js";
import {
  sendDirectMessage,
  sendGroupMessage,
} from "../controllers/messageController.js";

export const messageRoute = express.Router();

messageRoute.post("/direct", checkFriendship, sendDirectMessage);
messageRoute.post("/group", checkGroupMemberShip, sendGroupMessage);
