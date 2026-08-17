import { useChatStore } from '@/stores/use-chat-store.ts';
import filter from 'lodash-es/filter';
import map from 'lodash-es/map';

import { CONVERSATION_TYPES } from '@/utils/constants';

import { GroupChatCard } from './group-chat-card.component';

export const GroupChatList = () => {
  const conversations = useChatStore(state => state.conversations);

  if (!conversations) return;

  const groupConversations = filter(conversations, convo => convo.type === CONVERSATION_TYPES.GROUP);

  return (
    <div className="beautiful-scrollbar flex-1 space-y-3 overflow-y-auto p-2 px-2">
      {map(groupConversations, convo => (
        <GroupChatCard key={convo._id} convo={convo} />
      ))}
    </div>
  );
};
