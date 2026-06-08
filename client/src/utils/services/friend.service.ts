import { API_ENDPOINTS } from '@/utils/constants';

import { api } from '@/lib/axios';

export const FriendService = {
  async searchByUsername(username: string) {
    const response = await api.get(API_ENDPOINTS.USER_SEARCH(username));
    return response.data.users;
  },

  async sendFriendRequest(to: string, message?: string) {
    const response = await api.post(API_ENDPOINTS.FRIEND_REQUEST, { to, message });
    return response.data;
  },

  async getAllFriendRequests() {
    try {
      const response = await api.get(API_ENDPOINTS.FRIEND_REQUESTS);
      const { sent, received } = response.data;

      return { sent, received };
    } catch (e) {
      console.error('Error fetching friend requests:', e);
      throw e;
    }
  },

  async acceptRequest(requestId: string) {
    try {
      const response = await api.post(API_ENDPOINTS.FRIEND_REQUEST_ACCEPT(requestId));
      return response.data.requestAcceptedBy;
    } catch (e) {
      console.error('Error accepting friend request:', e);
      throw e;
    }
  },

  async declineRequest(requestId: string) {
    try {
      await api.post(API_ENDPOINTS.FRIEND_REQUEST_DECLINE(requestId));
    } catch (e) {
      console.error('Error declining friend request:', e);
      throw e;
    }
  },

  async getFriendList() {
    const res = await api.get(API_ENDPOINTS.FRIEND_LIST);
    return res.data.friends;
  },
};
