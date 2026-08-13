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
  const pendingNewMessagesRef = useRef(0);
  const prevLastMessageIdRef = useRef<string | undefined>(undefined);
  const didInitialScrollRef = useRef(false);
  const prevMessagesLengthRef = useRef(0);
  const prevLatestMessageIdRef = useRef<string | undefined>(undefined);
  const scrollRestoreRef = useRef<{
    oldScrollTop: number;
    oldScrollHeight: number;
    oldMessagesLength: number;
    pending: boolean;
  } | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const prevActiveConversationIdRef = useRef<string | null | undefined>(undefined);
  const fetchInProgressRef = useRef(false);
  const handleFetchMoreMessagesRef = useRef<(() => void) | null>(null);
  const manualTriggeredRef = useRef(false);

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
    manualTriggeredRef.current = false;
  }, [messages.length]);

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
  }, [isLoadingMore]);

  useEffect(() => {
    if (!hasMore) return;

    const container = containerRef.current;
    if (!container) return;

    let rafId = 0;
    let wasAtTop = false;
    const threshold = 100;

    const checkBoundary = () => {
      const scrollTop = container.scrollTop;
      const atTopBoundary = scrollTop <= threshold;

      if (atTopBoundary && !wasAtTop) wasAtTop = atTopBoundary;

      wasAtTop = atTopBoundary;
    };

    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        checkBoundary();
        rafId = 0;
      });
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [hasMore, isLoadingMore, messages.length]);

  useEffect(() => {
    if (!hasMore) return;

    const container = containerRef.current;
    if (!container) return;

    let rafId = 0;
    let wasAtTop = false;
    const threshold = 100;

    const check = () => {
      const atTop = container.scrollTop <= threshold;

      if (atTop && !wasAtTop && !manualTriggeredRef.current && !isLoadingMore && !fetchInProgressRef.current) {
        manualTriggeredRef.current = true;

        scrollRestoreRef.current = {
          oldScrollTop: container.scrollTop,
          oldScrollHeight: container.scrollHeight,
          oldMessagesLength: messages.length,
          pending: true,
        };

        setIsLoadingMore(true);

        if (!activeConversationId) return setIsLoadingMore(false);

        handleFetchMoreMessagesRef.current?.();
      }

      wasAtTop = atTop;
    };

    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      
      rafId = requestAnimationFrame(() => {
        check();
        rafId = 0;
      });
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [hasMore, isLoadingMore, activeConversationId, messages.length]);

  useEffect(() => {
    const previousActiveConversationId = prevActiveConversationIdRef.current;
    const isActualSwitch =
      previousActiveConversationId !== undefined && previousActiveConversationId !== activeConversationId;

    if (isActualSwitch) {
      pendingNewMessagesRef.current = 0;
      prevLastMessageIdRef.current = undefined;
      didInitialScrollRef.current = false;
      prevMessagesLengthRef.current = 0;
      prevLatestMessageIdRef.current = undefined;
      isNearBottomRef.current = true;
      scrollRestoreRef.current = null;
      fetchInProgressRef.current = false;
      manualTriggeredRef.current = false;
      setNewMessageCount(0);
    }

    prevActiveConversationIdRef.current = activeConversationId;
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

    const didInitialScroll = didInitialScrollRef.current;
    const scrollRestorePending = scrollRestoreRef.current?.pending ?? false;
    const prevMessagesLength = prevMessagesLengthRef.current;
    const prevLatestMessageId = prevLatestMessageIdRef.current;
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    const isOlderMessagesLoaded = messages.length > prevMessagesLength && latestMessageId === prevLatestMessageId;

    if (scrollRestorePending) {
      const { oldScrollTop, oldScrollHeight, oldMessagesLength } = scrollRestoreRef.current!;
      const delta = container.scrollHeight - oldScrollHeight;
      const messagesPreprended = messages.length > oldMessagesLength;

      if (delta > 0 || messagesPreprended) {
        if (delta > 0) container.scrollTop = oldScrollTop + delta;

        scrollRestoreRef.current = null;
        return;
      }

      return;
    }

    if (!didInitialScroll && messages.length > 0) {
      container.scrollTop = container.scrollHeight;
      didInitialScrollRef.current = true;

      return;
    }

    if (isNearBottom && !isOlderMessagesLoaded) container.scrollTop = container.scrollHeight;

    prevMessagesLengthRef.current = messages.length;
    prevLatestMessageIdRef.current = latestMessageId;
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
  }, [isLoadingMore]);

  const scrollToBottom = () => {
    const container = containerRef.current;
    if (!container) return;

    container.scrollTop = container.scrollHeight;
    pendingNewMessagesRef.current = 0;
    setNewMessageCount(0);
  };

  const handleFetchMoreMessages = async () => {
    if (!activeConversationId) return;

    if (fetchInProgressRef.current) return;

    fetchInProgressRef.current = true;

    const container = containerRef.current;

    if (container)
      scrollRestoreRef.current = {
        oldScrollTop: container.scrollTop,
        oldScrollHeight: container.scrollHeight,
        oldMessagesLength: messages.length,
        pending: true,
      };

    setIsLoadingMore(true);

    try {
      await fetchMessages(activeConversationId);
    } catch (e) {
      console.error('Fetch more messages error:', e);
    } finally {
      fetchInProgressRef.current = false;
      manualTriggeredRef.current = false;
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    handleFetchMoreMessagesRef.current = handleFetchMoreMessages;
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
          next={() => handleFetchMoreMessagesRef.current?.()}
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
  );
};
