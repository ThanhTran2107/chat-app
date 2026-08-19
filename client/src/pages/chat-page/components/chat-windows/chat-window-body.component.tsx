import { useChatStore } from '@/stores/use-chat.store';
import { find, isEmpty, map, some } from 'lodash-es';

import { useMemo, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { Skeleton } from '@/components/antd/skeleton.component';
import { Button } from '@/components/ui/button';

import { CONVERSATION_TYPES } from '@/utils/constants';

import { MessageItem } from '../messages/message-item.component';
import { ChatWelcomeScreen } from './chat-welcome-screen.component';
import { useChatWindowScroll } from './hooks/use-chat-window-scroll.hook';

export const ChatWindowBody = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const activeConversationId = useChatStore(state => state.activeConversationId);

  const messages = useChatStore(state => {
    const convMsgs = state.messages[state.activeConversationId ?? ''];
    return convMsgs?.items ?? [];
  });

  const hasMore = useChatStore(state => {
    const convMsgs = state.messages[state.activeConversationId ?? ''];
    return convMsgs?.hasMore ?? false;
  });

  const fetchMessages = useChatStore(state => state.fetchMessages);

  const selectedConvo = useChatStore(state => {
    const activeId = state.activeConversationId;
    return find(state.conversations, c => c._id === activeId) ?? null;
  });

  const lastMessageStatus = selectedConvo && isEmpty(selectedConvo.seenBy ?? []) ? 'delivered' : 'seen';

  const isUnavailableConversation =
    selectedConvo?.type === CONVERSATION_TYPES.DIRECT &&
    some(selectedConvo.participants, participant => !participant._id);

  const reversedMessages = useMemo(() => [...messages].reverse(), [messages]);
  const latestMessageId = messages[messages.length - 1]?._id;

  const { newMessageCount, scrollToBottom, handleFetchMoreMessages } = useChatWindowScroll({
    containerRef,
    activeConversationId,
    messages,
    hasMore,
    fetchMessages,
    latestMessageId,
  });

  if (!selectedConvo) return <ChatWelcomeScreen />;

  if (isUnavailableConversation)
    return (
      <div className="text-muted-foreground flex h-full items-center justify-center px-4 text-center">
        <div>
          <p className="text-lg font-semibold">Unavailable conversation</p>
          <p className="text-muted-foreground mt-2 text-sm">
            This chat is no longer available because the other account has been deleted.
          </p>
        </div>
      </div>
    );

  if (isEmpty(messages))
    return (
      <div className="text-muted-foreground flex h-full items-center justify-center">Start a conversation now!</div>
    );

  return (
    <div className="bg-primary-foreground relative flex h-full min-h-0 flex-1 flex-col p-4">
      <div
        id="scrollableDiv"
        ref={containerRef}
        className="beautiful-scrollbar scrollbar-hidden min-h-0 flex-1 flex-col-reverse gap-3 overflow-x-hidden overflow-y-auto pb-5"
      >
        <InfiniteScroll
          dataLength={messages.length}
          next={handleFetchMoreMessages}
          hasMore={hasMore}
          loader={
            <div className="flex flex-col gap-3 py-2">
              <div className="flex items-start gap-2">
                <Skeleton.Avatar active size={32} />
                <Skeleton active className="bg-muted! h-14 w-full max-w-xs rounded-2xl lg:max-w-md" />
              </div>
              <div className="flex items-start justify-end gap-2">
                <Skeleton active className="bg-muted! h-12 w-full max-w-xs rounded-2xl lg:max-w-md" />
              </div>
              <div className="flex items-start gap-2">
                <div className="size-8" />
                <Skeleton active className="bg-muted! h-12 w-full max-w-xs rounded-2xl lg:max-w-md" />
              </div>
            </div>
          }
          scrollableTarget="scrollableDiv"
          inverse={true}
          style={{ display: 'flex', flexDirection: 'column-reverse', overflow: 'visible' }}
        >
          {map(reversedMessages, (message, index) => (
            <div key={message.clientMessageId || message._id} className="text-foreground px-3 py-2 wrap-break-word">
              <MessageItem
                message={message}
                index={index}
                messages={reversedMessages}
                selectedConvo={selectedConvo}
                lastMessageStatus={lastMessageStatus}
              />
            </div>
          ))}
        </InfiniteScroll>
      </div>
      {newMessageCount > 0 && (
        <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2">
          <Button
            onClick={scrollToBottom}
            variant="default"
            size="sm"
            className="cursor-pointer rounded-full shadow-lg"
          >
            {newMessageCount} new message{newMessageCount > 1 ? 's' : ''} ↓
          </Button>
        </div>
      )}
    </div>
  );
};
