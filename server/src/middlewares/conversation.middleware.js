import { Conversation } from "../models/Conversation.js";

export const checkConversationParticipant = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id.toString();

    const conversation = await Conversation.findById(conversationId).lean();

    if (!conversation)
      return res.status(404).json({ message: "Conversation not found" });

    const isParticipant = (conversation.participants || []).some((p) => {
      const participantId = p?.userId;
      if (!participantId) return false;

      return typeof participantId === "string"
        ? participantId === userId
        : participantId._id?.toString() === userId;
    });

    if (!isParticipant)
      return res
        .status(403)
        .json({ message: "You are not a participant of this conversation" });

    req.conversation = conversation;
    next();
  } catch (e) {
    console.error("Check conversation participant error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};
