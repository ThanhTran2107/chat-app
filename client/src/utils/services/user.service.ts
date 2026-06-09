import { API_ENDPOINTS } from '@/utils/constants';

import { api } from '@/lib/axios';

export const UserService = {
  uploadAvatar: async (formData: FormData) => {
    const res = await api.post(API_ENDPOINTS.USER_UPLOAD_AVATAR, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return res.data;
  },

  updateProfile: async (profileData: {
    displayName?: string;
    username?: string;
    email?: string;
    phoneNumber?: string;
    bio?: string;
    showOnlineStatus?: boolean;
  }) => {
    const res = await api.patch(API_ENDPOINTS.USER_ME, profileData);
    return res.data.user;
  },
};
