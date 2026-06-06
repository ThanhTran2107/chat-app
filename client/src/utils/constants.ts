import { z } from 'zod';

// Validation schemas and constants for authentication forms

export const USERNAME_MIN_LENGTH = 3;
export const PASSWORD_MIN_LENGTH = 6;

export const API_ENDPOINTS = Object.freeze({
  // Base path for all API endpoints
  BASE: '/chat-app',

  // Authentication endpoints
  AUTH_REGISTER: 'auth/register',
  AUTH_LOGIN: 'auth/login',
  AUTH_LOGOUT: 'auth/logout',
  AUTH_REFRESH: 'auth/refresh',

  // User-related endpoints
  USER_ME: 'user/me',

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
  CHAT: '/',
});

// Validation schemas
export const registerSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    username: z.string().min(USERNAME_MIN_LENGTH, `Username must be at least ${USERNAME_MIN_LENGTH} characters`),
    email: z.email('Invalid email address'),
    password: z.string().min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`),
    confirmPassword: z
      .string()
      .min(PASSWORD_MIN_LENGTH, `Confirm password must be at least ${PASSWORD_MIN_LENGTH} characters`),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Login schema is simpler since it only requires username and password
export const loginSchema = z.object({
  username: z.string().min(USERNAME_MIN_LENGTH, `Username must be at least ${USERNAME_MIN_LENGTH} characters`),
  password: z.string().min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`),
});

// Types for form values
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
