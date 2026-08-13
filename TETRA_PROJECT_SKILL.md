# Tetra Chat App — AI Agent Project Skill

> Project-specific operating instructions for AI coding agents working on `ThanhTran2107/chat-app`.
> Repository: https://github.com/ThanhTran2107/chat-app
> Default branch: `main`
> Product name: **Tetra**
> Architecture: **full-stack React SPA + Express REST API + MongoDB/Mongoose + Socket.IO**

---

## 1. Mission

When modifying this repository, the agent must understand the existing architecture before editing code.

This is a real-time chat application, not a generic CRUD app. Changes can affect several coupled layers:

1. React UI
2. Zustand client state
3. Axios authentication/refresh behavior
4. REST services
5. Express routes/controllers/middleware
6. MongoDB/Mongoose models
7. Socket.IO events and rooms
8. Email/OAuth/Cloudinary integrations

For any feature that crosses these boundaries, update all affected layers consistently.

### Primary rule

**Prefer the smallest change that preserves the current architecture and behavior.**

Do not introduce a new state-management library, API abstraction, routing strategy, ORM, websocket abstraction, or architectural layer unless explicitly requested.

---

# 2. Repository Structure

```text
chat-app/
├── README.md
├── client/
│   ├── public/
│   │   ├── logo.svg
│   │   ├── main-logo.png
│   │   ├── notify-1s.wav
│   │   ├── placeholder.png
│   │   └── placeholderSignUp.png
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── index.css
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── antd/
│   │   │   ├── side-bar/
│   │   │   └── ui/
│   │   ├── lib/
│   │   │   ├── axios.ts
│   │   │   └── utils.ts
│   │   ├── pages/
│   │   │   ├── chat-page/
│   │   │   ├── forgot-password-page/
│   │   │   ├── landing-page/
│   │   │   ├── login-page/
│   │   │   ├── register-page/
│   │   │   ├── resend-verification-page/
│   │   │   ├── reset-password-page/
│   │   │   └── verify-email-page/
│   │   ├── routes/
│   │   │   ├── protected-route.tsx
│   │   │   └── redirect-if-authenticated.tsx
│   │   ├── stores/
│   │   │   ├── use-auth-store.ts
│   │   │   ├── use-chat-store.ts
│   │   │   ├── use-friend-store.ts
│   │   │   ├── use-socket-store.ts
│   │   │   ├── use-theme-store.ts
│   │   │   └── use-user-store.ts
│   │   ├── types/
│   │   │   ├── chat.ts
│   │   │   ├── store.ts
│   │   │   └── user.ts
│   │   └── utils/
│   │       ├── constants.ts
│   │       ├── hooks/
│   │       └── services/
│   │           ├── auth.service.ts
│   │           ├── chat.service.ts
│   │           ├── friend.service.ts
│   │           └── user.service.ts
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── eslint.config.js
│   ├── .prettierrc
│   ├── components.json
│   └── vercel.json
│
└── server/
    ├── src/
    │   ├── server.js
    │   ├── controllers/
    │   │   ├── authController.js
    │   │   ├── conversationController.js
    │   │   ├── friendController.js
    │   │   ├── messageController.js
    │   │   └── userController.js
    │   ├── libs/
    │   │   ├── db.js
    │   │   ├── mailer.js
    │   │   └── templates/
    │   ├── middlewares/
    │   │   ├── authMiddleware.js
    │   │   ├── friendMiddleware.js
    │   │   ├── socketMiddleware.js
    │   │   └── uploadMiddleware.js
    │   ├── models/
    │   │   ├── User.js
    │   │   ├── Session.js
    │   │   ├── Friend.js
    │   │   ├── FriendRequest.js
    │   │   ├── Conversation.js
    │   │   └── Message.js
    │   ├── routes/
    │   │   ├── authRoute.js
    │   │   ├── conversationRoute.js
    │   │   ├── friendRoute.js
    │   │   ├── messageRoute.js
    │   │   └── userRoute.js
    │   ├── services/
    │   │   ├── authService.js
    │   │   └── oauthService.js
    │   ├── sockets/
    │   │   └── index.js
    │   ├── utils/
    │   │   ├── messageHelper.js
    │   │   └── validation.js
    │   └── swagger.json
    └── package.json
```

The repository tree was inspected from the `main` branch. The tree is not truncated.

---

# 3. Technology Stack

## Frontend

- React 18
- TypeScript 6
- Vite 8
- React Router DOM 7
- Zustand 5
- Axios
- React Hook Form
- Zod 4
- Tailwind CSS 4
- Ant Design 6
- shadcn/base UI-style components
- Lucide React
- Sonner
- Socket.IO Client 4
- Emoji Mart
- Howler
- Lodash ES
- ESLint
- Prettier
- Husky / lint-staged

