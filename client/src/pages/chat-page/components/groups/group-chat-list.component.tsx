import { useChatStore } from '@/stores/use-chat-store.ts';

import { GroupChatCard } from './group-chat-card.component';
import map from 'lodash-es/map';
import filter from 'lodash-es/filter';

export const GroupChatList = () => {
  const { conversations } = useChatStore();

  if (!conversations) return;

  const groupConversations = filter(conversations, convo => convo.type === 'group');

  return (
    <div className="flex-1 p-2 space-y-3 overflow-y-auto px-2">
      {map(groupConversations, convo => (
        <GroupChatCard key={convo._id} convo={convo} />
      ))}
    </div>
  );
};
