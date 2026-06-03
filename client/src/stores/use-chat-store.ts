import { type ChatState } from '@/types/store';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { ChatService } from '@/utils/services/chat.service';
import { useAuthStore } from './use-auth-store';
import isEmpty from 'lodash-es/isEmpty';
import map from 'lodash-es/map';

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      messages: {},
      activeConversationId: null,
      convoLoading: false, // convo loading
      messageLoading: false, // message loading

      setActiveConversation: id => set({ activeConversationId: id }),
      reset: () =>
        set({
          conversations: [],
          messages: {},
          activeConversationId: null,
          convoLoading: false,
          messageLoading: false,
        }),
      fetchConversations: async () => {
        try {
          set({ convoLoading: true });
          const { conversations } = await ChatService.fetchConversations();

          set({ conversations, convoLoading: false });
        } catch (e) {
          console.error('Fetch conversations error:', e);
          set({ convoLoading: false });
        }
      },
      fetchMessages: async conversationId => {
        const { activeConversationId, messages } = get();
        const { user } = useAuthStore.getState();

        const convoId = conversationId ?? activeConversationId;

        if (!convoId) return;

        const current = messages?.[convoId];
        const nextCursor = current?.nextCursor === undefined ? '' : current?.nextCursor;

        if (nextCursor === null) return;

        set({ messageLoading: true });

        try {
          const { messages: fetched, cursor } = await ChatService.fetchMessages(convoId, nextCursor);

          const processed = map(fetched, message => ({ ...message, isOwn: message.senderId === user?._id }));

          set(state => {
            const prev = state.messages[convoId]?.items ?? [];
            const merged = !isEmpty(prev) ? [...processed, ...prev] : processed;

            return {
              messages: {
                ...state.messages,
                [convoId]: { items: merged, hasMore: !!cursor, nextCursor: cursor ?? null },
              },
            };
          });
        } catch (e) {
          console.error('Fetch messages error:', e);
        } finally {
          set({ messageLoading: false });
        }
      },
      sendDirectMessage: async (recipientId, content, imgUrl) => {
        try {
          const { activeConversationId } = get();
          await ChatService.sendDirectMessage(recipientId, content, imgUrl, activeConversationId || undefined);

          set(state => ({
            conversations: map(state.conversations, convo =>
              convo._id === activeConversationId ? { ...convo, seenBy: [] } : convo,
            ),
          }));
        } catch (e) {
          console.error('Send direct message error:', e);
          throw e;
        }
      },
      sendGroupMessage: async (conversationId, content, imgUrl) => {
        try {
          const { activeConversationId } = get();
          await ChatService.sendGroupMessage(conversationId, content, imgUrl);

          set(state => ({
            conversations: map(state.conversations, convo =>
              convo._id === activeConversationId ? { ...convo, seenBy: [] } : convo,
            ),
          }));
        } catch (e) {
          console.error('Send group message error:', e);
          throw e;
        }
      },
      addMessage: async message => {
        try {
          const { user } = useAuthStore.getState();
          const { fetchMessages } = get();

          message.isOwn = message.senderId === user?._id;

          const convoId = message.conversationId;

          let prevItems = get().messages[convoId]?.items ?? [];

          if (isEmpty(prevItems)) {
            await fetchMessages(message.conversationId);

            prevItems = get().messages[convoId]?.items ?? [];
          }

          set(state => {
            if (prevItems.some(m => m._id === message._id)) return state;

            return {
              messages: {
                ...state.messages,
                [convoId]: {
                  items: [...prevItems, message],
                  hasMore: state.messages[convoId].hasMore,
                  nextCursor: state.messages[convoId].nextCursor ?? undefined,
                },
              },
            };
          });
        } catch (e) {
          console.error('Add message error:', e);
          throw e;
        }
      },
      updateConversation: conversation => {
        set(state => ({
          conversations: map(state.conversations, convo =>
            convo._id === conversation._id ? { ...convo, ...conversation } : convo,
          ),
        }));
      },
    }),
    { name: 'chat-storage', partialize: state => ({ conversations: state.conversations }) },
  ),
);