## Backend

- Node.js
- Express 5
- MongoDB
- Mongoose 9
- Socket.IO 4
- JWT
- bcrypt
- cookie-parser
- CORS
- dotenv
- Nodemailer
- Cloudinary
- Multer
- Swagger UI
- OAuth integrations for Google/Facebook

---

# 4. Frontend Architecture

## 4.1 Application bootstrap

`client/src/main.tsx` mounts the React application.

`client/src/App.tsx` is the application composition root.

App responsibilities:

- theme synchronization
- auth session restoration
- Socket.IO lifecycle
- toast provider
- route definitions
- lazy loading

Pages are lazy-loaded with `React.lazy()` and rendered through `Suspense`.

### Existing route model

- `/` → landing page, redirected away if authenticated
- `/login` → login
- `/register` → registration
- `/forgot-password`
- `/reset-password`
- `/verify-email`
- `/resend-verification`
- `/chat` → protected chat application

Do not bypass `ProtectedRoute` / `RedirectIfAuthenticated` when adding auth-sensitive routes.

---

# 5. Client State Management

The application uses Zustand.

## 5.1 Auth store

File:

`client/src/stores/use-auth-store.ts`

State:

- `accessToken`
- `user`
- `loading`

Responsibilities:

- register
- login
- Google login
- Facebook login
- logout
- fetch current user
- refresh access token
- clear global auth/session state

Important behavior:

- The access token lives in Zustand state.
- The refresh token is stored server-side in an HTTP-only cookie.
- Auth persistence stores the user, not the access token.
- `AUTH_SESSION = '1'` is used as a lightweight local flag to determine whether refresh should be attempted on startup.
- `clearState()` also resets chat state and disconnects Socket.IO.
- `fetchMe()` and `refreshToken()` use promise de-duplication to prevent duplicate concurrent requests.

### Do not

- store refresh tokens in localStorage/sessionStorage
- manually duplicate token refresh logic inside components
- bypass `useAuthStore` for auth state changes

---

# 6. Axios Authentication Architecture

File:

`client/src/lib/axios.ts`

There is one primary Axios instance:

- `baseURL = import.meta.env.VITE_API_URL`
- `withCredentials = true`
- JSON content type

## Request interceptor

Reads the access token directly from:

`useAuthStore.getState()`

and sends:

```http
Authorization: Bearer <accessToken>
```

## Response interceptor

Handles authentication failures.

For non-auth requests:

1. detect HTTP 401 or token-expiration messages
2. retry refresh at most once
3. call `/tetra/auth/refresh`
4. update the Zustand access token
5. retry the original request
6. if refresh fails, clear state and redirect to `/login`

Auth endpoints are excluded from automatic refresh.

### Agent rule

If changing authentication behavior, inspect BOTH:

- `client/src/lib/axios.ts`
- `client/src/stores/use-auth-store.ts`

Do not modify only one side.

---

# 7. Client Service Layer

REST calls are intentionally separated from UI/state.

Files:

- `client/src/utils/services/auth.service.ts`
- `client/src/utils/services/chat.service.ts`
- `client/src/utils/services/friend.service.ts`
- `client/src/utils/services/user.service.ts`

Use these services instead of making ad-hoc Axios calls from UI components whenever an existing service covers the domain.

### Example

Chat calls belong in:

`ChatService`

not directly inside:

`message-input.component.tsx`

The normal flow is:

```text
Component
  ↓
Zustand store
  ↓
Domain service
  ↓
Axios instance
  ↓
Express route
  ↓
Controller
  ↓
Mongoose model
```

---

# 8. Client Constants and Validation

File:

`client/src/utils/constants.ts`

Contains:

- app name
- local-storage keys
- API endpoints
- frontend routes
- Google/Facebook client IDs
- Zod validation schemas

Important validation rules:

### Username

Minimum 3 characters.

### Password

Minimum 8 characters and must contain:

- uppercase
- lowercase
- number
- special character
- no spaces

### Register

Requires:

- firstName
- lastName
- username
- email
- password
- confirmPassword

### Login

Requires:

- email
- password
- optional rememberMe

### Password reset

Uses the same strong password policy.

### Agent rule

Do not duplicate these validation rules in individual components unless backend compatibility requires it.

---

# 9. Chat State Architecture

File:

`client/src/stores/use-chat-store.ts`

Main state:

- `conversations`
- `messages`
- `activeConversationId`
- `convoLoading`
- `messageLoading`
- `loading`

