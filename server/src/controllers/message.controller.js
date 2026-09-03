import mongoose from "mongoose";
import { Conversation } from "../models/Conversation.js";
import { Message } from "../models/Message.js";
import { AttachmentSendGroup } from "../models/AttachmentSendGroup.js";
import { updateConversationAfterCreateMessage } from "../utils/message-helper.js";
import { emitNewMessage, buildDirectKey } from "../utils/message-helper.js";
import { uploadAttachmentIfPresent } from "../utils/message-attachment.js";
import {
  createMessageOrCleanupAttachment,
  saveConversationOrRollbackMessage,
} from "../utils/message-persistence.js";
import { io } from "../sockets/index.js";

const MAX_ATTACHMENTS_PER_SEND = 10;

export const sendDirectMessage = async (req, res) => {
  try {
    const {
      recipientId,
      content = "",
      conversationId,
      clientMessageId,
      createdAt,
      clientSequence,
      clientGroupId,
    } = req.body;
    const senderId = req.user._id;
    const file = req.file;

    const trimmedContent = content?.trim();
    if (!trimmedContent && !file)
      return res
        .status(400)
        .json({ message: "Message content or attachment is required" });

    let conversation;

    if (conversationId) {
      conversation = await Conversation.findById(conversationId);

      if (!conversation)
        return res.status(404).json({ message: "Conversation not found" });

      if (conversation.type !== "direct")
        return res.status(400).json({ message: "Invalid conversation type" });

      const senderId = req.user._id.toString();
      const participants = conversation.participants || [];

      const senderParticipant = participants.find(
        (p) => p?.userId?.toString() === senderId,
      );

      if (!senderParticipant)
        return res.status(403).json({ message: "You are not a participant of this conversation" });

      const recipientParticipant = participants.find(
        (p) => p?.userId?.toString() === recipientId,
      );

      if (!recipientParticipant)
        return res.status(403).json({ message: "Recipient is not a participant of this conversation" });
    } else {
      const directKey = buildDirectKey(senderId, recipientId);

      try {
        conversation = await Conversation.findOneAndUpdate(
          { directKey },
          {
            $setOnInsert: {
              type: "direct",
              directKey,
              participants: [
                { userId: senderId, joinedAt: new Date() },
                { userId: recipientId, joinedAt: new Date() },
              ],
              lastMessageAt: new Date(),
              unreadCounts: new Map(),
            },
          },
          { new: true, upsert: true },
        );
      } catch (e) {
        if (e?.code === 11000) {
          conversation = await Conversation.findOne({ directKey });
        } else {
          throw e;
        }
      }
    }

    let didReserveAttachmentSlot = false;

    try {
      if (clientMessageId) {
        const existing = await Message.findOne({
          senderId,
          clientMessageId,
        });

        if (existing) {
          await conversation.populate([
            { path: "participants.userId", select: "displayName avatarUrl" },
          ]);

          return res.status(200).json({ message: existing });
        }
      }

      if (clientGroupId) {
        const group = await AttachmentSendGroup.findOneAndUpdate(
          { senderId, clientGroupId },
          { $inc: { count: 1 } },
          { new: true, upsert: true },
        );

        if (group.count > MAX_ATTACHMENTS_PER_SEND) {
          await AttachmentSendGroup.updateOne(
            { senderId, clientGroupId },
            { $inc: { count: -1 } },
          ).catch(() => {});

          return res.status(400).json({
            message: `You can only send up to ${MAX_ATTACHMENTS_PER_SEND} files at a time.`,
            code: "MAX_ATTACHMENTS_PER_SEND_EXCEEDED",
          });
        }

        didReserveAttachmentSlot = true;
      }

      const messageData = {
        conversationId: conversation._id,
        senderId,
        content: trimmedContent || undefined,
        clientMessageId: clientMessageId || undefined,
        clientSequence: clientSequence ?? undefined,
        clientGroupId: clientGroupId || undefined,
        ...(createdAt ? { createdAt: new Date(createdAt) } : {}),
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
      if (didReserveAttachmentSlot && clientGroupId) {
        await AttachmentSendGroup.updateOne(
          { senderId, clientGroupId },
          { $inc: { count: -1 } },
        ).catch(() => {});
      }

      console.error("Send direct message error:", e);
      return res.status(500).json({ message: "Internal server error" });
    }
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
    const {
      conversationId,
      content = "",
      clientMessageId,
      createdAt,
      clientSequence,
      clientGroupId,
    } = req.body;
    const senderId = req.user._id;
    const conversation = req.conversation;
    const file = req.file;

    const trimmedContent = content?.trim();
    if (!trimmedContent && !file)
      return res
        .status(400)
        .json({ message: "Message content or attachment is required" });

    let didReserveAttachmentSlot = false;

    try {
      if (clientMessageId) {
        const existing = await Message.findOne({
          senderId,
          clientMessageId,
        });

        if (existing) return res.status(200).json({ message: existing });
      }

      if (clientGroupId) {
        const group = await AttachmentSendGroup.findOneAndUpdate(
          { senderId, clientGroupId },
          { $inc: { count: 1 } },
          { new: true, upsert: true },
        );

        if (group.count > MAX_ATTACHMENTS_PER_SEND) {
          await AttachmentSendGroup.updateOne(
            { senderId, clientGroupId },
            { $inc: { count: -1 } },
          ).catch(() => {});

          return res.status(400).json({
            message: `You can only send up to ${MAX_ATTACHMENTS_PER_SEND} files at a time.`,
            code: "MAX_ATTACHMENTS_PER_SEND_EXCEEDED",
          });
        }

        didReserveAttachmentSlot = true;
      }

      const messageData = {
        conversationId,
        senderId,
        content: trimmedContent || undefined,
        clientMessageId: clientMessageId || undefined,
        clientSequence: clientSequence ?? undefined,
        clientGroupId: clientGroupId || undefined,
        ...(createdAt ? { createdAt: new Date(createdAt) } : {}),
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
      if (didReserveAttachmentSlot && clientGroupId) {
        await AttachmentSendGroup.updateOne(
          { senderId, clientGroupId },
          { $inc: { count: -1 } },
        ).catch(() => {});
      }

      console.error("Send group message error:", e);
      return res.status(500).json({ message: "Internal server error" });
    }
  } catch (e) {
    console.error("Send group message error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};
