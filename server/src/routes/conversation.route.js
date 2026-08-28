import express from "express";
import {
  createConversation,
  getConversations,
  getMessages,
  markAsSeen,
} from "../controllers/conversation.controller.js";
import { checkFriendship } from "../middlewares/friend.middleware.js";
import { checkConversationParticipant } from "../middlewares/conversation.middleware.js";
import {
  validateCreateConversation,
  validateGetMessages,
  validateConversationParam,
} from "../validators/conversation.validator.js";
import { sensitiveRateLimiter } from "../middlewares/rate-limit.middleware.js";

export const conversationRoute = express.Router();

conversationRoute.post(
  "/",
  sensitiveRateLimiter,
  validateCreateConversation,
  checkFriendship,
  createConversation,
);

conversationRoute.get("/", getConversations);

conversationRoute.get(
  "/:conversationId/messages",
  validateGetMessages,
  checkConversationParticipant,
  getMessages,
);

conversationRoute.patch(
  "/:conversationId/seen",
  validateConversationParam,
  checkConversationParticipant,
  markAsSeen,
);
