import express from "express";
import {
  checkFriendship,
  checkGroupMemberShip,
} from "../middlewares/friendMiddleware.js";
import { uploadChatAttachmentSingle } from "../middlewares/chatUploadMiddleware.js";
import {
  sendDirectMessage,
  sendGroupMessage,
  downloadMessageAttachment,
} from "../controllers/messageController.js";

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
