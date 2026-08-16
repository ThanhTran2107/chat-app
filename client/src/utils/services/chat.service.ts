import type { ConversationResponse, Message } from '@/types/chat.type';

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
    const url = `${endpoint}?limit=${pageLimit}&cursor=${cursor ?? ''}`;

    const res = await api.get(url);

    return { messages: res.data.messages, cursor: res.data.nextCursor };
  },

  async sendDirectMessage(recipientId: string, content: string = '', file?: File, conversationId?: string) {
    if (file) {
      const formData = new FormData();
      formData.append('recipientId', recipientId);
      formData.append('content', content ?? '');

      if (conversationId) formData.append('conversationId', conversationId);

      formData.append('file', file);
      const res = await api.post(API_ENDPOINTS.DIRECT_MESSAGE, formData);

      return res.data.message;
    }

    const res = await api.post(API_ENDPOINTS.DIRECT_MESSAGE, {
      recipientId,
      content,
      conversationId,
    });

    return res.data.message;
  },

  async sendGroupMessage(conversationId: string, content: string = '', file?: File) {
    if (file) {
      const formData = new FormData();
      formData.append('conversationId', conversationId);
      formData.append('content', content ?? '');
      formData.append('file', file);

      const res = await api.post(API_ENDPOINTS.GROUP_MESSAGE, formData);

      return res.data.message;
    }

    const res = await api.post(API_ENDPOINTS.GROUP_MESSAGE, {
      conversationId,
      content,
    });

    return res.data.message;
  },

  async markAsSeen(conversationId: string) {
    const res = await api.patch(`${API_ENDPOINTS.CONVERSATION}/${conversationId}/seen`);

    return res.data;
  },

  async createConversation(type: 'direct' | 'group', memberIds: string[], name: string) {
    const res = await api.post(API_ENDPOINTS.CONVERSATION, { type, name, memberIds });
    return res.data.conversation;
  },
};
