import type { Message } from '@/types/chat.type';
import { type ChatState } from '@/types/store.type';
import find from 'lodash-es/find';
import isEmpty from 'lodash-es/isEmpty';
import map from 'lodash-es/map';
import throttle from 'lodash-es/throttle';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { DELETED_ACCOUNT_LABEL, LOCAL_STORAGE_KEYS, SOCKET_EVENTS } from '@/utils/constants';
import { ChatService } from '@/utils/services/chat.service';

import { useAuthStore } from './use-auth.store';
import { useSocketStore } from './use-socket.store';
import {
  attachOwnership,
  clearSeenByForActiveConversation,
  conversationExists,
  isMessageDuplicate,
  serializeConversationForStorage,
} from './utils/chat-store.util';

let fetchConversationsPromise: Promise<void> | null = null;

const { CHAT_STORAGE } = LOCAL_STORAGE_KEYS;

const throttledSetItem = throttle((name: string, value: string) => {
  localStorage.setItem(name, value);
}, 800);

const throttledStorage = {
  getItem: (name: string) => localStorage.getItem(name),
  setItem: (name: string, value: string) => throttledSetItem(name, value),
  removeItem: (name: string) => localStorage.removeItem(name),
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      messages: {},
      activeConversationId: null,
      convoLoading: false, // convo loading
      messageLoading: false, // message loading
      messageLoaded: {}, // tracks whether messages for a conversation have been initially loaded
      loading: false,

      setActiveConversation: id => set({ activeConversationId: id }),
      reset: () =>
        set({
          conversations: [],
          messages: {},
          activeConversationId: null,
          convoLoading: false,
          messageLoading: false,
          messageLoaded: {},
        }),
      fetchConversations: async () => {
        if (fetchConversationsPromise) return fetchConversationsPromise;

        fetchConversationsPromise = (async () => {
          try {
            set({ convoLoading: true });
            const { conversations } = await ChatService.fetchConversations();

            set({ conversations, convoLoading: false });
          } catch (e) {
            console.error('Fetch conversations error:', e);
            set({ convoLoading: false });
          } finally {
            fetchConversationsPromise = null;
          }
        })();

        return fetchConversationsPromise;
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
          const { messages: fetched, cursor } = await ChatService.fetchMessages(
            convoId,
            nextCursor === '' ? undefined : nextCursor,
          );

          const processed = map(fetched, message => attachOwnership(message, user?._id));

          set(state => {
            const prev = state.messages[convoId]?.items ?? [];
            const merged = !isEmpty(prev) ? [...processed, ...prev] : processed;

            return {
              messages: {
                ...state.messages,
                [convoId]: { items: merged, hasMore: !!cursor, nextCursor: cursor ?? null },
              },
              messageLoaded: { ...state.messageLoaded, [convoId]: true },
            };
          });
        } catch (e) {
          console.error('Fetch messages error:', e);
        } finally {
          set({ messageLoading: false });
        }
      },
      sendDirectMessage: async (recipientId, content, imgUrl, clientMessageId) => {
        const { activeConversationId } = get();

        try {
          const message = await ChatService.sendDirectMessage(
            recipientId,
            content,
            imgUrl,
            activeConversationId || undefined,
            clientMessageId,
          );
          const conversationId = message.conversationId ?? activeConversationId;

          if (clientMessageId) {
            set(state => {
              const items = state.messages[conversationId ?? '']?.items ?? [];
              const exists = isMessageDuplicate(items, message._id);

              if (exists) return state;

              const updatedItems = items.map(m =>
                m.clientMessageId === clientMessageId
                  ? {
                      ...attachOwnership(message, useAuthStore.getState().user?._id),
                      isNew: true,
                      clientMessageId: m.clientMessageId,
                    }
                  : m,
              );

              return {
                messages: {
                  ...state.messages,
                  [conversationId ?? '']: {
                    items: updatedItems,
                    hasMore: state.messages[conversationId ?? '']?.hasMore ?? true,
                    nextCursor: state.messages[conversationId ?? '']?.nextCursor,
                  },
                },
              };
            });
          }

          set(state => ({
            conversations: clearSeenByForActiveConversation(state.conversations, conversationId),
          }));
        } catch (e) {
          console.error('Send direct message error:', e);

          if (clientMessageId) {
            set(state => {
              const targetConvoId = activeConversationId ?? '';
              const items = state.messages[targetConvoId]?.items ?? [];

              return {
                messages: {
                  ...state.messages,
                  [targetConvoId]: {
                    items: items.map(m =>
                      m.clientMessageId === clientMessageId ? { ...m, status: 'failed' as const } : m,
                    ),
                    hasMore: state.messages[targetConvoId]?.hasMore ?? true,
                    nextCursor: state.messages[targetConvoId]?.nextCursor,
                  },
                },
              };
            });
          }

          throw e;
        }
      },
      sendGroupMessage: async (conversationId, content, imgUrl, clientMessageId) => {
        try {
          const { activeConversationId } = get();
          const message = await ChatService.sendGroupMessage(conversationId, content, imgUrl, clientMessageId);
          const targetConvoId = message.conversationId ?? conversationId;

          if (clientMessageId) {
            set(state => {
              const items = state.messages[targetConvoId]?.items ?? [];
              const exists = isMessageDuplicate(items, message._id);

              if (exists) return state;

              const updatedItems = items.map(m =>
                m.clientMessageId === clientMessageId
                  ? {
                      ...attachOwnership(message, useAuthStore.getState().user?._id),
                      isNew: true,
                      clientMessageId: m.clientMessageId,
                    }
                  : m,
              );

              return {
                messages: {
                  ...state.messages,
                  [targetConvoId]: {
                    items: updatedItems,
                    hasMore: state.messages[targetConvoId]?.hasMore ?? true,
                    nextCursor: state.messages[targetConvoId]?.nextCursor,
                  },
                },
              };
            });
          }

          set(state => ({
            conversations: clearSeenByForActiveConversation(state.conversations, activeConversationId),
          }));
        } catch (e) {
          console.error('Send group message error:', e);

          if (clientMessageId) {
            set(state => {
              const targetConvoId = conversationId;
              const items = state.messages[targetConvoId]?.items ?? [];

              return {
                messages: {
                  ...state.messages,
                  [targetConvoId]: {
                    items: items.map(m =>
                      m.clientMessageId === clientMessageId ? { ...m, status: 'failed' as const } : m,
                    ),
                    hasMore: state.messages[targetConvoId]?.hasMore ?? true,
                    nextCursor: state.messages[targetConvoId]?.nextCursor,
                  },
                },
              };
            });
          }

          throw e;
        }
      },
      addMessage: async message => {
        try {
          const { user } = useAuthStore.getState();
          const { fetchMessages } = get();

          message = { ...attachOwnership(message, user?._id), isNew: true };

          const convoId = message.conversationId;

          let prevItems = get().messages[convoId]?.items ?? [];

          if (isEmpty(prevItems)) {
            try {
              await fetchMessages(message.conversationId);
              prevItems = get().messages[convoId]?.items ?? [];
            } catch (fetchError) {
              console.error('Fetch messages before add message error:', fetchError);
            }
          }

          set(state => {
            const items = state.messages[convoId]?.items ?? [];
            if (isMessageDuplicate(items, message._id)) return state;

            const matchedIndex = items.findIndex(
              m => m.clientMessageId && m.clientMessageId === message.clientMessageId,
            );

            if (matchedIndex >= 0) {
              const updatedItems = [...items];
              updatedItems[matchedIndex] = {
                ...message,
                clientMessageId: updatedItems[matchedIndex].clientMessageId,
              };

              return {
                messages: {
                  ...state.messages,
                  [convoId]: {
                    items: updatedItems,
                    hasMore: state.messages[convoId]?.hasMore ?? true,
                    nextCursor: state.messages[convoId]?.nextCursor,
                  },
                },
              };
            }

            const sendingCandidates = items
              .map((m, index) => ({ m, index }))
              .filter(
                ({ m }) =>
                  m.status === 'sending' &&
                  m.senderId === message.senderId &&
                  m.content === message.content &&
                  (!m.createdAt ||
                    Math.abs(new Date(m.createdAt).getTime() - new Date(message.createdAt).getTime()) < 10000),
              );

            if (sendingCandidates.length > 0) {
              const incomingTime = new Date(message.createdAt).getTime();

              const closest = sendingCandidates.reduce((best, { m, index }) => {
                const currentDiff = Math.abs(new Date(m.createdAt).getTime() - incomingTime);
                const bestDiff = Math.abs(new Date(best.m.createdAt).getTime() - incomingTime);

                return currentDiff < bestDiff ? { m, index } : best;
              }, sendingCandidates[0]);

              const updatedItems = [...items];
              updatedItems[closest.index] = {
                ...message,
                clientMessageId: closest.m.clientMessageId,
              };

              return {
                messages: {
                  ...state.messages,
                  [convoId]: {
                    items: updatedItems,
                    hasMore: state.messages[convoId]?.hasMore ?? true,
                    nextCursor: state.messages[convoId]?.nextCursor,
                  },
                },
              };
            }

            return {
              messages: {
                ...state.messages,
                [convoId]: {
                  items: [...items, message],
                  hasMore: state.messages[convoId]?.hasMore ?? true,
                  nextCursor: state.messages[convoId]?.nextCursor,
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

      markUserAsDeleted: userId => {
        set(state => ({
          conversations: map(state.conversations, convo => ({
            ...convo,
            participants: map(convo.participants, participant =>
              participant._id === userId
                ? {
                    ...participant,
                    _id: undefined,
                    displayName: DELETED_ACCOUNT_LABEL,
                    avatarUrl: null,
                  }
                : participant,
            ),
          })),
        }));
      },
      updateParticipantsAvatar: (userId, avatarUrl) => {
        set(state => ({
          conversations: map(state.conversations, convo => ({
            ...convo,
            participants: map(convo.participants, participant =>
              participant._id === userId ? { ...participant, avatarUrl } : participant,
            ),
          })),
        }));
      },
      updateParticipantsProfile: (userId, profileUpdates) => {
        set(state => ({
          conversations: map(state.conversations, convo => ({
            ...convo,
            participants: map(convo.participants, participant =>
              participant._id === userId ? { ...participant, ...profileUpdates } : participant,
            ),
          })),
        }));
      },
      markAsSeen: async () => {
        try {
          const { user } = useAuthStore.getState();
          const { activeConversationId, conversations } = get();

          if (!activeConversationId || !user) return;

          const convo = find(conversations, convo => convo._id === activeConversationId);

          if (!convo) return;

          if ((convo.unreadCounts?.[user._id] ?? 0) === 0) return;

          await ChatService.markAsSeen(activeConversationId);

          set(state => ({
            conversations: map(state.conversations, convo =>
              convo._id === activeConversationId && convo.lastMessage
                ? { ...convo, unreadCounts: { ...convo.unreadCounts, [user._id]: 0 } }
                : convo,
            ),
          }));
        } catch (e) {
          console.error('Mark as seen error:', e);
          throw e;
        }
      },

      addConvo: convo => {
        set(state => {
          const exists = conversationExists(state.conversations, convo._id);

          return {
            conversations: exists ? state.conversations : [convo, ...state.conversations],
            activeConversationId: convo._id,
          };
        });
      },
      addConversationIfMissing: convo => {
        set(state => {
          const exists = conversationExists(state.conversations, convo._id);

          return {
            conversations: exists ? state.conversations : [convo, ...state.conversations],
          };
        });
      },
      retryMessage: async (conversationId, clientMessageId, recipientId, content, file, type) => {
        const user = useAuthStore.getState().user;

        set(state => ({
          messages: {
            ...state.messages,
            [conversationId]: {
              ...state.messages[conversationId],
              items: (state.messages[conversationId]?.items ?? []).map(m =>
                m.clientMessageId === clientMessageId ? { ...m, status: 'sending' as const } : m,
              ),
            },
          },
        }));

        try {
          let message: Message;

          if (type === 'direct') {
            message = await ChatService.sendDirectMessage(recipientId, content, file, conversationId);
          } else {
            message = await ChatService.sendGroupMessage(conversationId, content, file);
          }

          set(state => {
            const items = state.messages[conversationId]?.items ?? [];
            const exists = isMessageDuplicate(items, message._id);

            if (exists) return state;

            const updatedItems = items.map(m =>
              m.clientMessageId === clientMessageId
                ? { ...attachOwnership(message, user?._id), isNew: true, clientMessageId: m.clientMessageId }
                : m,
            );

            return {
              messages: {
                ...state.messages,
                [conversationId]: {
                  items: updatedItems,
                  hasMore: state.messages[conversationId]?.hasMore ?? true,
                  nextCursor: state.messages[conversationId]?.nextCursor,
                },
              },
            };
          });

          set(state => ({
            conversations: clearSeenByForActiveConversation(state.conversations, conversationId),
          }));
        } catch (e) {
          console.error('Retry message error:', e);

          set(state => {
            const items = state.messages[conversationId]?.items ?? [];

            return {
              messages: {
                ...state.messages,
                [conversationId]: {
                  items: items.map(m =>
                    m.clientMessageId === clientMessageId ? { ...m, status: 'failed' as const } : m,
                  ),
                  hasMore: state.messages[conversationId]?.hasMore ?? true,
                  nextCursor: state.messages[conversationId]?.nextCursor,
                },
              },
            };
          });

          throw e;
        }
      },
      createConversation: async (type, memberIds, name) => {
        try {
          set({ loading: true });

          const conversation = await ChatService.createConversation(type, memberIds, name);

          get().addConvo(conversation);

          useSocketStore.getState().socket?.emit(SOCKET_EVENTS.JOIN_CONVERSATION, conversation._id);
        } catch (e) {
          console.error('Create conversation error:', e);
          throw e;
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: CHAT_STORAGE,
      partialize: state => ({
        conversations: map(state.conversations, serializeConversationForStorage),
      }),
      storage: createJSONStorage(() => throttledStorage),
    },
  ),
);
