# Tetra

A full-stack chat application with a **React 18 + TypeScript** SPA frontend and a **Node.js + Express 5** backend. The project now includes registration, login, email verification, password recovery, friend search and requests, profile management, conversation and messaging APIs, Cloudinary avatar upload, and Swagger documentation.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Current Features](#current-features)
- [API Reference](#api-reference)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)

---

## Overview

Tetra is a web-based messaging platform where users can register, verify their email, recover access with password reset, manage friends, and participate in direct/group conversations. The codebase is split into two workspaces:

- **`client/`** — React SPA frontend
- **`server/`** — Express REST API backend

---

## Tech Stack & Libraries

### Frontend (`client/`)

- **React 18**, **TypeScript**
- **Vite**
- **Tailwind CSS v4**
- **React Router v7**
- **React Hook Form**, **Zod**
- **Zustand**
- **Axios**
- **Sonner**
- **Lucide React**
- **@base-ui/react**, **Ant Design**
- **socket.io-client**
- **@fontsource-variable/geist**, **class-variance-authority**, **clsx**, **tailwind-merge**, **tailwindcss-animate**, **tw-animate-css**

### Backend (`server/`)

- **Node.js + Express 5**
- **MongoDB + Mongoose**
- **bcrypt**
- **jsonwebtoken**
- **cookie-parser**
- **cors**
- **dotenv**
- **nodemailer**
- **cloudinary**
- **swagger-ui-express**
- **socket.io**

---

## Project Structure

```
chat-app/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── login-form.tsx, register-form.tsx, logout-button.tsx, social-buttons.tsx
│   │   │   ├── antd/ (checkbox, spin)
│   │   │   └── ui/ (button, card, field, input, label, separator, ...)
│   │   ├── lib/ (axios.ts, utils.ts)
│   │   ├── pages/ (chat-page, login-page, register-page, forgot-password-page, reset-password-page, verify-email-page, resend-verification-page)
│   │   ├── routes/ (protected-route.tsx, redirect-if-authenticated.tsx)
│   │   ├── stores/ (use-auth-store.ts, use-chat-store.ts)
│   │   ├── types/ (chat.ts, store.ts, user.ts)
│   │   └── utils/ (constants.ts, services/auth.service.ts)
│   ├── package.json, tsconfig.json, vite.config.ts, eslint.config.js, ...
│
└── server/
  ├── src/
  │   ├── controllers/ (authController.js, userController.js, friendController.js, messageController.js, conversationController.js)
  │   ├── libs/ (db.js, mailer.js)
  │   ├── middlewares/ (authMiddleware.js, friendMiddleware.js, uploadMiddleware.js)
  │   ├── models/ (User.js, Session.js, Friend.js, FriendRequest.js, Conversation.js, Message.js)
  │   ├── routes/ (authRoute.js, userRoute.js, friendRoute.js, messageRoute.js, conversationRoute.js)
  │   ├── utils/ (messageHelper.js)
  │   ├── swagger.json
  │   ├── sockets/ (index.js)
  │   └── server.js
  └── package.json
```

---

## Current Features

### Backend

- **Authentication flows**
  - register with email and password
  - login and logout
  - refresh token support via cookie-based sessions
  - email verification with verification link
  - resend verification email
  - forgot password and reset password via email link
- **JWT protected API** for private routes
- **User profile**
  - get current profile
  - update display name, username, email, phone number, bio, and online visibility
  - upload avatar through Cloudinary
  - delete account and cleanup user-related sessions, friends, conversations, and messages
- **Friend system**
  - search users by username
  - send friend requests
  - accept/decline friend requests
  - list friends and request status
- **Conversations and messaging**
  - create direct or group conversations
  - list conversations for the authenticated user
  - load conversation messages
  - send direct messages
  - send group messages
  - mark conversations as seen
- **Email delivery** via SMTP templates
- **Swagger docs** available at `/api-docs`

### Frontend

- **Authentication pages**: register, login, forgot password, reset password, verify email, resend verification
- **Social login** support for Google and Facebook
- **Chat page** with sidebar layout
- **Route guarding**: protected routes and redirect-if-authenticated flow
- **Form validation** using Zod and react-hook-form
- **Toasts** for success and error states using Sonner
- **Friend search and user cards** for adding contacts
- **Profile UI** with disabled email input in profile edit
- **Auth store refresh** after email verification to keep user state current

### Data Model

Users include fields for `username`, `email`, `emailVerified`, `emailVerificationToken`, `emailVerificationExpires`, `hashedPassword`, `displayName`, `avatarUrl`, `avatarId`, `bio`, and `phoneNumber`.

---

## API Reference

### Base URL

```
http://localhost:3000
```

### Swagger UI

Open API docs at:

```
http://localhost:3000/api-docs
```

### Auth Routes — `/tetra/auth`

| Method | Endpoint                             | Auth | Description                                    |
| ------ | ------------------------------------ | ---- | ---------------------------------------------- |
| POST   | `/tetra/auth/register`            | None | Register a new user                            |
| POST   | `/tetra/auth/login`               | None | Authenticate and return an access token        |
| POST   | `/tetra/auth/google`              | None | Authenticate using Google OAuth access token   |
| POST   | `/tetra/auth/facebook`            | None | Authenticate using Facebook OAuth access token |
| POST   | `/tetra/auth/logout`              | None | Logout and clear refresh token cookie          |
| POST   | `/tetra/auth/refresh`             | None | Refresh access token from cookie               |
| POST   | `/tetra/auth/forgot-password`     | None | Send password reset email                      |
| POST   | `/tetra/auth/reset-password`      | None | Reset password with token                      |
| GET    | `/tetra/auth/verify-email`        | None | Verify email using token query parameter       |
| POST   | `/tetra/auth/verify-email`        | None | Verify email with form submission              |
| POST   | `/tetra/auth/resend-verification` | None | Resend the verification email                  |

### User Routes — `/tetra/user` _(Protected)_

Requires header:

```
Authorization: Bearer <accessToken>
```

| Method | Endpoint                                    | Description                    |
| ------ | ------------------------------------------- | ------------------------------ |
| GET    | `/tetra/user/me`                         | Get authenticated user profile |
| PATCH  | `/tetra/user/me`                         | Update profile fields          |
| POST   | `/tetra/user/uploadAvatar`               | Upload user avatar             |
| DELETE | `/tetra/user/me`                         | Delete current user account    |
| GET    | `/tetra/user/search?username=<username>` | Search users by username       |

### Friend Routes — `/tetra/friend` _(Protected)_

| Method | Endpoint                                      | Description                            |
| ------ | --------------------------------------------- | -------------------------------------- |
| POST   | `/tetra/friend/request`                    | Send a friend request                  |
| POST   | `/tetra/friend/request/:requestId/accept`  | Accept a friend request                |
| POST   | `/tetra/friend/request/:requestId/decline` | Decline a friend request               |
| GET    | `/tetra/friend/get-all`                    | Get friend list                        |
| GET    | `/tetra/friend/requests`                   | List sent and received friend requests |

### Message Routes — `/tetra/message` _(Protected)_

| Method | Endpoint                   | Description                       |
| ------ | -------------------------- | --------------------------------- |
| POST   | `/tetra/message/direct` | Send a direct one-on-one message  |
| POST   | `/tetra/message/group`  | Send a group conversation message |

### Conversation Routes — `/tetra/conversation` _(Protected)_

| Method | Endpoint                                          | Description                            |
| ------ | ------------------------------------------------- | -------------------------------------- |
| POST   | `/tetra/conversation`                          | Create a direct or group conversation  |
| GET    | `/tetra/conversation`                          | Get conversations for the current user |
| GET    | `/tetra/conversation/:conversationId/messages` | Get messages for a conversation        |
| PATCH  | `/tetra/conversation/:conversationId/seen`     | Mark conversation messages as seen     |

---

## Setup & Installation

1. Clone the repository.
2. Install backend dependencies:

```bash
cd server
npm install
```

3. Install frontend dependencies:

```bash
cd ../client
npm install
```

4. Create `server/.env` with required environment variables.

---

## Environment Variables

### Server (`server/.env`)

Create a file `server/.env` with the following variables:

```env
PORT=3000
MONGODB_CONNECTIONSTRING=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>
ACCESS_TOKEN_SECRET=your_super_secret_key_here
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_user@example.com
SMTP_PASS=your_smtp_password
EMAIL_VERIFY_PATH=/verify-email
PASSWORD_RESET_PATH=/reset-password
```

| Variable                 | Description                                |
| ------------------------ | ------------------------------------------ |
| PORT                     | Backend server port                        |
| MONGODB_CONNECTIONSTRING | MongoDB connection URI                     |
| ACCESS_TOKEN_SECRET      | Secret used to sign JWT access tokens      |
| CLIENT_URL               | Frontend origin for CORS and email links   |
| CLOUDINARY_CLOUD_NAME    | Cloudinary cloud name                      |
| CLOUDINARY_API_KEY       | Cloudinary API key                         |
| CLOUDINARY_API_SECRET    | Cloudinary API secret                      |
| SMTP_HOST                | SMTP server host for email delivery        |
| SMTP_PORT                | SMTP server port                           |
| SMTP_SECURE              | `true` for TLS/SSL, otherwise `false`      |
| SMTP_USER                | SMTP username/email used as sender         |
| SMTP_PASS                | SMTP password                              |
| EMAIL_VERIFY_PATH        | Frontend path for email verification links |
| PASSWORD_RESET_PATH      | Frontend path for password reset links     |

---

## Running the Project

Use separate terminals for frontend and backend.

Backend:

```bash
cd server
npm run dev
```

Frontend:

```bash
cd client
npm run dev
```

Open the app in your browser at `http://localhost:5173`.

---

## Notes

- Backend routes are mounted under `/tetra`
- Swagger docs are available at `/api-docs`
- JWT access token must be sent in `Authorization: Bearer <accessToken>`
- Refresh token is stored in a secure cookie and used by `/tetra/auth/refresh`
- Messaging APIs support direct and group message creation via server endpoints

## Backend Scripts

- `npm run dev`: Run backend with nodemon in development
- `npm start`: Run backend in production

## Client Scripts

- `npm run dev`: Run Vite dev server
- `npm run build`: Build production assets
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint
