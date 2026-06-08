import { API_ENDPOINTS } from '@/utils/constants';

import { api } from '@/lib/axios';

export const UserService = {
  uploadAvatar: async (formData: FormData) => {
    const res = await api.post(API_ENDPOINTS.USER_UPLOAD_AVATAR, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (res.status === 400) throw new Error(res.data.message);

    return res.data;
  },
};
