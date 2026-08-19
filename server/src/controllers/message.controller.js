import mongoose from "mongoose";
import { Conversation } from "../models/Conversation.js";
import { Message } from "../models/Message.js";
import { updateConversationAfterCreateMessage } from "../utils/message-helper.js";
import { emitNewMessage } from "../utils/message-helper.js";
import { uploadAttachmentIfPresent } from "../utils/message-attachment.js";
import {
  createMessageOrCleanupAttachment,
  saveConversationOrRollbackMessage,
} from "../utils/message-persistence.js";
import { io } from "../sockets/index.js";

export const sendDirectMessage = async (req, res) => {
  try {
    const { recipientId, content = "", conversationId, clientMessageId } = req.body;
    const senderId = req.user._id;
    const file = req.file;

    const trimmedContent = content?.trim();
    if (!trimmedContent && !file)
      return res
        .status(400)
        .json({ message: "Message content or attachment is required" });

    let conversation;

    if (conversationId)
      conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      conversation = await Conversation.create({
        type: "direct",
        participants: [
          { userId: senderId, joinedAt: new Date() },
          { userId: recipientId, joinedAt: new Date() },
        ],
        lastMessageAt: new Date(),
        unreadCounts: new Map(),
      });
    }

    const messageData = {
      conversationId: conversation._id,
      senderId,
      content: trimmedContent || undefined,
      clientMessageId: clientMessageId || undefined,
    };

    const { attachmentFields, uploadedPublicId, uploadedResourceType } =
      await uploadAttachmentIfPresent(file);

    Object.assign(messageData, attachmentFields);

    const message = await createMessageOrCleanupAttachment(
      messageData,
      uploadedPublicId,
      uploadedResourceType,
    );

    updateConversationAfterCreateMessage(conversation, message, senderId);
    await conversation.populate([
      { path: "participants.userId", select: "displayName avatarUrl" },
    ]);

    await saveConversationOrRollbackMessage(
      conversation,
      message,
      uploadedPublicId,
      uploadedResourceType,
    );

    emitNewMessage({ io, conversation, message });

    return res.status(201).json({ message });
  } catch (e) {
    console.error("Send direct message error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getSafeDownloadFilename = (fileName) => {
  if (!fileName) return "attachment";

  return fileName
    .replace(/[\n\r\u0000-\u001f]/g, "_")
    .replace(/"|\\/g, "_")
    .trim();
};

const getAsciiFallbackFilename = (fileName) => {
  const normalized = fileName.normalize("NFKD").replace(/\p{Diacritic}/gu, "");
  const fallback = normalized.replace(/[^A-Za-z0-9_.\- ]+/g, "_").trim();

  return fallback || "attachment";
};

export const downloadMessageAttachment = async (req, res) => {
  try {
    const { messageId } = req.params;

    if (!mongoose.isValidObjectId(messageId))
      return res.status(400).json({ message: "Invalid message ID" });

    const message = await Message.findById(messageId);
    if (!message || !message.fileUrl || !message.fileName)
      return res.status(404).json({ message: "Attachment not found" });

    const conversation = await Conversation.findById(
      message.conversationId,
    ).lean();

    if (!conversation)
      return res.status(404).json({ message: "Conversation not found" });

    const userId = req.user._id.toString();
    const isParticipant = (conversation.participants || []).some((p) => {
      const participantId = p?.userId;
      if (!participantId) return false;

      return typeof participantId === "string"
        ? participantId === userId
        : participantId._id?.toString() === userId;
    });

    if (!isParticipant) return res.status(403).json({ message: "Forbidden" });

    const response = await fetch(message.fileUrl);
    if (!response.ok) {
      console.error(
        "Cloudinary download failed:",
        response.status,
        response.statusText,
      );

      return res.status(502).json({ message: "Unable to download attachment" });
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const contentType =
      message.fileType ||
      response.headers.get("content-type") ||
      "application/octet-stream";
    const safeFileName = getSafeDownloadFilename(message.fileName);
    const asciiFallback = getAsciiFallbackFilename(safeFileName);
    const disposition = `attachment; filename="${asciiFallback}"; filename*=UTF-8''${encodeURIComponent(safeFileName)}`;

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", disposition);
    if (buffer.length) res.setHeader("Content-Length", buffer.length);

    return res.send(buffer);
  } catch (e) {
    console.error("Download message attachment error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const sendGroupMessage = async (req, res) => {
  try {
    const { conversationId, content = "", clientMessageId } = req.body;
    const senderId = req.user._id;
    const conversation = req.conversation;
    const file = req.file;

    const trimmedContent = content?.trim();
    if (!trimmedContent && !file)
      return res
        .status(400)
        .json({ message: "Message content or attachment is required" });

    const messageData = {
      conversationId,
      senderId,
      content: trimmedContent || undefined,
      clientMessageId: clientMessageId || undefined,
    };

    const { attachmentFields, uploadedPublicId, uploadedResourceType } =
      await uploadAttachmentIfPresent(file);

    Object.assign(messageData, attachmentFields);

    const message = await createMessageOrCleanupAttachment(
      messageData,
      uploadedPublicId,
      uploadedResourceType,
    );

    updateConversationAfterCreateMessage(conversation, message, senderId);

    await saveConversationOrRollbackMessage(
      conversation,
      message,
      uploadedPublicId,
      uploadedResourceType,
    );

    emitNewMessage({ io, conversation, message });

    return res.status(201).json({ message });
  } catch (e) {
    console.error("Send group message error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};
