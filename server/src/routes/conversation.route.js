import express from "express";
import {
  createConversation,
  getConversations,
  getMessages,
  markAsSeen,
} from "../controllers/conversation.controller.js";
import { checkFriendship } from "../middlewares/friend.middleware.js";

export const conversationRoute = express.Router();

conversationRoute.post("/", checkFriendship, createConversation);
conversationRoute.get("/", getConversations);
conversationRoute.get("/:conversationId/messages", getMessages);
conversationRoute.patch("/:conversationId/seen", markAsSeen);
