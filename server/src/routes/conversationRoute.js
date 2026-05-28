import express from "express";
import {
  createConversation,
  getConversations,
  getMessages,
} from "../controllers/conversationController.js";
import { checkFriendship } from "../middlewares/friendMiddleware.js";

export const conversationRoute = express.Router();

conversationRoute.post("/", checkFriendship, createConversation);
conversationRoute.get("/", getConversations);
conversationRoute.get("/:conversationId/messages", getMessages);
