# PulseChat 💬

### Connect. Chat. Instantly.

PulseChat is a realtime group chat application with a React/Vite frontend and a Node/Express/Socket.io backend. Messages are persisted in SQLite so chat history survives restarts.

## Live Demo
- Frontend: https://frontend-vert-phi-55.vercel.app
- Backend health: https://pulsechat-backend-production-23f3.up.railway.app/api/health

## Demo Video
[▶ Click here to watch the Demo Video](./Pulsechat%20Working.mp4)

## Overview
PulseChat lets users enter a username, join a shared chat room, and send realtime messages. The frontend connects to a Socket.io backend for live updates and also uses a REST API to fetch chat history.

## Tech Stack
- Frontend: React, Vite, Socket.io client
- Backend: Node.js, Express, Socket.io server
- Database: SQLite via `better-sqlite3`
- Styling: CSS
- Deployment:
  - Frontend: Vercel
  - Backend: Railway

## Key Features
- Username-based chat entry
- Realtime messaging with Socket.io
- Persistent chat history in SQLite
- Active user presence updates
- Typing indicator
- Backend health endpoint: `/api/health`

## Project Structure
- `backend/` — Express API, Socket.io server, SQLite persistence
- `frontend/` — React chat UI, Socket.io client, Vite build config
- `backend/.env.example` — sample backend environment variables
- `frontend/.env.example` — sample frontend environment variables

## Getting Started
These instructions cover local setup and running the full app on your machine.

### Prerequisites
- Node.js 18 or later
- npm
- Git

### Clone the repository
```bash
git clone https://github.com/iam-abhay/pulsechat-realtime-chat.git
cd pulsechat-realtime-chat
```

### Backend setup
```bash
cd backend
npm install
```
Copy the environment file:
- Windows PowerShell: `copy .env.example .env`
- macOS/Linux: `cp .env.example .env`

Update `backend/.env` if needed:
```env
PORT=5000
CLIENT_URL=http://localhost:5173
DB_FILE=./data/chat.db
```
Start the backend:
```bash
npm run dev
```

### Frontend setup
```bash
cd ../frontend
npm install
```
Copy the environment file:
- Windows PowerShell: `copy .env.example .env`
- macOS/Linux: `cp .env.example .env`

Start the frontend:
```bash
npm run dev
```
Open the app at:
```text
http://localhost:5173
```

### Full workflow
1. Start the backend.
2. Start the frontend.
3. Open `http://localhost:5173`.
4. Enter a username and join the chat.
5. Send messages and confirm realtime updates.

## Deployment
### Frontend deployment
The frontend is deployed to Vercel from the `frontend/` folder.

Recommended hosting options:
- Vercel
- Netlify

Build command:
```bash
npm run build
```
Publish the generated `dist/` folder.

### Backend deployment
The backend is deployed on Railway with support for long-lived WebSocket connections.

Recommended hosting options:
- Railway
- Fly.io

Required backend environment variables:
- `PORT`
- `CLIENT_URL`
- `DB_FILE`

### Socket.io deployment note
Socket.io needs a WebSocket-friendly host. Vercel serverless functions do not support long-lived WebSocket connections, so the backend should be deployed to Railway, Fly.io, or a similar service.

## Production URLs
- Frontend: https://frontend-vert-phi-55.vercel.app
- Backend: https://pulsechat-backend-production-23f3.up.railway.app
- Health: https://pulsechat-backend-production-23f3.up.railway.app/api/health

## API Endpoints
- `GET /api/health` — health check
- `GET /api/messages` — fetch chat history
- `POST /api/messages` — not used by frontend, Socket.io handles live messaging

## Environment Variables
### Backend
- `PORT` — port for the backend server
- `CLIENT_URL` — allowed frontend origin for CORS
- `DB_FILE` — SQLite database file path

### Frontend
- `VITE_API_URL` — backend REST API base URL
- `VITE_SOCKET_URL` — backend Socket.io URL

## Database
The backend uses SQLite and stores data under `backend/data/`. The file is created automatically on first run.

## Troubleshooting
- If the frontend cannot connect, verify `VITE_SOCKET_URL` points to the running backend.
- If the backend fails to start, confirm `PORT`, `CLIENT_URL`, and `DB_FILE` are set in `backend/.env`.
- For CORS issues, make sure `CLIENT_URL` includes the frontend host exactly.

## Video Demo Checklist
Use this checklist for the submission video:
1. Opening the deployed frontend URL
2. Entering a username and joining the chat
3. Sending a message and seeing it appear instantly
4. Showing the connected user list or typing indicator
5. Verifying the backend health endpoint

## Notes
- The backend creates `./data/chat.db` automatically on first run.
- The app uses a shared global chat room.
- Usernames persist in browser `localStorage`.

## Contributing
Contributions are welcome. Open an issue or submit a pull request for fixes and improvements.

## License
This project is provided without a formal license.
