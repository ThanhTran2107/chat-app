import { useAuthStore } from '@/stores/use-auth-store.ts';
import { useChatStore } from '@/stores/use-chat-store.ts';
import { type Conversation } from '@/types/chat.ts';

import { ChatCard } from '../chat-card.component';
import { UnreadCountBadge } from '../unread-count-badge.component';
import { GroupChatAvatar } from './group-chat-avatar.component';

export const GroupChatCard = ({ convo }: { convo: Conversation }) => {
  const { user } = useAuthStore();
  const { activeConversationId, setActiveConversation, messages, fetchMessages } = useChatStore();

  if (!user) return null;

  const unreadCount = convo.unreadCounts[user._id];
  const groupName = Array.isArray(convo.group) ? convo.group[0]?.name : convo.group?.name;

  const handleSelectConversation = async (id: string) => {
    setActiveConversation(id);

    if (!messages[id]?.items?.length) await fetchMessages(id);
  };

  return (
    <ChatCard
      convoId={convo._id}
      name={groupName}
      unreadCount={unreadCount}
      timeStamp={convo.lastMessage?.createdAt ? new Date(convo.lastMessage.createdAt) : undefined}
      isActive={activeConversationId === convo._id}
      leftSection={
        <>
          {unreadCount > 0 && <UnreadCountBadge unreadCount={unreadCount} />}
          <GroupChatAvatar participants={convo.participants} type="chat" />
        </>
      }
      subtitle={<p className="text-muted-foreground truncate text-sm">{convo.participants.length} members</p>}
      onSelect={handleSelectConversation}
    />
  );
};
