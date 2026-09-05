export const buildDirectKey = (userIdA, userIdB) => {
  const ids = [userIdA, userIdB].map((id) => id.toString()).sort();

  return `${ids[0]}_${ids[1]}`;
};

const getMessagePreview = (message) => {
  if (message.content) return message.content;
  if (message.imgUrl) return "📷 Image";
  if (message.fileUrl) return `📎 ${message.fileName ?? "Attachment"}`;

  return "";
};

export const updateConversationAfterCreateMessage = (
  conversation,
  message,
  senderId,
) => {
  conversation.set({
    seenBy: [],
    lastMessageAt: message.createdAt,
    lastMessage: {
      _id: message._id,
      content: getMessagePreview(message),
      senderId,
      createdAt: message.createdAt,
    },
  });

  conversation.unreadCounts = conversation.unreadCounts || new Map();

  conversation.participants.forEach((p) => {
    const memberId = p?.userId?.toString();
    if (!memberId) return;

    const isSender = memberId === senderId.toString();
    const preCount = conversation.unreadCounts.get(memberId) || 0;

    conversation.unreadCounts.set(memberId, isSender ? 0 : preCount + 1);
  });
};

export const formatConversationParticipants = (participants) =>
  (participants || []).map((participant) => ({
    _id: participant.userId?._id,
    displayName: participant.userId?.displayName,
    avatarUrl: participant.userId?.avatarUrl ?? null,
    showOnlineStatus: participant.userId?.showOnlineStatus,
    joinedAt: participant.joinedAt,
  }));

const formatConversationForSocket = (conversation) => ({
  _id: conversation._id,
  type: conversation.type,
  participants: (conversation.participants || []).map((participant) => {
    const userId = participant?.userId?._id?.toString?.() ?? participant?.userId?.toString?.();

    return {
      _id: userId,
      displayName: participant?.userId?.displayName,
      avatarUrl: participant?.userId?.avatarUrl ?? null,
      showOnlineStatus: participant?.userId?.showOnlineStatus,
      joinedAt: participant?.joinedAt,
    };
  }),
  lastMessage: conversation.lastMessage,
  lastMessageAt: conversation.lastMessageAt,
  unreadCounts: conversation.unreadCounts,
});

export const emitNewMessage = ({ io, conversation, message }) => {
  const recipients = Array.from(
    new Set(
      (conversation.participants || [])
        .map((participant) => {
          if (!participant?.userId) return null;
          if (typeof participant.userId === "string") return participant.userId;
          if (participant.userId?._id) return participant.userId._id.toString();
          return participant.userId.toString();
        })
        .filter(Boolean),
    ),
  );

  const payload = {
    message,
    conversation: formatConversationForSocket(conversation),
    unreadCounts: conversation.unreadCounts,
  };

  // emit only to user-specific rooms to avoid duplicate delivery when a socket is also in the conversation room
  recipients.forEach((userId) => io.to(userId).emit("new-message", payload));
};
