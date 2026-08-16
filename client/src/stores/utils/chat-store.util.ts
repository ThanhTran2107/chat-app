import type { Conversation, Message } from '@/types/chat.type';
import map from 'lodash-es/map';
import some from 'lodash-es/some';

export const attachOwnership = <T extends Pick<Message, 'senderId'>>(message: T, userId: string | undefined) => ({
  ...message,
  isOwn: message.senderId === userId,
});

export const conversationExists = (conversations: Conversation[], conversationId: string) =>
  some(conversations, c => c._id.toString() === conversationId.toString());

export const isMessageDuplicate = (items: Message[], messageId: string) => some(items, m => m._id === messageId);

export const clearSeenByForActiveConversation = (conversations: Conversation[], activeConversationId: string | null) =>
  map(conversations, convo => (convo._id === activeConversationId ? { ...convo, seenBy: [] } : convo));

export const serializeConversationForStorage = (convo: Conversation) => ({
  _id: convo._id,
  type: convo.type,
  group: convo.group,
  participants: convo.participants,
  lastMessage: convo.lastMessage,
  lastMessageAt: convo.lastMessageAt,
  unreadCounts: convo.unreadCounts,
  seenBy: convo.seenBy,
  createdAt: convo.createdAt,
  updatedAt: convo.updatedAt,
});
