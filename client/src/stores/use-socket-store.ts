import { create } from 'zustand';
import { io, type Socket } from 'socket.io-client';
import { useAuthStore } from '@/stores/use-auth-store.ts';
import type { SocketState } from '@/types/store';
import { useChatStore } from './use-chat-store';

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
    socket.on('new-message', ({message, conversation, unreadCounts}) => {
      if(!message || !conversation) return;
      
      useChatStore.getState().addMessage(message);

      const lastMessage = {
        _id: conversation.lastMessage._id,
        content: conversation.lastMessage.content,
        createdAt: conversation.lastMessage.createdAt,
        sender: {
          _id: conversation.lastMessage.sender._id,
          displayName: '',
          avatarUrl: '',
        },
      };

      const updatedConversation = {
        ...conversation,
        lastMessage,
        unreadCounts,
      };

      if (useChatStore.getState().activeConversationId === message.conversationId) {
        // seen marked
      }

      useChatStore.getState().updateConversation(updatedConversation);
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
