# 🎭 ShadowPlay AI

A browser-based hand shadow puppet game. Make hand gestures in front of your webcam and AI recognizes them, casting an animated shadow on a virtual wall. Includes free-play mode, a timed challenge mode with scoring, a gesture gallery, and a global leaderboard.

**Privacy first:** all hand tracking (MediaPipe Hands) runs entirely in your browser. No video frames are ever sent to a server.

---

## 🧩 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite, react-webcam, Canvas API |
| AI Inference | MediaPipe Hands (`@mediapipe/hands` + `@mediapipe/camera_utils`) |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |

---

## 📁 Project Structure

```
shadowplay-ai/
├── frontend/
│   ├── src/
│   │   ├── components/    # WebcamFeed, ShadowCanvas, ChallengeMode, Gallery, Leaderboard
│   │   ├── hooks/          # useMediaPipe
│   │   ├── utils/          # gestureClassifier, shadowDrawers, sounds, api
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── backend/
│   ├── models/             # User, Session, Attempt (Mongoose schemas)
│   ├── routes/             # challenge.js, leaderboard.js
│   ├── controllers/
│   ├── server.js
│   └── package.json
└── README.md
```

---

## 🚀 Setup & Run

### 1. Prerequisites
- Node.js 18+
- A MongoDB database (use [MongoDB Atlas](https://www.mongodb.com/atlas) free tier, or run MongoDB locally / via Docker)
- A webcam

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/shadowplay?retryWrites=true&w=majority
PORT=5000
FRONTEND_URL=http://localhost:5173
```

> To run MongoDB locally with Docker instead:
> ```bash
> docker run -d -p 27017:27017 --name shadowplay-mongo mongo:7
> ```
> Then set `MONGODB_URI=mongodb://localhost:27017/shadowplay`

Start the backend:
```bash
npm run dev   # or: npm start
```
Server runs at `http://localhost:5000`. Verify with: `http://localhost:5000/api/health`

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `.env`:
```
VITE_API_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```
App runs at `http://localhost:5173`.

### 4. Play!
1. Open `http://localhost:5173` in Chrome/Firefox/Safari.
2. Allow camera permission when prompted.
3. Wait for the "Loading AI..." progress bar to finish (loads MediaPipe Hands model from CDN).
4. Make a hand gesture — Rabbit 🐇, Dog 🐕, Bird 🕊️, Butterfly 🦋, or Snake 🐍 — and watch the shadow appear.
5. Click **🏆 Start Challenge** for timed scoring rounds.
6. Click **📖 Learn** for the gesture gallery, **🏆 Scores** for the leaderboard.

---

## 🖐 Gesture Guide

| Gesture | How to make it |
|---|---|
| 🐇 Rabbit | Index + middle fingers up & spread apart (ears), rest folded |
| 🐕 Dog | Thumb + pinky extended, other three fingers folded |
| 🕊️ Bird | All five fingers spread wide open |
| 🦋 Butterfly | Four fingers extended together, thumb tucked in |
| 🐍 Snake | Index + middle fingers extended and pressed together, rest folded |

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/challenge/start` | Create a new challenge session, returns `sessionId` |
| POST | `/api/challenge/attempt` | Submit `{ sessionId, gesturePrompt, userGesture, isCorrect }` |
| POST | `/api/challenge/save-score` | Save final score `{ guestId, score }` |
| GET | `/api/leaderboard?limit=10` | Top guests by total score |
| GET | `/api/user/:guestId/stats` | A user's score history |
| GET | `/api/health` | Backend + DB health check |

If the backend is unreachable, the frontend automatically falls back to `localStorage` for scores and leaderboard so the game remains playable offline.

---

## 🌐 Browser APIs Used

- **MediaPipe Hands** — on-device hand landmark tracking (21 points)
- **WebRTC** (via `react-webcam`) — camera access
- **Canvas API** — shadow rendering
- **Web Audio API** — procedural sound effects (no audio files needed)
- **Web Speech API** — optional voice announcements of recognized gestures

---

## 🛠 Deployment Notes

- **Frontend** → Vercel: set `VITE_API_URL` to your deployed backend URL in project env vars.
- **Backend** → Render / Railway: set `MONGODB_URI` and `FRONTEND_URL` (your deployed frontend URL) as env vars.

---

## ⚠️ Troubleshooting

- **"Loading AI..." stuck** — MediaPipe loads from a CDN; check your internet connection.
- **Camera permission denied** — re-enable camera access in browser site settings and refresh.
- **Gestures not recognized** — ensure good lighting, plain background, hand 30–60cm from camera. See the in-app Gallery for finger-position diagrams.
- **Leaderboard empty** — play Challenge Mode at least once; if MongoDB isn't connected, scores save to `localStorage` only (per-browser).
