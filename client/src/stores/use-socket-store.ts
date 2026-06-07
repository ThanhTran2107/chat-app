import { useAuthStore } from '@/stores/use-auth-store.ts';
import type { SocketState } from '@/types/store';
import filter from 'lodash-es/filter';
import { type Socket, io } from 'socket.io-client';
import { create } from 'zustand';

import { useChatStore } from './use-chat-store';
import { useFriendStore } from './use-friend-store.ts';

const baseURL = import.meta.env.VITE_SOCKET_URL;

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  onlineUsers: [],
  connectSocket: () => {
    const accessToken = useAuthStore.getState().accessToken;
    const existingSocket = get().socket;

    if (existingSocket) return;

    const socket: Socket = io(baseURL, {
      auth: { token: accessToken },
      transports: ['websocket'],
    });

    set({ socket });

    socket.on('connect', () => null);
    // online users
    socket.on('online-users', userIds => set({ onlineUsers: userIds }));
    // new message
    socket.on('new-message', ({ message, conversation, unreadCounts }) => {
      if (!message || !conversation) return;
      if (!conversation.lastMessage) return;

      useChatStore.getState().addMessage(message);

      const lastMessage = {
        _id: conversation.lastMessage._id,
        content: conversation.lastMessage.content,
        createdAt: conversation.lastMessage.createdAt,
        sender: {
          _id: conversation.lastMessage.sender?._id ?? conversation.lastMessage.senderId,
          displayName: conversation.lastMessage.sender?.displayName ?? '',
          avatarUrl: conversation.lastMessage.sender?.avatarUrl ?? '',
        },
      };

      const updatedConversation = {
        ...conversation,
        lastMessage,
        unreadCounts,
      };

      if (useChatStore.getState().activeConversationId === message.conversationId) useChatStore.getState().markAsSeen();

      useChatStore.getState().updateConversation(updatedConversation);
    });

    // read message
    socket.on('read-message', ({ conversation, lastMessage }) => {
      const updated = {
        _id: conversation._id,
        lastMessage,
        lastMessageAt: conversation.lastMessageAt,
        unreadCounts: conversation.unreadCounts,
        seenBy: conversation.seenBy,
      };

      useChatStore.getState().updateConversation(updated);
    });

    // friend request received
    socket.on('friend-request-received', request => {
      if (!request) return;

      useFriendStore.setState(state => ({
        receivedList: [request, ...(state.receivedList ?? [])],
      }));
    });

    // friend request accepted by recipient
    socket.on('friend-request-accepted', payload => {
      if (!payload?.requestId) return;

      useFriendStore.setState(state => ({
        sentList: filter(state.sentList, request => request._id !== payload.requestId) ?? [],
      }));
    });

    // friend request declined by recipient
    socket.on('friend-request-declined', payload => {
      if (!payload?.requestId) return;

      useFriendStore.setState(state => ({
        sentList: filter(state.sentList, request => request._id !== payload.requestId) ?? [],
      }));
    });

    // new group created
    socket.on('new-group', conversation => {
      useChatStore.getState().addConvo(conversation);
      socket.emit('join-conversation', conversation._id);
    });
  },
  disconnectSocket: () => {
    const socket = get().socket;

    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));
