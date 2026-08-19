import mongoose from "mongoose";

const attachmentSendGroupSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clientGroupId: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

attachmentSendGroupSchema.index(
  { senderId: 1, clientGroupId: 1 },
  { unique: true },
);
attachmentSendGroupSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 });

export const AttachmentSendGroup = mongoose.model(
  "AttachmentSendGroup",
  attachmentSendGroupSchema,
);
