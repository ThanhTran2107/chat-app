import filter from 'lodash-es/filter';
import { create } from 'zustand';

import { FriendService } from '@/utils/services/friend.service';

import type { FriendState } from '../types/store';

export const useFriendStore = create<FriendState>((set, get) => ({
  loading: false,
  receivedList: [],
  sentList: [],
  friends: [],
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

      const result = await FriendService.sendFriendRequest(to, message);

      if (result?.request)
        set(state => ({
          sentList: [...(state.sentList ?? []), result.request],
        }));

      return result?.message ?? '';
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

      await get().getAllFriendRequests();
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

      await get().getAllFriendRequests();
    } catch (e) {
      console.error('Error declining friend request:', e);
      throw e;
    } finally {
      set({ loading: false });
    }
  },
  getFriendList: async () => {
    try {
      set({ loading: true });

      const friends = await FriendService.getFriendList();

      set({ friends: friends });
    } catch (e) {
      console.error('Error fetching friend list:', e);
      set({ friends: [] });
      throw e;
    } finally {
      set({ loading: false });
    }
  },
}));
