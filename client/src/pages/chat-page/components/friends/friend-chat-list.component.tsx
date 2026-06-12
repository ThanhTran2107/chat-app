import { useChatStore } from '@/stores/use-chat-store';
import filter from 'lodash-es/filter';
import map from 'lodash-es/map';

import { FriendChatCard } from './friend-chat-card.component';

export const FriendChatList = () => {
  const { conversations } = useChatStore();

  if (!conversations) return null;

  const friendConversations = filter(conversations, convo => convo.type === 'direct');

  return (
    <div className="beautiful-scrollbar flex-1 space-y-3 overflow-y-auto p-2 px-2">
      {map(friendConversations, convo => (
        <FriendChatCard key={convo._id} convo={convo} />
      ))}
    </div>
  );
};
