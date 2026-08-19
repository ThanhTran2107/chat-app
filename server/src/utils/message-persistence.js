import { Message } from "../models/Message.js";
import { cleanupUploadedAttachment } from "./message-attachment.js";

export const createMessageOrCleanupAttachment = async (
  messageData,
  uploadedPublicId,
  uploadedResourceType,
) => {
  try {
    return await Message.create(messageData);
  } catch (err) {
    await cleanupUploadedAttachment(uploadedPublicId, uploadedResourceType);

    throw err;
  }
};

export const saveConversationOrRollbackMessage = async (
  conversation,
  message,
  uploadedPublicId,
  uploadedResourceType,
) => {
  try {
    return await conversation.save();
  } catch (saveError) {
    if (message?._id) {
      try {
        await Message.findByIdAndDelete(message._id);
      } catch (deleteError) {
        console.error(
          "Failed to delete message after conversation save error:",
          deleteError,
        );
      }
    }

    await cleanupUploadedAttachment(
      uploadedPublicId,
      uploadedResourceType,
      "Failed to cleanup uploaded attachment after conversation save error:",
    );

    throw saveError;
  }
};
