import { useChatStore } from '@/stores/use-chat-store.ts';
import filter from 'lodash-es/filter';
import map from 'lodash-es/map';

import { GroupChatCard } from './group-chat-card.component';

export const GroupChatList = () => {
  const { conversations } = useChatStore();

  if (!conversations) return;

  const groupConversations = filter(conversations, convo => convo.type === 'group');

  return (
    <div className="flex-1 space-y-3 overflow-y-auto p-2 px-2">
      {map(groupConversations, convo => (
        <GroupChatCard key={convo._id} convo={convo} />
      ))}
    </div>
  );
};
