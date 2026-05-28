# Chat App

A full-stack chat application using **React 19 + TypeScript** (frontend) and **Node.js + Express 5** (backend), with **MongoDB** as the database. The project includes user authentication, session management, friend / conversation APIs, Swagger docs, and foundational direct/group messaging endpoints.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Current Features](#current-features)
- [Planned Features](#planned-features)
- [API Reference](#api-reference)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)

---

## Overview

Chat App is a web-based messaging platform where users can register, log in, manage friends, and use conversation/message APIs. The project is split into two separate workspaces:

- **`client/`** — React SPA (Single Page Application)
- **`server/`** — REST API server

---

## Tech Stack & Libraries

### Frontend (`client/`)

- **React 19**, **TypeScript**
- **Vite** (dev server & build)
- **Tailwind CSS v4** (styling)
- **shadcn/ui**, **base-ui**, **Ant Design** (UI components)
- **React Router v7** (routing)
- **React Hook Form**, **Zod** (form & validation)
- **Zustand** (state management)
- **Axios** (HTTP client)
- **Sonner** (toast notifications)
- **Lucide React** (icons)
- **Prettier, ESLint, Husky, lint-staged** (format/lint)
- **@fontsource-variable/geist**, **class-variance-authority**, **clsx**, **tailwind-merge**, **tailwindcss-animate**, **tw-animate-css**

### Backend (`server/`)

- **Node.js + Express 5**
- **MongoDB + Mongoose**
- **bcrypt** (hash password)
- **jsonwebtoken** (JWT)
- **cookie-parser**
- **dotenv**
- **cors**
- **swagger-ui-express**
- **nodemon** (dev auto-restart)

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
│   │   ├── pages/ (chat.page.tsx, login.page.tsx, register.page.tsx)
│   │   ├── routes/ (protected-route.tsx, redirect-if-authenticated.tsx)
│   │   ├── stores/ (use-auth-store.ts)
│   │   ├── types/ (store.ts, user.ts)
│   │   └── utils/ (constants.ts, services/auth.service.ts)
│   ├── package.json, tsconfig.json, vite.config.ts, eslint.config.js, ...
│
└── server/
  ├── src/
  │   ├── controllers/ (authController.js, userController.js, friendController.js, messageController.js, conversationController.js)
  │   ├── libs/ (db.js)
  │   ├── middlewares/ (authMiddleware.js, friendMiddleware.js)
  │   ├── models/ (User.js, Session.js, Friend.js, FriendRequest.js, Conversation.js, Message.js)
  │   ├── routes/ (authRoute.js, userRoute.js, friendRoute.js, messageRoute.js, conversationRoute.js)
  │   ├── utils/ (messageHelper.js)
  │   ├── swagger.json
  │   └── server.js
  └── package.json
```

---

## Current Features

### Backend

- **User auth**: register, login, logout, refresh token
- **JWT protection**: all private APIs require `Authorization: Bearer <accessToken>`
- **Session-based refresh**: refresh token stored in cookie and validated with `Session` model
- **User profile**: `/chat-app/user/me`
- **Friend system**:
  - send friend requests
  - accept friend requests
  - decline friend requests
  - list friends
  - list sent / received requests
- **Conversations**:
  - create direct conversations
  - create group conversations
  - list user conversations
  - paginate conversation messages
- **Messaging API**:
  - send direct messages
  - send group messages
  - update conversation metadata and unread counts
- **Swagger docs**: backend API documentation served at `/api-docs`

### Frontend

- **Register page**: form validation and social login UI controls
- **Login page**: auth form with UI state and token storage
- **Chat page**: user info and logout support
- **Auth state management**: Zustand for auth data
- **Route protection**: redirects based on login state
- **Toasts**: Sonner notifications for success/error states

### User Model

Each user includes: `username`, `hashedPassword`, `email`, `displayName`, `avatarUrl`, `avatarId`, `bio`, `phoneNumber`

---

## Planned Features

- [ ] Complete chat UI and integrate message list with backend
- [ ] Real-time chat with WebSocket / Socket.IO
- [ ] Online/offline presence status
- [ ] Read receipts and typing indicators
- [ ] File and image attachments
- [ ] Search users and view profiles
- [ ] Notifications
- [ ] OAuth login (Google, Meta)
- [ ] Theme toggle (dark/light)
- [ ] Docker and CI/CD

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

### Auth Routes — `/chat-app/auth`

| Method | Endpoint                  | Auth | Description                          |
| ------ | ------------------------- | ---- | ------------------------------------ |
| POST   | `/chat-app/auth/register` | None | Register a new user                  |
| POST   | `/chat-app/auth/login`    | None | Log in, returns access token         |
| POST   | `/chat-app/auth/logout`   | None | Log out, clears refresh token cookie |
| POST   | `/chat-app/auth/refresh`  | None | Refresh access token from cookie     |

#### POST `/chat-app/auth/register`

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "yourpassword"
}
```

Response: `204 No Content`

#### POST `/chat-app/auth/login`

```json
{
  "username": "johndoe",
  "password": "yourpassword"
}
```

Response:

```json
{
  "accessToken": "<jwt>"
}
```

### User Routes — `/chat-app/user` _(Protected)_

Requires header:

```
Authorization: Bearer <accessToken>
```

| Method | Endpoint            | Description                                    |
| ------ | ------------------- | ---------------------------------------------- |
| GET    | `/chat-app/user/me` | Get the currently authenticated user's profile |

### Friend Routes — `/chat-app/friend` _(Protected)_

| Method | Endpoint                                      | Description                             |
| ------ | --------------------------------------------- | --------------------------------------- |
| POST   | `/chat-app/friend/request`                     | Send a friend request                   |
| POST   | `/chat-app/friend/request/:requestId/accept`   | Accept a friend request                 |
| POST   | `/chat-app/friend/request/:requestId/decline`  | Decline a friend request                |
| GET    | `/chat-app/friend/get-all`                     | Get friend list                         |
| GET    | `/chat-app/friend/requests`                    | List sent and received friend requests  |

### Message Routes — `/chat-app/message` _(Protected)_

| Method | Endpoint                    | Description                        |
| ------ | --------------------------- | ---------------------------------- |
| POST   | `/chat-app/message/direct`  | Send a direct one-on-one message   |
| POST   | `/chat-app/message/group`   | Send a group conversation message  |

### Conversation Routes — `/chat-app/conversation` _(Protected)_

| Method | Endpoint                                      | Description                                 |
| ------ | --------------------------------------------- | ------------------------------------------- |
| POST   | `/chat-app/conversation`                       | Create a direct or group conversation       |
| GET    | `/chat-app/conversation`                       | Get conversations for the current user      |
| GET    | `/chat-app/conversation/:conversationId/messages` | Get messages for a conversation           |

---

## Environment Variables

### Server (`server/.env`)

Create a file `server/.env` with the following variables:

```env
PORT=3000
MONGODB_CONNECTIONSTRING=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>
ACCESS_TOKEN_SECRET=your_super_secret_key_here
CLIENT_URL=http://localhost:5173
```

| Variable                   | Description                                        |
| -------------------------- | -------------------------------------------------- |
| `PORT`                     | Port the server listens on (default: `3000`)       |
| `MONGODB_CONNECTIONSTRING` | MongoDB connection string (Atlas or local)         |
| `ACCESS_TOKEN_SECRET`      | Secret key used to sign & verify JWT access tokens |
| `CLIENT_URL`               | Frontend origin allowed by CORS                   |

### Client (`client/.env`) _(optional)_

```env
VITE_API_BASE_URL=http://localhost:3000
```

---

## Setup & Installation

### Requirements

- Node.js >= 18
- npm >= 9
- MongoDB (Atlas/local)

### 1. Clone the repository

```bash
git clone <repository-url>
cd chat-app
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

Create `.env` from your environment settings.

### 3. Install frontend dependencies

```bash
cd ../client
npm install
```

### 4. Run the project

Open 2 terminals:

**Terminal 1: Backend**

```bash
cd server
npm run dev
# Server runs at http://localhost:3000
```

**Terminal 2: Frontend**

```bash
cd client
npm run dev
# Frontend runs at http://localhost:5173
```

---

## Notes

- Backend routes are mounted under `/chat-app`
- Swagger docs are available at `/api-docs`
- JWT access token must be sent in `Authorization: Bearer <accessToken>`
- Refresh token is stored in a secure cookie and used by `/chat-app/auth/refresh`
- Messaging APIs support direct and group message creation via server endpoints

---

## Server Scripts

- `npm run dev`: Run backend with nodemon in development
- `npm start`: Run backend in production

## Client Scripts

- `npm run dev`: Run Vite dev server
- `npm run build`: Build production assets
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint
