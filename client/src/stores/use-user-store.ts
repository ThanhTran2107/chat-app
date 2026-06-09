import { create } from 'zustand';

import { UserService } from '@/utils/services/user.service';

import type { UserState } from '../types/store';
import { useAuthStore } from './use-auth-store';
import { useChatStore } from './use-chat-store';

export const useUserStore = create<UserState>(() => ({
  updatedAvatarUrl: async formData => {
    try {
      const { user, setUser } = useAuthStore.getState();
      const data = await UserService.uploadAvatar(formData);

      if (user) {
        setUser({
          ...user,
          avatarUrl: data.avatarUrl,
        });

        useChatStore.getState().fetchConversations();
      }
    } catch (e) {
      console.error('Error uploading avatar:', e);
      throw e;
    }
  },

  updateProfile: async profileData => {
    try {
      const { setUser } = useAuthStore.getState();
      const updatedUser = await UserService.updateProfile(profileData);

      setUser(updatedUser);
      useChatStore.getState().fetchConversations();

      return updatedUser;
    } catch (e) {
      console.error('Error updating profile:', e);
      throw e;
    }
  },
}));
