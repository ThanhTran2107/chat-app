import { useAuthStore } from '@/stores/use-auth-store.ts';
import type { Conversation, Message } from '@/types/chat.type.ts';
import type { SocketState } from '@/types/store.type.ts';
import type { FriendRequest, User } from '@/types/user.type.ts';
import { Howl } from 'howler';
import filter from 'lodash-es/filter';
import some from 'lodash-es/some';
import { type Socket, io } from 'socket.io-client';
import { create } from 'zustand';

import { useChatStore } from './use-chat-store';
import { useFriendStore } from './use-friend-store.ts';

const notificationSound = new Howl({
  src: ['/notify-1s.wav?v=3'],
  volume: 0.4,
  html5: true,
  preload: true,
});

const playNotificationSound = () => {
  if (typeof window === 'undefined') return;

  try {
    notificationSound.play();
  } catch (e) {
    console.error('Notification sound error:', e);
  }
};

const baseURL = import.meta.env.VITE_SOCKET_URL;

interface NewMessagePayload {
  message: Message;
  conversation: {
    lastMessage: {
      _id: string;
      content: string;
      createdAt: string;
      sender?: {
        _id: string;
        displayName?: string;
        avatarUrl?: string;
      };
      senderId?: string;
    };
    _id: string;
  };
  unreadCounts: Record<string, number>;
}

interface ReadMessagePayload {
  conversation: {
    _id: string;
    lastMessageAt: string;
    unreadCounts: Record<string, number>;
    seenBy: Array<{ _id?: string }>;
  };
  lastMessage: {
    _id: string;
    content: string;
    createdAt: string;
    sender: {
      _id: string;
      displayName: string;
      avatarUrl?: string | null;
    };
  };
}

interface FriendRequestAcceptedPayload {
  requestId?: string;
  newFriend?: {
    _id?: string;
    displayName?: string;
    avatarUrl?: string;
    username?: string;
  };
}

interface FriendAccountDeletedPayload {
  userId?: string;
}

interface FriendAvatarUpdatedPayload {
  userId: string;
  avatarUrl: string;
}

interface FriendProfileUpdatedPayload {
  userId: string;
  displayName?: string;
  username?: string;
  bio?: string;
  phoneNumber?: string;
}

interface FriendRequestDeclinedPayload {
  requestId?: string;
}

const buildLastMessage = (conversation: NewMessagePayload['conversation']) => ({
  _id: conversation.lastMessage._id,
  content: conversation.lastMessage.content,
  createdAt: conversation.lastMessage.createdAt,
  sender: {
    _id: (conversation.lastMessage.sender?._id ?? conversation.lastMessage.senderId) as string,
    displayName: conversation.lastMessage.sender?.displayName ?? '',
    avatarUrl: conversation.lastMessage.sender?.avatarUrl ?? '',
  },
});

