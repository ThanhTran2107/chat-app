import { useAuthStore } from '@/stores/use-auth-store.ts';
import { useChatStore } from '@/stores/use-chat-store.ts';
import { useSocketStore } from '@/stores/use-socket-store';
import { type Conversation } from '@/types/chat.type';
import find from 'lodash-es/find';

import * as React from 'react';

import { DELETED_ACCOUNT_LABEL, PRESENCE_STATUS } from '@/utils/constants';

import { cn } from '@/lib/utils';

import { ChatCard } from '../chat-card.component';
import { StatusBadge } from '../status-badge.component';
import { UnreadCountBadge } from '../unread-count-badge.component';
import { UserAvatar } from './user-avatar.component';

const FriendChatCardComponent = ({ convo }: { convo: Conversation }) => {
  const user = useAuthStore(state => state.user);
  const activeConversationId = useChatStore(state => state.activeConversationId);
  const setActiveConversation = useChatStore(state => state.setActiveConversation);
  const messages = useChatStore(state => state.messages);
  const fetchMessages = useChatStore(state => state.fetchMessages);
  const friendPresence = useSocketStore(state => state.friendPresence);
  const onlineUsers = useSocketStore(state => state.onlineUsers);

  if (!user) return null;

  const otherUser = find(convo.participants, participant => participant._id !== user._id);
  const isDeleted = !otherUser?._id;
  const otherUserName = otherUser?.displayName ?? DELETED_ACCOUNT_LABEL;
  const isOnline =
    !isDeleted &&
    (friendPresence[otherUser?._id ?? ''] === PRESENCE_STATUS.ONLINE ||
      (friendPresence[otherUser?._id ?? ''] === undefined &&
        otherUser?.showOnlineStatus !== false &&
        onlineUsers.has(otherUser?._id ?? '')));

  const unreadCount = convo.unreadCounts[user._id];
  const lastMessage = convo.lastMessage?.content ?? '';

  const handleSelectConversation = async (id: string) => {
    setActiveConversation(id);

    if (!messages[id]) await fetchMessages(id);
  };

  return (
    <ChatCard
      convoId={convo._id}
      name={otherUserName}
      timeStamp={convo.lastMessage?.createdAt ? new Date(convo.lastMessage.createdAt) : undefined}
      isActive={activeConversationId === convo._id}
      unreadCount={unreadCount}
      leftSection={
        <>
          <UserAvatar
            type="sidebar"
            name={otherUserName}
            avatarUrl={otherUser?.avatarUrl ?? undefined}
            className={isDeleted ? 'bg-slate-400' : undefined}
          />
          <StatusBadge status={isOnline ? PRESENCE_STATUS.ONLINE : PRESENCE_STATUS.OFFLINE} />
          {unreadCount > 0 && <UnreadCountBadge unreadCount={unreadCount} />}
        </>
      }
      subtitle={
        <p
          className={cn('truncate text-sm', unreadCount > 0 ? 'text-foreground font-medium' : 'text-muted-foreground')}
        >
          {lastMessage}
        </p>
      }
      onSelect={handleSelectConversation}
    />
  );
};

export const FriendChatCard = React.memo(FriendChatCardComponent);
FriendChatCard.displayName = 'FriendChatCard';
