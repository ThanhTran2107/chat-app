# Chat App

A full-stack chat application using **React 19 + TypeScript** (frontend) and **Node.js + Express 5** (backend), with **MongoDB** as the database. The project includes user authentication, session management, API protection, basic register/login UI, and is ready for real-time chat extension.

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

Chat App is a web-based messaging platform where users can register, log in, and chat in real time. The project is split into two separate workspaces:

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
  │   ├── controllers/ (authController.js, userController.js)
  │   ├── libs/ (db.js)
  │   ├── middlewares/ (authMiddleware.js)
  │   ├── models/ (User.js, Session.js)
  │   ├── routes/ (authRoute.js, userRoute.js)
  │   └── server.js
  └── package.json
```

---

## Current Features

### Backend

- **Register**: Create a new account (username, email, password, full name)
- **Login**: Authenticate, return access token (JWT) and refresh token (cookie)
- **Logout**: Delete refresh token session
- **Protected routes**: `/chat-app/user/*` requires a valid JWT
- **Get current user info**: `/chat-app/user/me` (protected)
- **Refresh token**: Issue new access token via refresh token (cookie)

### Frontend

- **Register page**: Full form, validation, social login button (Google, Meta - UI)
- **Login page**: Login form, checkbox, social login button (UI)
- **Chat page**: Display user info, logout button (no real chat yet)
- **Auth state management**: Zustand, store user and token
- **Toast notifications**: Sonner
- **Route protection**: Redirect if not logged in/already logged in

### User Model

Each user includes: `username`, `hashedPassword`, `email`, `displayName`, `avatarUrl`, `avatarId`, `bio`, `phoneNumber`

---

## Planned Features

- [ ] Complete login page UI & validation
- [ ] JWT refresh token flow (auto-renew access token via cookie)
- [ ] Chat page UI: conversation list, chat box, message input
- [ ] Real-time chat (WebSocket/Socket.IO)
- [ ] One-on-one and group messaging
- [ ] Online/offline/away status
- [ ] Read receipts
- [ ] File & image attachments
- [ ] User profile page (avatar, bio, display name)
- [ ] User search
- [ ] Notifications
- [ ] OAuth login (Google, Meta)
- [ ] Dark/light mode
- [ ] Docker, CI/CD

---

## API Reference

### Base URL

```
http://localhost:3000
```

### Auth Routes — `/chat-app/auth`

| Method | Endpoint                  | Auth | Description                          |
| ------ | ------------------------- | ---- | ------------------------------------ |
| POST   | `/chat-app/auth/register` | None | Register a new user                  |
| POST   | `/chat-app/auth/login`    | None | Log in, returns access token         |
| POST   | `/chat-app/auth/logout`   | None | Log out, clears refresh token cookie |

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

All requests must include header:

```
Authorization: Bearer <accessToken>
```

| Method | Endpoint            | Description                                    |
| ------ | ------------------- | ---------------------------------------------- |
| GET    | `/chat-app/user/me` | Get the currently authenticated user's profile |

---

## Environment Variables

### Server (`server/.env`)

Create a file `server/.env` with the following variables:

```env
PORT=3000
MONGODB_CONNECTIONSTRING=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>
ACCESS_TOKEN_SECRET=your_super_secret_key_here
```

| Variable                   | Description                                        |
| -------------------------- | -------------------------------------------------- |
| `PORT`                     | Port the server listens on (default: `3000`)       |
| `MONGODB_CONNECTIONSTRING` | MongoDB connection string (Atlas or local)         |
| `ACCESS_TOKEN_SECRET`      | Secret key used to sign & verify JWT access tokens |

### Client (`client/.env`) _(optional, for future use)_

```env
VITE_API_BASE_URL=http://localhost:3000
```

---

## Setup & Run (Installation Guide)

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
cp .env.example .env
# Edit .env with your MongoDB info and ACCESS_TOKEN_SECRET
```

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

- To register, you must fill in all required fields (username, email, password, full name)
- Successful login will store the access token (JWT) and refresh token (cookie)
- All `/chat-app/user/*` routes require the header: `Authorization: Bearer <accessToken>`
- Chat functionality is not implemented yet, only UI and authentication are available

---

## Scripts

### Server

- `npm run dev`: Run server with nodemon (dev, auto-restart)
- `npm start`: Run server in production

### Client

- `npm run dev`: Run Vite dev server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint
