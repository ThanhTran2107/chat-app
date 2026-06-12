import { z } from 'zod';

// Validation schemas and constants for authentication forms

export const USERNAME_MIN_LENGTH = 3;
export const PASSWORD_MIN_LENGTH = 8;

export const API_ENDPOINTS = Object.freeze({
  // Base path for all API endpoints
  BASE: '/chat-app',

  // Authentication endpoints
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

  // User-related endpoints
  USER_ME: 'user/me',
  USER_SEARCH: (username: string) => `user/search?username=${username}`,
  USER_UPLOAD_AVATAR: 'user/uploadAvatar',

  // Friend-related endpoints
  FRIEND_REQUEST: 'friend/request',
  FRIEND_REQUEST_ACCEPT: (requestId: string) => `friend/request/${requestId}/accept`,
  FRIEND_REQUEST_DECLINE: (requestId: string) => `friend/request/${requestId}/decline`,
  FRIEND_REQUESTS: 'friend/requests',
  FRIEND_LIST: 'friend/get-all',

  // Conversation and messaging endpoints
  CONVERSATION: '/conversation',
  CONVERSATION_MESSAGES: '/conversation/{id}/messages',

  // Message endpoints
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
  CHAT: '/',
});

export const AUTH_ID = Object.freeze({
  GOOGLE_CLIENT_ID: '631241229433-9eumlhji2vg8aimnv50qgrjaj3bb3u2p.apps.googleusercontent.com',
  FACEBOOK_APP_ID: '554442523971007',
});

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

// Validation schemas
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

// Login schema is simpler since it only requires email and password
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

// Types for form values
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
