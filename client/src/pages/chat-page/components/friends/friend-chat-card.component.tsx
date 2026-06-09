import { useAuthStore } from '@/stores/use-auth-store.ts';
import { useChatStore } from '@/stores/use-chat-store.ts';
import { useSocketStore } from '@/stores/use-socket-store';
import { type Conversation } from '@/types/chat.ts';

import { cn } from '@/lib/utils';

import { ChatCard } from '../chat-card.component';
import { StatusBadge } from '../status-badge.component';
import { UnreadCountBadge } from '../unread-count-badge.component';
import { UserAvatar } from './user-avatar.component';

export const FriendChatCard = ({ convo }: { convo: Conversation }) => {
  const { user } = useAuthStore();
  const { activeConversationId, setActiveConversation, messages, fetchMessages } = useChatStore();
  const { friendPresence } = useSocketStore();

  if (!user) return null;

  const otherUser = convo.participants.find(participant => participant._id !== user._id);

  if (!otherUser) return null;

  const unreadCount = convo.unreadCounts[user._id];
  const lastMessage = convo.lastMessage?.content ?? '';

  const handleSelectConversation = async (id: string) => {
    setActiveConversation(id);

    if (!messages[id]) await fetchMessages(id);
  };

  return (
    <ChatCard
      convoId={convo._id}
      name={otherUser.displayName ?? ''}
      timeStamp={convo.lastMessage?.createdAt ? new Date(convo.lastMessage.createdAt) : undefined}
      isActive={activeConversationId === convo._id}
      unreadCount={unreadCount}
      leftSection={
        <>
          <UserAvatar type="sidebar" name={otherUser.displayName ?? ''} avatarUrl={otherUser.avatarUrl ?? undefined} />
          <StatusBadge status={friendPresence[otherUser?._id ?? ''] === 'online' ? 'online' : 'offline'} />
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
