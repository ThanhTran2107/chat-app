import { api } from '@/lib/axios';

export const FriendService = {
  async searchByUsername(username: string) {
    const response = await api.get(`/user/search?username=${username}`);
    return response.data.users;
  },
  async sendFriendRequest(to: string, message?: string) {
    const response = await api.post('/friend/request', { to, message });
    return response.data;
  },
  async getAllFriendRequests() {
    try {
      const response = await api.get('/friend/requests');
      const { sent, received } = response.data;

      return { sent, received };
    } catch (e) {
      console.error('Error fetching friend requests:', e);
      throw e;
    }
  },
  async acceptRequest(requestId: string) {
    try {
      const response = await api.post(`/friend/request/${requestId}/accept`);
      return response.data.requestAcceptedBy;
    } catch (e) {
      console.error('Error accepting friend request:', e);
      throw e;
    }
  },
  async declineRequest(requestId: string) {
    try {
      await api.post(`/friend/request/${requestId}/decline`);
    } catch (e) {
      console.error('Error declining friend request:', e);
      throw e;
    }
  },
};
