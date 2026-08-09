# PulseChat — Real-Time Chat Application

PulseChat is a responsive chat app built with a React frontend, Node.js + Express backend, Socket.io for live messaging, and SQLite for message persistence.

## ✅ Submission Targets
- GitHub repository with full source
- Deployed frontend and backend
- 1–2 minute screen recording demoing the live app
- README with setup, features, and deployment notes

## Demo
- Frontend: _Add live frontend URL here_
- Backend health: _Add backend health URL here_

## Tech Stack
- Frontend: React, Vite, Socket.io client
- Backend: Node.js, Express, Socket.io server, SQLite (`better-sqlite3`)
- Styling: Plain CSS
- Runtime: Node 18+

## Features
- Username-based login
- Real-time messaging with Socket.io
- Persistent message history stored in SQLite
- Active user presence list
- Typing indicator
- Backend health endpoint: `/api/health`

## Project Structure
- `backend/` — Express + Socket.io server, SQLite persistence, API routes
- `frontend/` — React client, message composer, and chat UI
- `frontend/.env.example` — frontend environment example
- `backend/.env.example` — backend environment example

## Local Setup
### 1. Clone the repository
```bash
git clone <repo-url>
cd realtime-chat-app
```

### 2. Backend setup
```bash
cd backend
npm install
cp .env.example .env
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

### 3. Frontend setup
```bash
cd ../frontend
npm install
cp .env.example .env
npm run dev
```
Open `http://localhost:5173`

## Deployment Recommendation
### Backend
Recommended hosts:
- Render: Node web service
- Railway: Node app
- Fly.io: Node app

Backend environment variables:
- `PORT`
- `CLIENT_URL`
- `DB_FILE`

### Frontend
Recommended hosts:
- Vercel
- Netlify

Frontend build command:
- `npm run build`
Publish `dist/` from Vite.

### Vercel Frontend Deployment
A `frontend/vercel.json` file is included for deploying the frontend from the `frontend/` folder.

1. Import the repository into Vercel.
2. Select the `frontend` folder as the project root for the frontend deployment.
3. Use the default build command:
   ```bash
   npm install && npm run build
   ```
4. Set the environment variables in Vercel:
   - `VITE_API_URL` → backend URL
   - `VITE_SOCKET_URL` → backend URL

Because the app is structured as a monorepo, Vercel will build the React app from `frontend/package.json` and publish the generated `dist/` folder.

### Backend Deployment Note
The backend uses Socket.io for live WebSocket messaging. Vercel serverless functions do not support long-lived Socket.io connections, so the backend should be deployed to a WebSocket-friendly host such as Render, Railway, or Fly.io.

If you want to keep both apps on one platform, use Vercel for the frontend and Render/Railway for the backend.

## Screen Recording Checklist
Capture a 1–2 minute video that includes:
1. Opening the deployed frontend URL
2. Entering a username and joining chat
3. Sending a message and seeing it appear instantly
4. Showing another connected user or the presence list
5. Verifying the backend health endpoint if available

## Notes
- The backend creates `./data/chat.db` on first run.
- The app uses a single shared chat room.
- Usernames persist in browser `localStorage`.

## Contact
If you'd like, I can help add deployment configuration for Render/Vercel or create a lightweight CI/deploy guide.
