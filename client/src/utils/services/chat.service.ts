import type { ConversationResponse, Message } from '@/types/chat.ts';

import { api } from '@/lib/axios.ts';

import { API_ENDPOINTS } from '../constants';

interface FetchMessageProps {
  messages: Message[];
  cursor?: string;
}

const pageLimit = 50;

export const ChatService = {
  async fetchConversations(): Promise<ConversationResponse> {
    const res = await api.get(API_ENDPOINTS.CONVERSATION);

    return res.data;
  },

  async fetchMessages(id: string, cursor?: string): Promise<FetchMessageProps> {
    const endpoint = API_ENDPOINTS.CONVERSATION_MESSAGES.replace('{id}', id);
    const res = await api.get(`${endpoint}?limit=${pageLimit}&cursor=${cursor}`);

    return { messages: res.data.messages, cursor: res.data.nextCursor };
  },

  async sendDirectMessage(recipientId: string, content: string = '', imgUrl?: string, conversationId?: string) {
    const res = await api.post(API_ENDPOINTS.DIRECT_MESSAGE, {
      recipientId,
      content,
      imgUrl,
      conversationId,
    });

    return res.data.message;
  },

  async sendGroupMessage(conversationId: string, content: string = '', imgUrl?: string) {
    const res = await api.post(API_ENDPOINTS.GROUP_MESSAGE, {
      conversationId,
      content,
      imgUrl,
    });

    return res.data.message;
  },

  async markAsSeen(conversationId: string) {
    const res = await api.patch(`${API_ENDPOINTS.CONVERSATION}/${conversationId}/seen`);

    return res.data;
  }
};