Messages are keyed by conversation ID:

```text
messages[conversationId]
```

Each conversation message collection tracks:

- items
- hasMore
- nextCursor

## Pagination

The backend returns messages newest-first, then the client reverses/merges them so the UI can maintain chronological order.

Default page size:

`50`

Cursor is based on message `createdAt`.

### Important

When adding realtime messages:

- avoid duplicates by message `_id`
- preserve existing pagination cursor
- set `isOwn`
- mark realtime messages with `isNew`

---

# 10. Chat Persistence

The chat store is persisted with Zustand.

Persisted data is intentionally reduced to conversation metadata:

- active conversation
- conversation IDs
- participants
- last message
- last message timestamp
- unread counts
- seenBy
- group metadata
- timestamps

Full message history is NOT intended to be persisted indefinitely.

Persistence uses a throttled localStorage writer to reduce write frequency.

Do not persist sensitive auth credentials.

---

# 11. Realtime Architecture

Socket.IO is a first-class part of the product.

Client:

`client/src/stores/use-socket-store.ts`

Server:

`server/src/sockets/index.js`

## Client connection

The client connects only when an access token exists.

Socket configuration:

- URL: `VITE_SOCKET_URL`
- auth token
- websocket transport

Socket lifecycle is controlled from `App.tsx`.

---

# 12. Socket.IO Events

## Server → Client

### `online-users`

Payload:

```text
userIds[]
```

Used to maintain online user presence.

### `friend-presence-changed`

Payload:

```json
{
  "userId": "...",
  "status": "online | offline"
}
```

### `new-message`

Payload conceptually:

```json
{
  "message": {},
  "conversation": {},
  "unreadCounts": {}
}
```

Client actions:

- insert message
- update conversation preview
- update unread counts
- mark seen if active conversation
- join newly discovered conversation

### `read-message`

Updates:

- conversation
- lastMessage
- unreadCounts
- seenBy

### `friend-request-received`

Adds the request to received requests and refreshes request state.

### `friend-request-accepted`

Removes the request from the sender's pending list.

### `friend-request-declined`

Removes the request from the sender's pending list.

### `friend-account-deleted`

Replaces deleted user references in client conversations with a deleted-account representation.

### `new-group`

Adds the new group conversation and joins its Socket.IO room.

---

# 13. Socket Rooms

The server uses two important room concepts.

## User room

Every connected user joins:

```text
<userId>
```

Used for user-specific events.

## Conversation room

A socket joins every conversation the user belongs to.

A client may explicitly request:

```text
join-conversation
```

with a conversation ID.

### Important design decision

New messages are emitted to user-specific rooms rather than conversation rooms to avoid duplicate delivery when a socket belongs to both the user room and conversation room.

Preserve this behavior unless intentionally redesigning realtime delivery.

---

# 14. Presence System

Server maintains:

```js
onlineUsers = new Map()
```

Concept:

```text
userId -> socketId
```

On connect:

1. register user
2. broadcast online user IDs
3. join all conversation rooms
4. send initial visible friend presence
5. notify friends

On disconnect:

1. remove user from onlineUsers
2. broadcast online user IDs
3. notify friends of offline state

`showOnlineStatus` is respected when determining visible friend presence.

---

# 15. Backend Bootstrap

File:

`server/src/server.js`

Responsibilities:

- load environment variables
- initialize Express
- JSON parsing
- cookies
- CORS
- Cloudinary configuration
- Swagger UI
- public auth routes
- global protected middleware
- private routes
- DB connection
- HTTP server startup

REST routes are mounted under:

```text
/tetra
```

Swagger:

```text
/api-docs
```

---

# 16. Backend Route Architecture

Routes are thin.

Typical flow:

```text
Route
 ↓
Middleware
 ↓
Controller
 ↓
Model / Service / Helper
 ↓
Response
```

Do not put large business workflows directly in route definitions.

---

# 17. Authentication API

Base:

`/tetra/auth`

## POST `/register`

Creates a local account.

Requires:

- username
- password
- email
- firstName
- lastName

Password is hashed with bcrypt.

Email verification is required before normal local login.

## POST `/login`

Checks:

1. credentials exist
2. user exists
3. account is local
4. email is verified
5. password matches

Returns an access token and sets refresh-token cookie.

## POST `/google`

Accepts Google OAuth access token.

Backend verifies user information and creates/finds a social user.

## POST `/facebook`

Same concept for Facebook.

## POST `/logout`

Deletes the refresh-token session and clears the cookie.

## POST `/refresh`

Reads refresh token from HTTP-only cookie.

Checks:

- session exists
- session is not expired

Returns a new access token.

