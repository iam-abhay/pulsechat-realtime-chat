# PulseChat 💬

### Connect. Chat. Instantly.

PulseChat is a realtime group chat app built with React, Vite, Node.js, Express, Socket.io, and SQLite.

## Live Demo
- Frontend: https://frontend-l808y80tg-iam-abhays-projects.vercel.app
- Backend health: https://pulsechat-backend-production-23f3.up.railway.app/api/health

## Tech Stack
- Frontend: React, Vite, Socket.io client
- Backend: Node.js, Express, Socket.io server
- Database: SQLite via `better-sqlite3`
- Styling: CSS
- Runtime: Node.js 18+

## Key Features
- Username-based chat entry
- Realtime messaging with Socket.io
- Persistent chat history stored in SQLite
- Active user presence list
- Typing indicator
- Backend health endpoint: `/api/health`

## Project Structure
- `backend/` — Express + Socket.io server, API routes, database persistence
- `frontend/` — React chat UI, Socket.io client, Vite build config
- `backend/.env.example` — backend environment sample
- `frontend/.env.example` — frontend environment sample

## Local Development
### 1. Clone the repository
```bash
git clone https://github.com/iam-abhay/pulsechat-realtime-chat.git
cd pulsechat-realtime-chat
```

### 2. Start the backend
```bash
cd backend
npm install
copy .env.example .env
```
Update `backend/.env` if necessary:
```env
PORT=5000
CLIENT_URL=http://localhost:5173
DB_FILE=./data/chat.db
```
Start the backend:
```bash
npm run dev
```

### 3. Start the frontend
```bash
cd ../frontend
npm install
copy .env.example .env
npm run dev
```
Open `http://localhost:5173`

## Deployment
### Frontend
The frontend is deployed on Vercel.

Recommended hosts:
- Vercel
- Netlify

Vite build command:
```bash
npm run build
```
Publish the generated `dist/` folder.

### Backend
The backend is deployed on Railway with a WebSocket-friendly runtime.

Recommended hosts:
- Railway
- Render
- Fly.io

Backend environment variables:
- `PORT`
- `CLIENT_URL`
- `DB_FILE`

### Vercel + Socket.io Note
The backend uses Socket.io for realtime WebSocket messaging. Vercel serverless functions do not support long-lived Socket.io connections, so the backend must be hosted on a WebSocket-capable platform such as Railway, Render, or Fly.io.

## Production URLs
- Frontend: https://frontend-l808y80tg-iam-abhays-projects.vercel.app
- Backend: https://pulsechat-backend-production-23f3.up.railway.app
- Health: https://pulsechat-backend-production-23f3.up.railway.app/api/health

## Video Demo Checklist
Capture a short walkthrough showing:
1. Opening the deployed frontend URL
2. Entering a username and joining the chat
3. Sending a message and seeing it appear instantly
4. Showing the connected users list or typing indicator
5. Verifying the backend health endpoint

## Notes
- The backend creates `./data/chat.db` automatically on first run.
- The app uses a shared global chat room.
- Usernames are persisted in browser `localStorage`.

## Need help?
I can also add deployment config or a lightweight CI/CD guide if needed.
