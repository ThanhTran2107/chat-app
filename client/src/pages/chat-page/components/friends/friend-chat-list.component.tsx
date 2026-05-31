import { useChatStore } from '@/stores/use-chat-store';

import { FriendChatCard } from './friend-chat-card.component';
import map from 'lodash-es/map';
import filter from 'lodash-es/filter';

export const FriendChatList = () => {
  const { conversations } = useChatStore();

  if (!conversations) return null;

  const friendConversations = filter(conversations, convo => convo.type === 'direct');

  return (
    <div className="flex-1 space-y-2 overflow-y-auto px-2">
      {map(friendConversations, convo => (
        <FriendChatCard key={convo._id} convo={convo} />
      ))}
    </div>
  );
};
