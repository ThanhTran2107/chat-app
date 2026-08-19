import { z } from 'zod';

// Validation schemas and constants for authentication forms

export const USERNAME_MIN_LENGTH = 3;
export const PASSWORD_MIN_LENGTH = 8;

export const APP_NAME = 'Tetra';

export const LOCAL_STORAGE_KEYS = Object.freeze({
  AUTH_STORAGE: 'auth-storage',
  CHAT_STORAGE: 'chat-storage',
  THEME_STORAGE: 'theme-storage',
  AUTH_SESSION: 'auth-session',
  REMEMBERED_EMAIL: 'rememberedEmail',
});

export const AUTH_SESSION_VALUE = '1';

export const API_ENDPOINTS = Object.freeze({
  BASE: '/tetra',

  AUTH_REGISTER: 'auth/register',
  AUTH_LOGIN: 'auth/login',
  AUTH_GOOGLE: 'auth/google',
  AUTH_FACEBOOK: 'auth/facebook',
  AUTH_LOGOUT: 'auth/logout',
  AUTH_REFRESH: 'auth/refresh',
  AUTH_FORGOT_PASSWORD: 'auth/forgot-password',
  AUTH_RESET_PASSWORD: 'auth/reset-password',
  AUTH_VERIFY_EMAIL: 'auth/verify-email',
  AUTH_RESEND_VERIFICATION: 'auth/resend-verification',

  USER_ME: 'user/me',
  USER_SEARCH: (username: string) => `user/search?username=${username}`,
  USER_UPLOAD_AVATAR: 'user/uploadAvatar',

  FRIEND_REQUEST: 'friend/request',
  FRIEND_REQUEST_ACCEPT: (requestId: string) => `friend/request/${requestId}/accept`,
  FRIEND_REQUEST_DECLINE: (requestId: string) => `friend/request/${requestId}/decline`,
  FRIEND_REQUESTS: 'friend/requests',
  FRIEND_LIST: 'friend/get-all',

  CONVERSATION: '/conversation',
  CONVERSATION_MESSAGES: '/conversation/{id}/messages',
  MESSAGE_DOWNLOAD: '/message/download/{messageId}',

  DIRECT_MESSAGE: '/message/direct',
  GROUP_MESSAGE: '/message/group',
});

export const ROUTES = Object.freeze({
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  RESEND_VERIFICATION: '/resend-verification',
  CHAT: '/chat',
  LANDING: '/',
});

export const AUTH_ID = Object.freeze({
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  FACEBOOK_APP_ID: import.meta.env.VITE_FACEBOOK_APP_ID,
});

export const CONVERSATION_TYPES = Object.freeze({
  DIRECT: 'direct',
  GROUP: 'group',
});

export const PRESENCE_STATUS = Object.freeze({
  ONLINE: 'online',
  OFFLINE: 'offline',
});

export const SOCKET_EVENTS = Object.freeze({
  CONNECT: 'connect',
  ONLINE_USERS: 'online-users',
  FRIEND_PRESENCE_CHANGED: 'friend-presence-changed',
  NEW_MESSAGE: 'new-message',
  READ_MESSAGE: 'read-message',
  FRIEND_REQUEST_RECEIVED: 'friend-request-received',
  FRIEND_REQUEST_ACCEPTED: 'friend-request-accepted',
  FRIEND_REQUEST_DECLINED: 'friend-request-declined',
  FRIEND_ACCOUNT_DELETED: 'friend-account-deleted',
  FRIEND_AVATAR_UPDATED: 'friend-avatar-updated',
  FRIEND_PROFILE_UPDATED: 'friend-profile-updated',
  NEW_GROUP: 'new-group',
  JOIN_CONVERSATION: 'join-conversation',
});

export const STATIC_ASSETS = Object.freeze({
  MAIN_LOGO: '/main-logo.png',
  NOTIFICATION_SOUND: '/notify-1s.wav?v=3',
});

export const DELETED_ACCOUNT_LABEL = 'Deleted account';

export const MESSAGE_PAGE_LIMIT = 50;
export const MAX_ATTACHMENTS_PER_SEND = 10;

const passwordValidationSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, {
    message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
  })
  .refine(value => /[A-Z]/.test(value), {
    message: 'Password must contain at least one uppercase letter',
  })
  .refine(value => /[a-z]/.test(value), {
    message: 'Password must contain at least one lowercase letter',
  })
  .refine(value => /[0-9]/.test(value), {
    message: 'Password must contain at least one number',
  })
  .refine(value => /[!@#$%^&*()_+\-[\]{};':"\\|,.<>/?]/.test(value), {
    message: 'Password must contain at least one special character',
  })
  .refine(value => !/\s/.test(value), {
    message: 'Password cannot contain spaces',
  });

export const registerSchema = z
  .object({
    firstName: z.string().min(1, { message: 'First name is required' }),
    lastName: z.string().min(1, { message: 'Last name is required' }),
    username: z.string().min(USERNAME_MIN_LENGTH, {
      message: `Username must be at least ${USERNAME_MIN_LENGTH} characters`,
    }),
    email: z.email({ message: 'Invalid email address' }),
    password: passwordValidationSchema,
    confirmPassword: passwordValidationSchema,
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
  password: z.string().min(PASSWORD_MIN_LENGTH, {
    message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
  }),
  rememberMe: z.boolean().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
});

export const resendVerificationSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
});

export const resetPasswordSchema = z
  .object({
    password: passwordValidationSchema,
    confirmPassword: passwordValidationSchema,
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