## POST `/forgot-password`

Creates a short-lived hashed reset token and sends a reset email.

Reset-token lifetime:

30 minutes.

## POST `/reset-password`

Validates reset token and changes the password.

## GET/POST `/verify-email`

Verifies the email using the hashed verification token.

Verification-token lifetime:

24 hours.

## POST `/resend-verification`

Generates and sends a new verification token.

---

# 18. Authentication Token Model

Access token:

- JWT
- payload contains `userId`
- TTL: 30 minutes

Refresh token:

- random 64-byte hex token
- stored in `Session`
- sent as HTTP-only cookie
- TTL: 14 days

Do not move the refresh token into normal frontend state.

---

# 19. Auth Middleware

File:

`server/src/middlewares/authMiddleware.js`

`protectedRoute`:

1. reads `Authorization`
2. expects `Bearer <token>`
3. verifies JWT
4. loads user from MongoDB
5. removes `hashedPassword`
6. attaches user to `req.user`

Protected route failures:

- missing token → 401
- expired token → 401
- invalid token → 401
- user missing → 404

All private REST routes are behind this middleware.

---

# 20. User Domain

Model:

`server/src/models/User.js`

Fields include:

- username
- hashedPassword
- authProvider
- email
- emailVerified
- emailVerificationToken
- emailVerificationExpires
- displayName
- avatarUrl
- avatarId
- bio
- phoneNumber
- showOnlineStatus
- passwordResetToken
- passwordResetExpires
- timestamps

Auth providers:

```text
local
google
facebook
```

Avatar files are stored externally through Cloudinary.

---

# 21. User Features

User controller supports:

- current-user profile
- profile updates
- avatar upload
- user search
- account deletion

Account deletion has cross-domain consequences.

When changing deletion behavior, inspect:

- userController
- User model
- Session
- Friend
- FriendRequest
- Conversation
- Message
- Socket.IO deletion notification
- client chat state

Do not implement deletion as a simple `User.deleteOne()` without considering references.

---

# 22. Friend System

Models:

- `Friend`
- `FriendRequest`

Friend relationship uses canonical ordering:

```text
userA < userB
```

This helps prevent duplicate friendship records.

Friend request flow:

```text
Search user
 ↓
Send request
 ↓
Socket notification
 ↓
Recipient accepts/declines
 ↓
Friend relationship created or request removed
 ↓
Sender receives realtime update
```

API:

```text
POST /tetra/friend/request
POST /tetra/friend/request/:requestId/accept
POST /tetra/friend/request/:requestId/decline
GET  /tetra/friend/get-all
GET  /tetra/friend/requests
```

---

# 23. Conversation Domain

Model:

`server/src/models/Conversation.js`

Conversation types:

```text
direct
group
```

Participants are embedded records:

```text
userId
joinedAt
```

Group metadata:

```text
name
createdBy
```

Conversation also tracks:

- lastMessageAt
- lastMessage
- seenBy
- unreadCounts
- timestamps

There is an index on:

```text
participants.userId + lastMessageAt
```

---

# 24. Direct Conversations

A direct conversation contains two participants.

When creating a direct conversation, the server attempts to find an existing direct conversation containing both users.

Do not blindly create duplicate direct conversations.

### Caveat for agents

The current query uses `$all` against participant IDs and should be reviewed carefully if a future change requires strict exact-two-participant semantics.

---

# 25. Group Conversations

A group conversation:

- includes creator
- includes selected member IDs
- stores group name
- stores creator ID

Creation broadcasts:

```text
new-group
```

to invited users through their user rooms.

---

# 26. Messaging

Message model:

```text
conversationId
senderId
content
imgUrl
createdAt
updatedAt
```

There is an index:

```text
conversationId + createdAt
```

Messages support:

- direct conversations
- group conversations
- text content
- image URL field

The current REST message controllers validate `content`, while the client service also carries an `imgUrl` field. Treat this as an area requiring care if implementing image-message support.

---

# 27. Message Creation Flow

For a new message:

```text
Client
 ↓
useChatStore.sendDirectMessage/sendGroupMessage
 ↓
ChatService
 ↓
POST /tetra/message/*
 ↓
messageController
 ↓
Message.create()
 ↓
updateConversationAfterCreateMessage()
 ↓
Conversation.save()
 ↓
emitNewMessage()
 ↓
Socket.IO user rooms
 ↓
all relevant clients
```

`messageHelper.js` is central to this behavior.

---

# 28. Conversation Update After Message

`server/src/utils/messageHelper.js`

When a message is created:

- clear `seenBy`
- update `lastMessageAt`
- update `lastMessage`
- increment unread count for non-senders
- set sender unread count to zero

