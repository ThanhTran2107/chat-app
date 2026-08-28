import express from "express";
import {
  checkFriendship,
  checkGroupMemberShip,
} from "../middlewares/friend.middleware.js";
import { uploadChatAttachmentSingle } from "../middlewares/chat-upload.middleware.js";
import { uploadRateLimiter } from "../middlewares/upload-rate-limit.middleware.js";
import {
  sendDirectMessage,
  sendGroupMessage,
  downloadMessageAttachment,
} from "../controllers/message.controller.js";
import {
  validateSendDirectMessage,
  validateSendGroupMessage,
  validateMessageParam,
} from "../validators/message.validator.js";

export const messageRoute = express.Router();

messageRoute.get("/download/:messageId", validateMessageParam, downloadMessageAttachment);

messageRoute.post(
  "/direct",
  uploadRateLimiter,
  uploadChatAttachmentSingle,
  validateSendDirectMessage,
  checkFriendship,
  sendDirectMessage,
);

messageRoute.post(
  "/group",
  uploadRateLimiter,
  uploadChatAttachmentSingle,
  validateSendGroupMessage,
  checkGroupMemberShip,
  sendGroupMessage,
);
