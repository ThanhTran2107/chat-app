import express from "express";
import {
  checkFriendship,
  checkGroupMemberShip,
} from "../middlewares/friend.middleware.js";
import { uploadChatAttachmentSingle } from "../middlewares/chat-upload.middleware.js";
import {
  sendDirectMessage,
  sendGroupMessage,
  downloadMessageAttachment,
} from "../controllers/message.controller.js";

export const messageRoute = express.Router();

messageRoute.get("/download/:messageId", downloadMessageAttachment);

messageRoute.post(
  "/direct",
  uploadChatAttachmentSingle,
  checkFriendship,
  sendDirectMessage,
);

messageRoute.post(
  "/group",
  uploadChatAttachmentSingle,
  checkGroupMemberShip,
  sendGroupMessage,
);