Do not reimplement this logic in individual controllers.

---

# 29. Read / Seen Flow

Client:

```text
useChatStore.markAsSeen()
```

Server:

```text
PATCH /tetra/conversation/:conversationId/seen
```

Server:

1. loads conversation
2. checks whether there is a last message
3. avoids marking own message as seen
4. adds user to `seenBy`
5. sets user's unread count to zero
6. emits `read-message`

Client receives `read-message` and updates the conversation state.

---

# 30. Message Pagination

Backend:

```text
GET /tetra/conversation/:conversationId/messages
```

Parameters:

- `limit`
- `cursor`

Default client limit:

```text
50
```

Backend query:

```text
createdAt < cursor
```

Results are initially fetched descending, trimmed to the limit, then reversed before returning.

Do not casually replace cursor pagination with offset pagination.

---

# 31. REST API Reference

## Auth

```text
POST /tetra/auth/register
POST /tetra/auth/login
POST /tetra/auth/google
POST /tetra/auth/facebook
POST /tetra/auth/logout
POST /tetra/auth/refresh
POST /tetra/auth/forgot-password
POST /tetra/auth/reset-password
GET  /tetra/auth/verify-email
POST /tetra/auth/verify-email
POST /tetra/auth/resend-verification
```

## User

```text
GET    /tetra/user/me
PATCH  /tetra/user/me
POST   /tetra/user/uploadAvatar
DELETE /tetra/user/me
GET    /tetra/user/search?username=<username>
```

## Friend

```text
POST /tetra/friend/request
POST /tetra/friend/request/:requestId/accept
POST /tetra/friend/request/:requestId/decline
GET  /tetra/friend/get-all
GET  /tetra/friend/requests
```

## Message

```text
POST /tetra/message/direct
POST /tetra/message/group
```

## Conversation

```text
POST  /tetra/conversation
GET   /tetra/conversation
GET   /tetra/conversation/:conversationId/messages
PATCH /tetra/conversation/:conversationId/seen
```

Swagger is the backend API documentation source:

```text
server/src/swagger.json
```

---

# 32. Frontend UI Architecture

The UI is feature-oriented.

Chat-specific UI lives under:

`client/src/pages/chat-page/`

Important groups:

```text
chat-windows/
friends/
groups/
messages/
profile/
```

Examples:

- `chat-window-body.component.tsx`
- `chat-window-header.component.tsx`
- `message-input.component.tsx`
- `message-item.component.tsx`
- `friend-chat-card.component.tsx`
- `friend-chat-list.component.tsx`
- `new-group-chat-model.component.tsx`
- `profile-dialog.component.tsx`
- `avatar-uploader.component.tsx`

Keep chat-specific components close to the chat feature.

---

# 33. Shared UI

Reusable UI primitives are under:

`client/src/components/ui/`

There are also small Ant Design wrappers under:

`client/src/components/antd/`

Do not create a duplicate primitive if an existing component already provides the behavior.

Before adding a new button/dialog/input/etc., search `client/src/components/ui`.

---

# 34. Styling

The project uses:

- Tailwind CSS
- custom CSS in `client/src/index.css`
- shadcn-style component primitives
- Ant Design for selected controls
- class-variance-authority
- tailwind-merge

Follow the existing utility-class style.

Avoid introducing:

- CSS-in-JS
- a second design system
- arbitrary inline styles for reusable components

unless there is a strong reason.

---

# 35. Theme

Theme state is managed through:

`client/src/stores/use-theme-store.ts`

Theme state is applied from `App.tsx`.

There is also:

`client/src/components/ui/theme-toggle-float.tsx`

Preserve dark/light behavior when changing global CSS.

---

# 36. Forms

Use:

```text
React Hook Form
+
Zod
```

for complex forms.

Existing authentication pages use this pattern.

When adding a form:

1. define/extend the Zod schema in the appropriate shared location
2. use `zodResolver`
3. expose validation errors through the existing form UI
4. send only validated values to services

Do not duplicate server validation rules without necessity.

---

# 37. Error Handling

Frontend:

- Axios helper extracts API error messages
- Sonner provides user-facing toast feedback
- auth failures may redirect to login

Backend:

- controllers use try/catch
- errors are logged
- API normally returns `{ message: "..." }`

When introducing a new endpoint, keep error response shape consistent.

---

# 38. Environment Variables

Backend `.env` expected by the current README:

```env
PORT=3000
MONGODB_CONNECTIONSTRING=...
ACCESS_TOKEN_SECRET=...
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

SMTP_HOST=...
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=...
SMTP_PASS=...

EMAIL_VERIFY_PATH=/verify-email
PASSWORD_RESET_PATH=/reset-password
```

