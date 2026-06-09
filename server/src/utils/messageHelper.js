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
      content: message.content,
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

const formatConversationForSocket = (conversation) => ({
  _id: conversation._id,
  type: conversation.type,
  participants: (conversation.participants || []).map((p) => {
    const userId = p?.userId?._id?.toString?.() ?? p?.userId?.toString?.();

    return {
      _id: userId,
      displayName: p?.userId?.displayName,
      avatarUrl: p?.userId?.avatarUrl ?? null,
      showOnlineStatus: p?.userId?.showOnlineStatus,
      joinedAt: p?.joinedAt,
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
        .map((p) => {
          if (!p?.userId) return null;
          if (typeof p.userId === "string") return p.userId;
          if (p.userId?._id) return p.userId._id.toString();
          return p.userId.toString();
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
  recipients.forEach((userId) => {
    io.to(userId).emit("new-message", payload);
  });
};
