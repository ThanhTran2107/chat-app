import { useChatStore } from '@/stores/use-chat-store';
import { find, isEmpty, map, some } from 'lodash-es';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { Spin } from '@/components/antd/spin.component';
import { Button } from '@/components/ui/button';

import { MessageItem } from '../messages/message-item.component';
import { ChatWelcomeScreen } from './chat-welcome-screen.component';

export const ChatWindowBody = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);
  const scrollPosRef = useRef(0);
  const pendingNewMessagesRef = useRef(0);
  const prevLastMessageIdRef = useRef<string | undefined>(undefined);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [newMessageCount, setNewMessageCount] = useState(0);

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
    selectedConvo?.type === 'direct' && some(selectedConvo.participants, participant => !participant._id);

  const reversedMessages = useMemo(() => [...messages].reverse(), [messages]);
  const latestMessageId = messages[messages.length - 1]?._id;

  useEffect(() => {
    pendingNewMessagesRef.current = 0;
    prevLastMessageIdRef.current = undefined;
    isNearBottomRef.current = true;
    // Reset indicator when switching conversation.
    // This is a legitimate prop-change reset, not a cascading render source.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNewMessageCount(0);
  }, [activeConversationId]);

  useEffect(() => {
    const currentLastId = messages[messages.length - 1]?._id;
    const prevLastId = prevLastMessageIdRef.current;

    if (currentLastId !== prevLastId && prevLastId !== undefined) {
      if (!isNearBottomRef.current) {
        pendingNewMessagesRef.current += 1;
        setNewMessageCount(pendingNewMessagesRef.current);
      }
    }

    prevLastMessageIdRef.current = currentLastId;
  }, [messages]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (isLoadingMore && scrollPosRef.current > 0) {
      container.scrollTop = container.scrollHeight - scrollPosRef.current;
      scrollPosRef.current = 0;
    } else if (isNearBottomRef.current) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, latestMessageId, activeConversationId, isLoadingMore]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const threshold = 100;
      isNearBottomRef.current = container.scrollHeight - container.scrollTop - container.clientHeight < threshold;

      if (isNearBottomRef.current && pendingNewMessagesRef.current > 0) {
        pendingNewMessagesRef.current = 0;
        setNewMessageCount(0);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToBottom = () => {
    const container = containerRef.current;

    if (!container) return;

    container.scrollTop = container.scrollHeight;
    pendingNewMessagesRef.current = 0;
    setNewMessageCount(0);
  };

  const handleFetchMoreMessages = async () => {
    if (!activeConversationId) return;

    const container = containerRef.current;
    if (container) scrollPosRef.current = container.scrollTop;

    setIsLoadingMore(true);

    try {
      await fetchMessages(activeConversationId);
    } catch (e) {
      console.error('Fetch more messages error:', e);
    } finally {
      setIsLoadingMore(false);
    }
  };

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
    <div className="bg-primary-foreground flex h-full min-h-0 flex-1 flex-col p-4">
      <div className="relative min-h-0 flex-1">
        <div
          id="scrollableDiv"
          ref={containerRef}
          className="beautiful-scrollbar scrollbar-hidden absolute inset-0 flex-col-reverse gap-3 overflow-x-hidden overflow-y-auto pb-5"
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
    </div>
  );
};