Frontend uses environment variables including:

```text
VITE_API_URL
VITE_SOCKET_URL
VITE_GOOGLE_CLIENT_ID
VITE_FACEBOOK_APP_ID
```

Never commit real secrets.

---

# 39. Deployment

Frontend contains:

`client/vercel.json`

The project is structured for frontend deployment separately from the backend.

When changing URLs/CORS/socket behavior, check:

- `VITE_API_URL`
- `VITE_SOCKET_URL`
- `CLIENT_URL`
- Socket.IO CORS
- cookie `secure`
- cookie `sameSite`

---

# 40. Important Current Implementation Inconsistencies / Caveats

These are observations from the current codebase. An AI agent should NOT silently "fix" them unless the task calls for it.

## 40.1 Socket CORS is hard-coded

`server/src/sockets/index.js` currently uses:

```js
origin: "http://localhost:5173"
```

while Express CORS uses:

```js
process.env.CLIENT_URL
```

If deployment support is requested, update Socket.IO CORS too.

## 40.2 README and code may drift

The README describes the intended feature set and API. The actual source code is the final authority for behavior.

When README and implementation disagree:

1. inspect the implementation
2. inspect Swagger
3. inspect frontend service usage
4. treat actual working code as source of truth
5. update documentation only when appropriate

## 40.3 Image-message fields are partially wired

The frontend chat service sends `imgUrl`, and the Message model contains `imgUrl`.

However, current message controllers validate only `content` and create messages without explicitly persisting `imgUrl`.

Do not claim full image-message support without verifying/fixing the complete path.

## 40.4 Social users still receive a hashed random password

`User.hashedPassword` is required even for social accounts. `createSocialUser()` generates a random password to satisfy the schema.

Do not treat the random password as a user-known credential.

## 40.5 Refresh-token storage

Refresh tokens are currently stored in `Session` as token strings.

If security hardening is requested, consider token hashing/rotation/reuse detection, but do not redesign this casually.

## 40.6 Direct-conversation lookup semantics

The direct-conversation lookup should be treated carefully if there can ever be conversations with more than two participants.

## 40.7 Account deletion has realtime side effects

There is a socket event:

```text
friend-account-deleted
```

The client responds by marking user references as deleted.

Any deletion feature must preserve this behavior.

---

# 41. Agent Coding Rules

## Rule A — Read before editing

Before modifying a feature, inspect:

- the relevant page/component
- its Zustand store
- its service
- its API endpoint constant
- its backend route
- its controller
- relevant model
- relevant socket event if realtime

## Rule B — Keep layers separated

Do not put database logic in controllers if it belongs in a reusable service/helper.

Do not put API calls directly in UI components when a domain service exists.

Do not put Socket.IO business logic directly inside presentation components.

## Rule C — Preserve existing state flow

If changing chat behavior, inspect:

```text
use-chat-store.ts
use-socket-store.ts
chat.service.ts
messageController.js
conversationController.js
messageHelper.js
```

## Rule D — Preserve authentication invariants

Any auth change must consider:

```text
use-auth-store.ts
axios.ts
auth.service.ts
authController.js
authService.js
authMiddleware.js
Session.js
```

## Rule E — Avoid duplicate realtime events

Understand the user-room and conversation-room model before emitting events.

## Rule F — Avoid unnecessary persistence

Do not put access tokens, refresh tokens, or sensitive transient state into persistent client storage.

## Rule G — Use existing design system

Reuse existing UI primitives and styling conventions.

## Rule H — Do not over-engineer

Do not introduce Redux, React Query, a new ORM, WebSocket abstraction, event bus, or dependency injection framework unless explicitly requested.

---

# 42. Preferred Change Workflow

For a new feature:

### Step 1 — Identify domain

Examples:

- authentication
- users
- friends
- conversations
- messages
- realtime
- profile
- UI

### Step 2 — Trace current flow

Example:

```text
UI
→ store
→ service
→ endpoint
→ route
→ middleware
→ controller
→ model
→ socket
→ client store
```

### Step 3 — Make the backend contract explicit

Define:

- request body
- params
- query
- response
- error messages
- auth requirements

### Step 4 — Implement backend

Prefer:

```text
route → middleware → controller → service/helper/model
```

### Step 5 — Implement frontend service

Add endpoint to `constants.ts` and service layer.

### Step 6 — Update Zustand state

Only if the feature needs global/shared state.

### Step 7 — Update UI

Use existing components and forms.

### Step 8 — Update realtime behavior

If the feature changes shared state across users, add/modify Socket.IO events.

