# Chat App

A full-stack real-time chat application built with **React + TypeScript** on the frontend and **Node.js + Express** on the backend, using **MongoDB** as the database.

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

## Tech Stack

### Frontend (`client/`)

| Technology            | Purpose                    |
| --------------------- | -------------------------- |
| React 19 + TypeScript | UI framework               |
| Vite                  | Build tool & dev server    |
| Tailwind CSS v4       | Styling                    |
| shadcn/ui + base-ui   | Component library          |
| React Router v7       | Client-side routing        |
| React Hook Form + Zod | Form handling & validation |
| Zustand               | Global state management    |
| Axios                 | HTTP client                |
| Sonner                | Toast notifications        |
| Lucide React          | Icons                      |

### Backend (`server/`)

| Technology           | Purpose                         |
| -------------------- | ------------------------------- |
| Node.js + Express 5  | HTTP server & routing           |
| MongoDB + Mongoose   | Database & ODM                  |
| bcrypt               | Password hashing                |
| JSON Web Token (JWT) | Access token authentication     |
| cookie-parser        | HTTP cookie handling            |
| dotenv               | Environment variable management |
| nodemon              | Development auto-restart        |

---

## Project Structure

```
chat-app/
├── client/                     # Frontend (React + TypeScript)
│   ├── public/                 # Static assets (logo.svg, images)
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── ui/             # Reusable UI primitives (Button, Input, Card, etc.)
│   │   │   └── signup-form.tsx # Registration form component
│   │   ├── lib/
│   │   │   └── utils.ts        # Utility helpers (cn, etc.)
│   │   ├── pages/
│   │   │   ├── chat.page.tsx   # Main chat page (in progress)
│   │   │   ├── login.page.tsx  # Login page (in progress)
│   │   │   └── register.page.tsx # Registration page
│   │   ├── App.tsx             # Root app with routing
│   │   ├── main.tsx            # Entry point
│   │   └── index.css           # Global styles & Tailwind imports
│   ├── package.json
│   └── vite.config.ts
│
└── server/                     # Backend (Node.js + Express)
    ├── src/
    │   ├── controllers/
    │   │   ├── authController.js   # register, logIn, logOut
    │   │   └── userController.js   # authMe (get current user)
    │   ├── libs/
    │   │   └── db.js               # MongoDB connection
    │   ├── middlewares/
    │   │   └── authMiddleware.js   # JWT access token guard
    │   ├── models/
    │   │   ├── User.js             # User schema
    │   │   └── Session.js          # Refresh token session schema
    │   ├── routes/
    │   │   ├── authRoute.js        # /chat-app/auth/*
    │   │   └── userRoute.js        # /chat-app/user/*
    │   └── server.js               # App entry point
    └── package.json
```

---

## Current Features

### Authentication

- **Register** — Create a new account with first name, last name, username, email, and password
- **Login** — Authenticate with username and password; returns a short-lived JWT access token (30 min) and sets an HTTP-only refresh token cookie (14 days)
- **Logout** — Invalidates the refresh token session in the database
- **Protected routes** — All `/chat-app/user/*` endpoints require a valid `Authorization: Bearer <token>` header

### Frontend Pages

- **Register page** — Fully designed signup form with: name fields, username, email, password visibility toggle, social login buttons (Google, Meta), branded logo
- **Login page** — Placeholder (in progress)
- **Chat page** — Placeholder (in progress)

### User Model

Each user stores: `username`, `hashedPassword`, `email`, `displayName`, `avatarUrl`, `avatarId`, `bio`, `phoneNumber`

---

## Planned Features

- [ ] Login page UI & form validation
- [ ] JWT refresh token flow (auto-renew access token using cookie)
- [ ] Chat page UI — conversation list, message thread, message input
- [ ] Real-time messaging via **WebSocket / Socket.IO**
- [ ] One-on-one private messaging
- [ ] Group chats / channels
- [ ] Online presence indicator (online / offline / away)
- [ ] Message read receipts
- [ ] File & image attachments
- [ ] User profile page (edit avatar, bio, display name)
- [ ] Search users
- [ ] Notifications
- [ ] OAuth login (Google, Meta)
- [ ] Dark / light mode toggle
- [ ] Deployment configuration (Docker, CI/CD)

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

## Setup & Installation

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) v9 or higher
- A [MongoDB](https://www.mongodb.com/atlas) database (Atlas free tier is sufficient)

### 1. Clone the repository

```bash
git clone <repository-url>
cd chat-app
```

### 2. Install server dependencies

```bash
cd server
npm install
```

### 3. Configure server environment variables

```bash
# Still inside /server
cp .env.example .env   # or create .env manually
```

Edit `server/.env` and fill in your values:

```env
PORT=3000
MONGODB_CONNECTIONSTRING=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/chat-app
ACCESS_TOKEN_SECRET=replace_this_with_a_long_random_string
```

> **Tip:** Generate a strong secret with:
>
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

### 4. Install client dependencies

```bash
cd ../client
npm install
```

---

## Running the Project

Open **two separate terminals**.

### Terminal 1 — Start the backend

```bash
cd server
npm run dev
```

Server starts at `http://localhost:3000`

### Terminal 2 — Start the frontend

```bash
cd client
npm run dev
```

Frontend starts at `http://localhost:5173` (or the port Vite assigns)

---

## Available Scripts

### Server

| Command       | Description                                         |
| ------------- | --------------------------------------------------- |
| `npm run dev` | Start server with nodemon (auto-restart on changes) |
| `npm start`   | Start server without nodemon (production)           |

### Client

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start Vite dev server                |
| `npm run build`   | Type-check and build for production  |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run ESLint                           |
