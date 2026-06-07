import { useChatStore } from '@/stores/use-chat-store';
import { isEmpty, map } from 'lodash-es';

import { useLayoutEffect, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { Spin } from '@/components/antd/spin.component';

import { MessageItem } from '../messages/message-item.component';
import { ChatWelcomeScreen } from './chat-welcome-screen.component';

export const ChatWindowBody = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { activeConversationId, messages: allMessages, conversations, fetchMessages } = useChatStore();

  const selectedConvo = conversations.find(conversation => conversation._id === activeConversationId);
  const lastMessageStatus = !isEmpty(selectedConvo?.seenBy ?? []) ? 'seen' : 'delivered';

  const conversationMessages = activeConversationId ? allMessages[activeConversationId] : undefined;
  const messages = conversationMessages?.items ?? [];
  const hasMore = conversationMessages?.hasMore ?? false;

  const reversedMessages = [...messages].reverse();

  const key = `chat-scroll-${activeConversationId}`;

  const handleFetchMoreMessages = async () => {
    if (!activeConversationId) return;

    try {
      await fetchMessages(activeConversationId);
    } catch (e) {
      console.error('Fetch more messages error:', e);
    }
  };

  const handleScrollSave = () => {
    const container = containerRef.current;

    if (!container || !activeConversationId) return;

    const maxScrollTop = container.scrollHeight - container.clientHeight;
    const scrollTop = Math.max(0, maxScrollTop - container.scrollTop);

    sessionStorage.setItem(key, JSON.stringify({ scrollTop, scrollHeight: container.scrollHeight }));
  };

  useLayoutEffect(() => {
    if (!messagesEndRef.current) return;

    messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [activeConversationId]);

  useLayoutEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const item = sessionStorage.getItem(key);

    if (item) {
      const { scrollTop: savedFromBottom } = JSON.parse(item);
      const maxScrollTop = container.scrollHeight - container.clientHeight;
      const scrollTop = Math.max(0, maxScrollTop - savedFromBottom);

      requestAnimationFrame(() => (container.scrollTop = scrollTop));
    }
  }, [messages.length, key]);

  if (!selectedConvo) return <ChatWelcomeScreen />;

  if (isEmpty(messages))
    return (
      <div className="text-muted-foreground flex h-full items-center justify-center">Start a conversation now!</div>
    );

  return (
    <div className="bg-primary-foreground flex h-full min-h-0 flex-1 flex-col p-4">
      <div
        id="scrollableDiv"
        ref={containerRef}
        onScroll={handleScrollSave}
        className="beautiful-scrollbar scrollbar-hidden min-h-0 flex-1 flex-col-reverse gap-3 overflow-x-hidden overflow-y-auto pb-5"
      >
        <InfiniteScroll
          dataLength={messages.length}
          next={handleFetchMoreMessages}
          hasMore={hasMore}
          loader={
            <div className="py-2 text-center">
              <Spin size="small" />
            </div>
          }
          scrollableTarget="scrollableDiv"
          inverse={true}
          style={{ display: 'flex', flexDirection: 'column-reverse', overflow: 'visible' }}
        >
          {map(reversedMessages, (message, index) => (
            <div key={message._id} className="text-foreground px-3 py-2 wrap-break-word">
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

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