### Step 9 — Verify

Run:

```bash
cd client
npm run lint
npm run build
```

and:

```bash
cd server
npm start
```

For development:

```bash
cd server
npm run dev
```

```bash
cd client
npm run dev
```

---

# 43. Testing Expectations

There is currently no meaningful automated backend test suite.

`server/package.json` still has:

```text
npm test
```

mapped to a placeholder failure command.

Therefore, an agent must not claim "tests pass" merely because `npm test` was invoked.

At minimum, for changes:

- run client lint
- run client build
- start backend if possible
- verify affected REST flow
- verify affected realtime flow
- inspect browser console/network behavior for frontend changes

For auth/realtime changes, manually test with at least two users where practical.

---

# 44. Manual Test Matrix

## Authentication

- register
- receive verification email
- verify email
- login
- refresh page
- access protected route
- logout
- login with Google
- login with Facebook
- forgot password
- reset password
- resend verification

## Friends

- search user
- send request
- receive realtime request
- accept request
- decline request
- list friends
- list pending requests

## Chat

- create direct conversation
- send direct message
- receive realtime direct message
- unread count
- mark as seen
- load older messages
- create group
- receive new group
- send group message
- receive group message

## Presence

- connect two users
- online state
- offline state
- hidden online status

## Profile

- update profile
- upload avatar
- change privacy setting
- delete account

---

# 45. Common Files to Inspect First

## If task mentions login/auth/token

Inspect:

```text
client/src/stores/use-auth-store.ts
client/src/lib/axios.ts
client/src/utils/services/auth.service.ts
client/src/utils/constants.ts
client/src/routes/protected-route.tsx
server/src/controllers/authController.js
server/src/services/authService.js
server/src/middlewares/authMiddleware.js
server/src/models/Session.js
server/src/models/User.js
```

## If task mentions messages

Inspect:

```text
client/src/stores/use-chat-store.ts
client/src/stores/use-socket-store.ts
client/src/utils/services/chat.service.ts
client/src/types/chat.ts
client/src/pages/chat-page/components/messages/
server/src/controllers/messageController.js
server/src/controllers/conversationController.js
server/src/utils/messageHelper.js
server/src/models/Message.js
server/src/models/Conversation.js
server/src/sockets/index.js
```

## If task mentions friends

Inspect:

```text
client/src/stores/use-friend-store.ts
client/src/utils/services/friend.service.ts
client/src/pages/chat-page/components/friends/
client/src/stores/use-socket-store.ts
server/src/controllers/friendController.js
server/src/middlewares/friendMiddleware.js
server/src/models/Friend.js
server/src/models/FriendRequest.js
server/src/sockets/index.js
```

## If task mentions profile

Inspect:

```text
client/src/stores/use-user-store.ts
client/src/pages/chat-page/components/profile/
client/src/utils/services/user.service.ts
server/src/controllers/userController.js
server/src/middlewares/uploadMiddleware.js
server/src/models/User.js
```

---

# 46. Naming Conventions

Frontend:

- React components: `*.component.tsx`
- pages: `*.page.tsx`
- stores: `use-*-store.ts`
- services: `*.service.ts`
- hooks: `use-*.ts` / `*.hook.ts`
- types: descriptive domain files

Backend:

- controllers: `*Controller.js`
- routes: `*Route.js`
- models: PascalCase
- services: `*Service.js`
- middlewares: `*Middleware.js`

Follow existing naming instead of mixing conventions.

---

# 47. TypeScript Rules

Prefer:

- explicit domain types
- existing types from `client/src/types`
- no `any` unless unavoidable
- type-safe service return values
- type-safe Zustand state

When adding a field to a server response:

1. update backend response
2. update frontend type
3. update service return type if needed
4. update store logic
5. update UI consumers

Do not solve a type mismatch with `as any`.

---

# 48. Database Rules

MongoDB/Mongoose is the source of truth for persistent application data.

When changing a schema:

- inspect all controllers using the model
- inspect all populate calls
- inspect frontend types
- inspect Socket.IO payloads
- inspect Swagger
- consider indexes

Do not casually rename MongoDB fields because frontend and socket payloads depend on exact names.

---

# 49. API Contract Rules

Keep response objects predictable.

Existing conventions commonly use:

```json
{
  "message": "..."
}
```

or:

```json
{
  "accessToken": "..."
}
```

or:

```json
{
  "conversations": []
}
```

or:

```json
{
  "messages": [],
  "nextCursor": null
}
```

Do not unnecessarily wrap or rename existing response fields.

---

# 50. Realtime Contract Rules

Socket event names are API contracts.

Treat these as stable:

