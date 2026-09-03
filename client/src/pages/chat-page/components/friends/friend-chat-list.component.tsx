import { useChatStore } from '@/stores/use-chat.store';
import filter from 'lodash-es/filter';
import isEmpty from 'lodash-es/isEmpty';
import map from 'lodash-es/map';

import { CONVERSATION_TYPES } from '@/utils/constants';

import { ConversationEmptyState } from '../chat-windows/conversation-empty-state.component';
import { ConversationListSkeleton } from '../chat-windows/conversation-list-skeleton.component';
import { FriendChatCard } from './friend-chat-card.component';

export const FriendChatList = () => {
  const conversations = useChatStore(state => state.conversations);
  const convoLoading = useChatStore(state => state.convoLoading);

  if (convoLoading) return <ConversationListSkeleton count={5} />;

  const friendConversations = filter(conversations, convo => convo.type === CONVERSATION_TYPES.DIRECT);

  if (isEmpty(friendConversations)) return <ConversationEmptyState type="friend" />;

  return (
    <div className="beautiful-scrollbar flex-1 space-y-3 overflow-y-auto p-2 px-2">
      {map(friendConversations, convo => (
        <FriendChatCard key={convo._id} convo={convo} />
      ))}
    </div>
  );
};
