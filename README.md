# ShadowPlay

A browser-based hand shadow puppet studio. Position your hands in front of your webcam to cast real-time silhouettes recognized by client-side computer vision. Includes free practice mode, adversarial shadow quest challenges, speedrun time attack, reference library, and global leaderboards.

**Privacy-first architecture:** Hand tracking runs entirely in the browser using MediaPipe Hands via WebAssembly/WebGL. Zero camera frames, video feeds, or biometric templates are stored or transmitted to external servers.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Canvas API, Web Audio API, Web Speech API |
| Computer Vision | MediaPipe Hands (21 3D landmarks) |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Legal / Compliance | Digital Personal Data Protection Act 2023 (DPDP, India), GDPR, CCPA |

---

## Project Structure

```
shadowplay/
├── frontend/
│   ├── public/             # sitemap.xml, robots.txt, llms.txt, favicon.svg, og-image.svg
│   ├── src/
│   │   ├── components/     # ShadowCanvas, WebcamFeed, BattlePanel, SpeedrunPanel, Gallery,
│   │   │                   # Header, Sidebar, Icons, PrivacyPolicy, TermsAndConditions,
│   │   │                   # CookiePolicy, CookieBanner, NotFound
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

## Setup & Local Development

### 1. Prerequisites
- Node.js 18+
- MongoDB instance (Atlas or local)
- Web browser with webcam access

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Configure `.env`:
```env
PORT=5000
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/shadowplay
```

Start the backend:
```bash
npm run dev
```

Verify backend health at: `http://localhost:5000/api/health`

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
```

Configure `.env`:
```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```

Application runs at `http://localhost:5173`.

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/challenge/start` | Creates challenge session, returns `sessionId` |
| POST | `/api/challenge/attempt` | Submits gesture verification attempt |
| POST | `/api/challenge/save-score` | Records finalized score by `guestId` |
| GET | `/api/leaderboard?limit=10` | Retrieves top scores |
| GET | `/api/user/:guestId/stats` | Fetches historical player stats |
| GET | `/api/health` | Service and MongoDB connectivity check |

If the backend database is unreachable, scores and game state automatically fall back to local browser storage with automatic sync once the connection is restored.

---

## License & Compliance

Copyright (c) 2026 ShadowPlay Studio. All rights reserved.
Operated in compliance with the Digital Personal Data Protection Act, 2023 (India).