```text
online-users
friend-presence-changed
new-message
read-message
friend-request-received
friend-request-accepted
friend-request-declined
friend-account-deleted
new-group
join-conversation
```

If renaming an event, update both client and server in the same change.

---

# 51. Security Rules

Never:

- commit `.env`
- expose access-token secrets
- expose SMTP credentials
- expose Cloudinary API secrets
- log passwords
- log refresh tokens
- put refresh tokens in localStorage
- return `hashedPassword` from protected user queries

For security-sensitive changes, preserve:

- HTTP-only refresh cookie
- JWT validation
- bcrypt password hashing
- hashed email verification tokens
- hashed password-reset tokens
- auth-provider checks

---

# 52. Performance Rules

Existing performance-related choices include:

- lazy-loaded pages
- MongoDB indexes
- cursor pagination
- throttled chat persistence
- promise de-duplication
- Socket.IO user-specific events
- selective Mongoose population

Preserve these unless a change intentionally improves them.

---

# 53. UI/UX Rules

The product has a modern chat-app visual style.

Preserve:

- responsive layouts
- dark/light theme
- loading states
- skeletons/spinners
- toast feedback
- empty states
- disabled/loading form controls
- realtime updates without full-page reloads

When adding UI, make it consistent with existing shadcn/Tailwind components.

---

# 54. Documentation Rules

Important documentation:

```text
README.md
server/src/swagger.json
client/README.md
```

When adding or changing a public API, update Swagger if appropriate.

When changing setup/env requirements, update README.

Do not invent endpoints that are not implemented.

---

# 55. Git / Change Scope Rules

Prefer focused commits.

Good examples:

```text
feat(chat): add message reactions
fix(auth): prevent duplicate refresh requests
fix(socket): respect configured client origin
refactor(friend): simplify request lookup
```

Avoid mixing:

- unrelated formatting
- dependency upgrades
- architecture changes
- feature work

in the same change.

---

# 56. AI Agent Response Expectations

When asked to implement a feature, the agent should report:

1. what it changed
2. files changed
3. API/socket contract changes
4. validation performed
5. remaining known caveats

If unable to run a test, state that explicitly.

Do not say "fully tested" when only static inspection was performed.

---

# 57. Source-of-Truth Priority

When information conflicts, use this priority:

```text
1. Current source code
2. Current API/Swagger definitions
3. Frontend service usage
4. README
5. Historical assumptions
```

Never rely on an old README description if the actual implementation has changed.

---

# 58. Final Agent Checklist

Before completing a non-trivial change:

- [ ] Did I inspect the relevant frontend component/page?
- [ ] Did I inspect the Zustand store?
- [ ] Did I inspect the service?
- [ ] Did I inspect endpoint constants?
- [ ] Did I inspect the backend route?
- [ ] Did I inspect middleware?
- [ ] Did I inspect the controller?
- [ ] Did I inspect the model?
- [ ] Did I inspect relevant Socket.IO events?
- [ ] Did I preserve auth/refresh behavior?
- [ ] Did I preserve existing response field names?
- [ ] Did I preserve realtime deduplication?
- [ ] Did I avoid unnecessary new dependencies?
- [ ] Did I avoid secrets?
- [ ] Did I run lint/build where possible?
- [ ] Did I update Swagger/docs when the API changed?
- [ ] Did I clearly report remaining caveats?

---

# 59. Recommended Agent Mental Model

Think of Tetra as five connected systems:

```text
┌───────────────────────────────┐
│        React / Tailwind       │
│ Pages + Components + Forms    │
└──────────────┬────────────────┘
               │
               ▼
┌───────────────────────────────┐
│       Zustand State Layer     │
│ Auth + Chat + Friend + Socket │
└──────────────┬────────────────┘
               │
          REST │ Socket.IO
               ▼
┌───────────────────────────────┐
│        Express Backend        │
│ Routes + Middleware + Ctrl    │
└──────────────┬────────────────┘
               │
               ▼
┌───────────────────────────────┐
│        MongoDB / Mongoose     │
│ Users + Sessions + Friends    │
│ Conversations + Messages     │
└───────────────────────────────┘

External services:
- Google OAuth
- Facebook OAuth
- Cloudinary
- SMTP / email provider
```

For every feature, determine which of these systems it touches.

---

# 60. One-Line Project Context

**Tetra is a React/TypeScript + Vite real-time messaging SPA backed by Express/Mongoose/MongoDB, using Zustand for client state, JWT access tokens + HTTP-only refresh-token sessions for authentication, Socket.IO for realtime messaging/presence/friend events, and external integrations for OAuth, Cloudinary, and email.**
