<div align="center">

<img src="frontend/public/logo.png" alt="Messenger Logo" width="100" />

# 💬 Messenger — AI-Powered Chat App

A full-stack real-time messaging application with **AI-powered reply suggestions**, **auto-reply**, **image sharing**, and **live online presence** — built with React, Node.js, Socket.IO, and MongoDB.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?style=flat&logo=nodedotjs)](https://nodejs.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-010101?style=flat&logo=socketdotio)](https://socket.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_9-47A248?style=flat&logo=mongodb)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

</div>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Screenshots](#-screenshots)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
- [API Endpoints](#-api-endpoints)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 About the Project

**Messenger** is a modern, full-stack real-time chat application that goes beyond basic messaging. It integrates an AI model (Groq's LLaMA 3) to suggest contextual replies based on your conversation, and features auto-reply for when you're offline — all wrapped in a sleek dark UI with ambient glow effects.

The app is production-ready: JWT authentication, Arcjet security middleware (bot detection, rate limiting, shield protection), Cloudinary image uploads, welcome emails via Resend, and an optimistic UI for a snappy messaging experience.

---

## 📸 Screenshots

| Login Page | Sign Up Page |
|---|---|
| ![Login](frontend/public/login.png) | ![Signup](frontend/public/signup.png) |

| Chat Interface |
|---|
| ![Chat](frontend/public/background.png) |

---

## ✨ Features

### 💬 Real-Time Messaging
- Instant message delivery using **Socket.IO** WebSockets
- Online/offline presence indicators shown live across all connected clients
- Optimistic UI — messages appear instantly before server confirmation

### 🤖 AI-Powered Reply Suggestions
- Click the **✨ Suggest reply** button in any conversation
- The app sends the last 20 messages as a transcript to the Groq LLaMA 3.1 model
- Receive 3 short, context-aware reply suggestions as clickable chips
- Select a suggestion to auto-fill the message input for quick editing and sending

### 🔁 Auto-Reply
- Enable an away message from the **Bot** icon in the chat header
- When you're offline, anyone who messages you receives your custom auto-reply automatically
- Fully customizable message (up to 300 characters) with a toggle on/off switch

### 📷 Image Sharing
- Share images directly in chat — uploaded and stored via **Cloudinary**
- Image preview before sending with the ability to remove the selection

### 👤 User Profiles
- Upload and update your profile picture (stored on Cloudinary)
- View the profile picture and online status of your chat partner in the header

### 🔐 Authentication
- Secure signup and login with **JWT** (stored in HTTP-only cookies)
- Password hashing with **bcrypt**
- Welcome email sent on signup via **Resend**

### 🎵 Keyboard Sound Effects
- Toggleable keystroke sound effects while typing (4 randomized sounds)
- Notification sound for incoming messages

### 🛡️ Security
- **Arcjet** middleware: shield (SQL injection / XSS protection), bot detection, and sliding window rate limiting (100 req/min)
- All Socket.IO connections authenticated via JWT middleware

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| [React 19](https://react.dev/) | UI library |
| [Vite 8](https://vite.dev/) | Build tool & dev server |
| [React Router 7](https://reactrouter.com/) | Client-side routing |
| [Zustand 5](https://zustand-demo.pmnd.rs/) | Global state management |
| [Socket.IO Client 4](https://socket.io/) | Real-time WebSocket communication |
| [Axios](https://axios-http.com/) | HTTP requests |
| [TailwindCSS 3](https://tailwindcss.com/) | Utility-first CSS |
| [DaisyUI 5](https://daisyui.com/) | Tailwind component library |
| [Lucide React](https://lucide.dev/) | Icon library |
| [React Hot Toast](https://react-hot-toast.com/) | Toast notifications |

### Backend
| Technology | Purpose |
|---|---|
| [Node.js](https://nodejs.org/) + [Express 5](https://expressjs.com/) | REST API server |
| [Socket.IO 4](https://socket.io/) | WebSocket server |
| [MongoDB](https://www.mongodb.com/) + [Mongoose 9](https://mongoosejs.com/) | Database & ODM |
| [JWT](https://jwt.io/) + [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | Auth & password hashing |
| [Cloudinary](https://cloudinary.com/) | Image upload & storage |
| [Resend](https://resend.com/) | Transactional emails |
| [Arcjet](https://arcjet.com/) | Security middleware |
| [Groq API](https://groq.com/) (LLaMA 3.1 8B) | AI reply suggestions |

---

## 📁 Project Structure

```
Ai-powered-chat-app/
├── backend/
│   └── src/
│       ├── controllers/
│       │   ├── auth.controller.js        # Signup, login, logout, profile update, auto-reply
│       │   ├── message.controller.js     # Send/get messages, contacts, chat partners, auto-reply trigger
│       │   └── Suggestion.controller.js  # AI reply suggestions via Groq API
│       ├── emails/
│       │   ├── emailHandlers.js          # Email sending logic
│       │   └── emailTemplates.js         # Welcome email HTML template
│       ├── lib/
│       │   ├── arcjet.js                 # Security middleware config
│       │   ├── cloudinary.js             # Cloudinary client
│       │   ├── db.js                     # MongoDB connection
│       │   ├── env.js                    # Typed env variable access
│       │   ├── resend.js                 # Resend email client
│       │   ├── socket.js                 # Socket.IO server + online user map
│       │   └── utils.js                  # JWT token generator
│       ├── middleware/
│       │   ├── arcjet.middleware.js      # Arcjet security gate
│       │   ├── auth.middleware.js        # JWT verification for REST routes
│       │   └── socket.auth.middleware.js # JWT verification for Socket.IO
│       ├── models/
│       │   ├── User.js                   # User schema (incl. autoReply field)
│       │   └── Message.js                # Message schema (text + image)
│       ├── routes/
│       │   ├── auth.routes.js            # /api/auth/*
│       │   └── message.routes.js         # /api/messages/*
│       └── server.js                     # Express app entry point
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── AutoReplySettings.jsx     # Auto-reply toggle & message editor
│       │   ├── ChatContainer.jsx         # Main chat view
│       │   ├── ChatHeader.jsx            # Chat header with user info & actions
│       │   ├── MessageInput.jsx          # Text/image input with sound effects
│       │   ├── Messagebubble.jsx         # Individual message bubble
│       │   ├── ReplySuggestions.jsx      # AI suggestion chips + sparkle button
│       │   └── ...                       # Other UI components
│       ├── hooks/
│       │   └── useKeyboardSound.js       # Randomized keystroke audio hook
│       ├── pages/
│       │   ├── ChatPage.jsx              # Main chat layout
│       │   ├── LoginPage.jsx             # Login form
│       │   └── SignUpPage.jsx            # Registration form
│       ├── store/
│       │   ├── useAuthStore.jsx          # Auth state + socket management
│       │   └── useChatStore.jsx          # Chat/messages/suggestions state
│       └── App.jsx                       # Routes + global layout
└── package.json                          # Root scripts for build & start
```

---

## 🏁 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) v9 or higher
- A [MongoDB](https://www.mongodb.com/) database (local or [Atlas](https://www.mongodb.com/atlas))

You will also need accounts and API keys for:

| Service | Purpose | Link |
|---|---|---|
| MongoDB Atlas | Database | [mongodb.com](https://www.mongodb.com/atlas) |
| Cloudinary | Image storage | [cloudinary.com](https://cloudinary.com/) |
| Resend | Welcome emails | [resend.com](https://resend.com/) |
| Arcjet | Security | [arcjet.com](https://arcjet.com/) |
| Groq | AI suggestions | [console.groq.com](https://console.groq.com/) |

---

### Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/messenger

# Auth
JWT_SECRET=your_super_secret_jwt_key

# Client (for CORS + email links)
CLIENT_URL=http://localhost:5173

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Resend (email)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=Messenger

# Arcjet (security)
ARCJET_KEY=ajkey_xxxxxxxxxxxxxxxxxxxx
ARCJET_ENV=development

# Groq (AI suggestions)
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx
```

> **Note:** Never commit your `.env` file. It is already listed in `.gitignore`.

---

### Installation

Clone the repository and install dependencies for both the frontend and backend:

```bash
# Clone the repo
git clone https://github.com/PramodNimare111/chat-app.git
cd chat-app

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

### Running the App

**Development mode** (run both servers separately):

```bash
# Terminal 1 — start the backend (with nodemon auto-reload)
cd backend
npm run dev

# Terminal 2 — start the frontend (Vite dev server)
cd frontend
npm run dev
```

The app will be available at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`

**Production build:**

```bash
# From the root directory — installs deps and builds the frontend
npm run build

# Start the backend server (which also serves the built frontend)
npm start
```

---

## 📡 API Endpoints

### Auth — `/api/auth`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/signup` | Register a new user + send welcome email | ❌ |
| `POST` | `/login` | Login and receive JWT cookie | ❌ |
| `POST` | `/logout` | Clear JWT cookie | ✅ |
| `GET` | `/check` | Verify current session | ✅ |
| `PUT` | `/update-profile` | Update profile picture | ✅ |
| `PUT` | `/update-auto-reply` | Toggle / update auto-reply message | ✅ |

### Messages — `/api/messages`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/contacts` | Get all users except self | ✅ |
| `GET` | `/chats` | Get users you have chatted with | ✅ |
| `GET` | `/:id` | Get message history with a user | ✅ |
| `POST` | `/send/:id` | Send a message (text or image) | ✅ |
| `POST` | `/reply-suggestions` | Get 3 AI reply suggestions | ✅ |

---

## 🔒 Security

This app uses [Arcjet](https://arcjet.com/) to protect all API routes with three layers:

- **Shield** — detects and blocks common web attacks (SQL injection, XSS, etc.)
- **Bot detection** — blocks automated bots while allowing search engine crawlers
- **Sliding window rate limiter** — limits each IP to 100 requests per 60 seconds

Both REST API routes and Socket.IO connections require a valid JWT. Tokens are stored in HTTP-only cookies (not accessible from JavaScript) to prevent XSS token theft.

---

## 🤝 Contributing

Contributions are welcome! To get started:

1. Fork the repository
2. Create a feature branch: `git switch -c feature/your-feature-name`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a Pull Request on GitHub

Please make sure your code follows the existing style and that the app runs without errors before submitting.

---

## 📄 License

This project is licensed under the **ISC License**. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with ❤️ by [Pramod Nimare](https://github.com/PramodNimare111)

⭐ If you found this project useful, give it a star!

</div>
