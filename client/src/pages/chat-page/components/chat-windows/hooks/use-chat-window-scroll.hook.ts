import type { Message } from '@/types/chat.type';

import { type RefObject, useEffect, useLayoutEffect, useRef, useState } from 'react';

interface UseChatWindowScrollParams {
  containerRef: RefObject<HTMLDivElement | null>;
  activeConversationId: string | null | undefined;
  messages: Message[];
  hasMore: boolean;
  fetchMessages: (conversationId: string) => Promise<unknown>;
  latestMessageId: string | undefined;
}

export const useChatWindowScroll = ({
  containerRef,
  activeConversationId,
  messages,
  hasMore,
  fetchMessages,
  latestMessageId,
}: UseChatWindowScrollParams) => {
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
  }, [containerRef]);

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
  }, [hasMore, isLoadingMore, messages.length, containerRef]);

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
  }, [hasMore, isLoadingMore, activeConversationId, messages.length, containerRef]);

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
    const wasNearBottom = isNearBottomRef.current;
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
      isNearBottomRef.current = true;

      return;
    }

    if (wasNearBottom && !isOlderMessagesLoaded) container.scrollTop = container.scrollHeight;

    isNearBottomRef.current = container.scrollHeight - container.scrollTop - container.clientHeight < 100;

    prevMessagesLengthRef.current = messages.length;
    prevLatestMessageIdRef.current = latestMessageId;
  }, [messages, latestMessageId, activeConversationId, isLoadingMore, containerRef]);

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

  return {
    newMessageCount,
    scrollToBottom,
    handleFetchMoreMessages: () => handleFetchMoreMessagesRef.current?.(),
  };
};
