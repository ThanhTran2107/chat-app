import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      trim: true,
    },
    imgUrl: {
      type: String,
    },
    fileUrl: {
      type: String,
    },
    fileName: {
      type: String,
    },
    fileType: {
      type: String,
    },
    fileSize: {
      type: Number,
    },
    clientMessageId: {
      type: String,
      index: true,
      sparse: true,
    },
    clientSequence: {
      type: Number,
      index: true,
      sparse: true,
    },
    clientGroupId: {
      type: String,
      index: true,
      sparse: true,
    },
  },
  { timestamps: true },
);

messageSchema.index({ conversationId: 1, createdAt: -1, clientSequence: -1 });
messageSchema.index({ senderId: 1, clientMessageId: 1 }, { unique: true, sparse: true });

export const Message = mongoose.model("Message", messageSchema);