const buildReadMessagePayload = (
  conversation: ReadMessagePayload['conversation'],
  lastMessage: ReadMessagePayload['lastMessage'],
) => ({
  _id: conversation._id,
  lastMessage,
  lastMessageAt: conversation.lastMessageAt,
  unreadCounts: conversation.unreadCounts,
  seenBy: conversation.seenBy,
});

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  onlineUsers: new Set<string>(),
  friendPresence: {},

  connectSocket: () => {
    const accessToken = useAuthStore.getState().accessToken;
    const existingSocket = get().socket;

    if (existingSocket) return;

    const socket: Socket = io(baseURL, {
      auth: { token: accessToken },
      transports: ['websocket'],
    });

    set({ socket });

    let isFirstConnect = true;

    const joinAllConversations = () => {
      const conversationIds = useChatStore.getState().conversations.map(c => c._id);
      conversationIds.forEach(id => socket.emit('join-conversation', id));
    };

    const handleConnect = async () => {
      if (isFirstConnect) {
        isFirstConnect = false;
        return;
      }

      joinAllConversations();
      await useChatStore.getState().fetchConversations();
    };

    const handleOnlineUsers = (userIds: string[]) => {
      set({ onlineUsers: new Set(userIds) });
    };

    const handleFriendPresenceChanged = ({ userId, status }: { userId: string; status: 'online' | 'offline' }) => {
      if (!userId || !status) return;

      set(state => ({
        friendPresence: {
          ...state.friendPresence,
          [userId]: status,
        },
      }));
    };

    const handleNewMessage = ({ message, conversation, unreadCounts }: NewMessagePayload) => {
      if (!message || !conversation) return;
      if (!conversation.lastMessage) return;

      useChatStore.getState().addMessage(message);

      const lastMessage = buildLastMessage(conversation);

      const updatedConversation = {
        ...conversation,
        lastMessage,
        unreadCounts,
      };

      if (useChatStore.getState().activeConversationId === message.conversationId) useChatStore.getState().markAsSeen();

      const hasConversation = some(useChatStore.getState().conversations, convo => convo._id === conversation._id);

      if (hasConversation) {
        useChatStore.getState().updateConversation(updatedConversation);
      } else {
        useChatStore.getState().addConversationIfMissing(updatedConversation as Conversation);
        useSocketStore.getState().socket?.emit('join-conversation', conversation._id);
      }
    };

    const handleReadMessage = ({ conversation, lastMessage }: ReadMessagePayload) => {
      const updated = buildReadMessagePayload(conversation, lastMessage);

      useChatStore.getState().updateConversation(updated as Partial<Conversation>);
    };

    const handleFriendRequestReceived = (request: FriendRequest) => {
      if (!request) return;

      useFriendStore.setState(state => ({
        receivedList: [request, ...(state.receivedList ?? [])],
      }));

      setTimeout(() => playNotificationSound(), 0);

      useFriendStore
        .getState()
        .getAllFriendRequests()
        .catch(error => console.error('Failed to refresh friend requests:', error));
    };

    const handleFriendRequestAccepted = (payload: FriendRequestAcceptedPayload) => {
      if (!payload?.requestId) return;

      useFriendStore.setState(state => ({
        sentList: filter(state.sentList, request => request._id !== payload.requestId) ?? [],
      }));

      const { newFriend } = payload;

      if (newFriend?._id) {
        useFriendStore.getState().addFriend(newFriend as User);

        useChatStore
          .getState()
          .createConversation('direct', [newFriend._id], '')
          .catch(error => {
            console.error('Error creating direct conversation after friend request accepted:', error);
          });
      }
    };

    const handleFriendAccountDeleted = (payload: FriendAccountDeletedPayload) => {
      if (!payload?.userId) return;

      useChatStore.getState().markUserAsDeleted(payload.userId);
    };

    const handleFriendAvatarUpdated = (payload: FriendAvatarUpdatedPayload) => {
      if (!payload?.userId || !payload?.avatarUrl) return;

      useChatStore.getState().updateParticipantsAvatar(payload.userId, payload.avatarUrl);
      useFriendStore.getState().updateFriendAvatar(payload.userId, payload.avatarUrl);
    };

    const handleFriendProfileUpdated = (payload: FriendProfileUpdatedPayload) => {
      if (!payload?.userId) return;

      useChatStore.getState().updateParticipantsProfile(payload.userId, payload);
      useFriendStore.getState().updateFriendProfile(payload.userId, payload);
    };

    const handleFriendRequestDeclined = (payload: FriendRequestDeclinedPayload) => {
      if (!payload?.requestId) return;

      useFriendStore.setState(state => ({
        sentList: filter(state.sentList, request => request._id !== payload.requestId) ?? [],
      }));
    };

    const handleNewGroup = (conversation: Conversation) => {
      useChatStore.getState().addConvo(conversation);
      socket.emit('join-conversation', conversation._id);
    };

    socket.on('connect', handleConnect);
    socket.on('online-users', handleOnlineUsers);
    socket.on('friend-presence-changed', handleFriendPresenceChanged);
    socket.on('new-message', handleNewMessage);
    socket.on('read-message', handleReadMessage);
    socket.on('friend-request-received', handleFriendRequestReceived);
    socket.on('friend-request-accepted', handleFriendRequestAccepted);
    socket.on('friend-account-deleted', handleFriendAccountDeleted);
    socket.on('friend-avatar-updated', handleFriendAvatarUpdated);
    socket.on('friend-profile-updated', handleFriendProfileUpdated);
    socket.on('friend-request-declined', handleFriendRequestDeclined);
    socket.on('new-group', handleNewGroup);
  },

  disconnectSocket: () => {
    const socket = get().socket;

    if (socket) {
      socket.removeAllListeners();
      socket.disconnect();
      set({ socket: null });
    }
  },
}));
