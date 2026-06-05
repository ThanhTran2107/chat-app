import { FriendService } from '@/utils/services/friend.service';
import type { FriendState } from '../types/store';
import { create } from 'zustand';
import filter from 'lodash-es/filter';

export const useFriendStore = create<FriendState>(set => ({
  loading: false,
  receivedList: [],
  sentList: [],
  searchByUsername: async username => {
    try {
      set({ loading: true });

      const user = await FriendService.searchByUsername(username);

      return user;
    } catch (e) {
      console.error('Error searching user:', e);
      return null;
    } finally {
      set({ loading: false });
    }
  },
  sendFriendRequest: async (to, message) => {
    try {
      set({ loading: true });

      const resultMessage = await FriendService.sendFriendRequest(to, message);

      return resultMessage;
    } catch (e) {
      console.error('Error sending friend request:', e);
      throw e;
    } finally {
      set({ loading: false });
    }
  },
  getAllFriendRequests: async () => {
    try {
      set({ loading: true });

      const result = await FriendService.getAllFriendRequests();

      if (!result) return;

      const { sent, received } = result;
      set({ sentList: sent, receivedList: received });
    } catch (e) {
      console.error('Error fetching friend requests:', e);
      throw e;
    } finally {
      set({ loading: false });
    }
  },
  acceptRequest: async requestId => {
    try {
      set({ loading: true });

      await FriendService.acceptRequest(requestId);

      set(state => ({
        receivedList: filter(state.receivedList, request => request._id !== requestId),
      }));
    } catch (e) {
      console.error('Error accepting friend request:', e);
      throw e;
    } finally {
      set({ loading: false });
    }
  },
  declineRequest: async requestId => {
    try {
      set({ loading: true });

      await FriendService.declineRequest(requestId);

      set(state => ({
        receivedList: filter(state.receivedList, request => request._id !== requestId),
      }));
    } catch (e) {
      console.error('Error declining friend request:', e);
      throw e;
    } finally {
      set({ loading: false });
    }
  },
}));
