import filter from 'lodash-es/filter';
import map from 'lodash-es/map';
import some from 'lodash-es/some';
import { create } from 'zustand';

import { FriendService } from '@/utils/services/friend.service';

import type { FriendState } from '../types/store.type';
import type { User } from '../types/user.type';
import { useChatStore } from './use-chat-store';

let getAllFriendRequestsPromise: Promise<void> | null = null;

export const useFriendStore = create<FriendState>((set, get) => {
  const handleFriendRequestAction = async (actionType: 'accept' | 'decline', requestId: string) => {
    let newFriend: User | undefined;

    if (actionType === 'accept') {
      const response = await FriendService.acceptRequest(requestId);
      newFriend = response?.newFriend as User | undefined;

      if (newFriend?._id) {
        const friendToAdd = newFriend;

        set(state => ({
          friends: some(state.friends, f => f._id === friendToAdd._id)
            ? state.friends
            : [...(state.friends ?? []), friendToAdd],
        }));
      }
    } else {
      await FriendService.declineRequest(requestId);
    }

    set(state => ({
      receivedList: filter(state.receivedList, request => request._id !== requestId),
    }));

    await get().getAllFriendRequests();

    return newFriend;
  };

  return {
    loading: false,
    receivedList: [],
    sentList: [],
    friends: [],
    reset: () =>
      set({
        friends: [],
        sentList: [],
        receivedList: [],
        loading: false,
      }),
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
      if (getAllFriendRequestsPromise) return getAllFriendRequestsPromise;

      getAllFriendRequestsPromise = (async () => {
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
          getAllFriendRequestsPromise = null;
        }
      })();

      return getAllFriendRequestsPromise;
    },
    acceptRequest: async requestId => {
      try {
        set({ loading: true });

        const newFriend = await handleFriendRequestAction('accept', requestId);

        if (newFriend?._id) {
          await useChatStore.getState().createConversation('direct', [newFriend._id], '');
        }
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

        await handleFriendRequestAction('decline', requestId);
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
    updateFriendAvatar: (userId, avatarUrl) => {
      set(state => ({
        friends: map(state.friends, friend => (friend._id === userId ? { ...friend, avatarUrl } : friend)),
      }));
    },
    updateFriendProfile: (userId, profileUpdates) => {
      set(state => ({
        friends: map(state.friends, friend => (friend._id === userId ? { ...friend, ...profileUpdates } : friend)),
      }));
    },
    addFriend: friend => {
      set(state => ({
        friends: some(state.friends, f => f._id === friend._id) ? state.friends : [...(state.friends ?? []), friend],
      }));
    },
  };
});
