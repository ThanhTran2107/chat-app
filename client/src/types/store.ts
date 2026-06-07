import type { Socket } from 'socket.io-client';

import type { Conversation } from './chat.ts';
import type { Message } from './chat.ts';
import type { FriendRequest, User } from './user.ts';

// Types for the authentication state managed by Zustand
export interface AuthState {
  accessToken: string | null; // JWT access token for authenticated requests, null when not logged in
  user: User | null; // User type imported from user.ts, can be null when not logged in
  loading: boolean; // Indicates if an authentication-related operation is in progress

  // Action functions to update the authentication state
  clearState: () => void;
  setAccessToken: (token: string) => void;

  // Asynchronous actions for authentication operations
  register: (username: string, password: string, email: string, lastName: string, firstName: string) => Promise<void>;
  logIn: (username: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  fetchMe: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

export interface ThemeState {
  isDark: boolean; // Indicates if the dark theme is currently active
  toggleTheme: () => void; // Function to toggle between light and dark themes
  setTheme: (dark: boolean) => void; // Function to explicitly set the theme
}

export interface ChatState {
  conversations: Conversation[]; // List of conversations the user is part of
  messages: Record<string, { items: Message[]; hasMore: boolean; nextCursor?: string | null }>; // Mapping of conversationId to its messages
  activeConversationId: string | null; // The ID of the currently active conversation, null if none is active
  convoLoading: boolean; // Indicates if conversations are currently being loaded
  messageLoading: boolean; // Indicates if messages are currently being loaded
  loading: boolean; // General loading state for chat-related operations
  reset: () => void; // Function to reset the chat state to its initial values
  setActiveConversation: (id: string | null) => void; // Function to set the active conversation
  fetchConversations: () => Promise<void>; // Function to fetch the list of conversations
  fetchMessages: (conversationId: string) => Promise<void>; // Function to fetch messages for a specific conversation, with optional pagination cursor
  sendDirectMessage: (recipientId: string, content: string, imgUrl?: string) => Promise<void>; // Function to send a direct message
  sendGroupMessage: (conversationId: string, content: string, imgUrl?: string) => Promise<void>; // Function to send a group message
  addMessage: (message: Message) => Promise<void>; // Function to add a new message to the state, used for real-time updates
  updateConversation: (conversation: Partial<Conversation>) => void; // Function to update a conversation in the state, used for real-time updates
  markAsSeen: () => Promise<void>; // Function to mark a conversation as seen
  addConvo: (convo: Conversation) => void; // Function to add a new conversation to the state
  createConversation: (type: 'direct' | 'group', memberIds: string[], name: string) => Promise<void>; // Function to create a new conversation
}

export interface SocketState {
  socket: Socket | null;
  onlineUsers: string[];
  connectSocket: () => void;
  disconnectSocket: () => void;
}

export interface FriendState {
  loading: boolean; // Indicates if friend-related operations are in progress
  receivedList: FriendRequest[]; // List of received friend requests
  sentList: FriendRequest[]; // List of sent friend requests
  friends: User[]; // List of friends
  searchByUsername: (username: string) => Promise<User | null>; // Function to search for a user by username, returns a User object or null if not found
  sendFriendRequest: (to: string, message?: string) => Promise<string>; // Function to send a friend request, returns a success message
  getAllFriendRequests: () => Promise<void>; // Function to fetch all friend requests (both sent and received)
  acceptRequest: (requestId: string) => Promise<void>; // Function to accept a friend request by its ID
  declineRequest: (requestId: string) => Promise<void>; // Function to decline a friend request by its ID
  getFriendList: () => Promise<void>; // Function to fetch the list of friends
}
