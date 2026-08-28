import { useAuthStore } from '@/stores/use-auth.store';
import { useChatStore } from '@/stores/use-chat.store';
import { type Conversation } from '@/types/chat.type';
import isEmpty from 'lodash-es/isEmpty';

import { useCallback, useMemo } from 'react';
import * as React from 'react';

import { ChatCard } from '../chat-card.component';
import { UnreadCountBadge } from '../unread-count-badge.component';
import { GroupChatAvatar } from './group-chat-avatar.component';

const GroupChatCardComponent = ({ convo }: { convo: Conversation }) => {
  const user = useAuthStore(state => state.user);
  const activeConversationId = useChatStore(state => state.activeConversationId);
  const setActiveConversation = useChatStore(state => state.setActiveConversation);
  const fetchMessages = useChatStore(state => state.fetchMessages);

  const handleSelectConversation = useCallback(
    async (id: string) => {
      setActiveConversation(id);

      const currentMessages = useChatStore.getState().messages;
      if (isEmpty(currentMessages[id]?.items)) await fetchMessages(id);
    },
    [setActiveConversation, fetchMessages],
  );

  const unreadCount = convo.unreadCounts[user._id];
  const groupName = Array.isArray(convo.group) ? convo.group[0]?.name : convo.group?.name;

  const leftSection = useMemo(
    () => (
      <>
        {unreadCount > 0 && <UnreadCountBadge unreadCount={unreadCount} />}
        <GroupChatAvatar participants={convo.participants} type="chat" />
      </>
    ),
    [unreadCount, convo.participants],
  );

  const subtitle = useMemo(
    () => <p className="text-muted-foreground truncate text-sm">{convo.participants.length} members</p>,
    [convo.participants.length],
  );

  if (!user) return null;

  return (
    <ChatCard
      convoId={convo._id}
      name={groupName}
      unreadCount={unreadCount}
      timeStamp={convo.lastMessage?.createdAt ? new Date(convo.lastMessage.createdAt) : undefined}
      isActive={activeConversationId === convo._id}
      leftSection={leftSection}
      subtitle={subtitle}
      onSelect={handleSelectConversation}
    />
  );
};

export const GroupChatCard = React.memo(GroupChatCardComponent);
GroupChatCard.displayName = 'GroupChatCard';
