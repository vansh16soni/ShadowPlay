# ShadowPlay

A browser-based optical hand shadow puppet studio built with client-side computer vision and a dynamic 3D spatial interface. Position your hands in front of your camera to cast real-time silhouettes onto an interactive 3D theatre stage. Includes free practice exploration, adversarial shadow quest trials, chronograph time attack, anatomical gesture reference, and global operative leaderboards.

**Privacy-first architecture:** Hand tracking runs entirely in the client browser using MediaPipe Hands via WebAssembly and WebGL. Zero camera video frames, images, audio, or biometric templates are transmitted over the network or stored on external servers.

---

## 3D Spatial Interface Architecture

ShadowPlay employs a tactile, physical optical studio interface built with CSS 3D transforms, real-time depth perspective, and mechanical instrumentation:

- **3D Projection Chamber**: Central canvas rendered within a 1200px perspective viewport. Supports subtle cursor-driven spatial parallax tilt, giving the projection screen physical room depth.
- **Volumetric Projector Light Cone**: Simulates directional optical beams passing through the 3D studio space with selectable light cone vectors (Left, Center, Right).
- **Floating Picture-in-Picture Camera Visor**: A floating 3D monitor elevated at +45px depth displaying the webcam stream, 21-landmark hand skeleton, and tracking lock telemetry.
- **Analog Optics & Lighting Console**: Live studio controls for lamp spectrum (Tungsten 2800K, Studio 4200K, Lantern Flicker) and penumbra diffusion sliders (10px to 40px optical shadow softness).
- **3D Modular Control Deck**: Mechanical rocker switches for library filtering and game mode selection, featuring physical 3D button depression on click.
- **3D Specimen Collection Cards**: Anatomical finger guide cards that elevate with spatial depth and tilt relief on hover.
- **3D Metallic Podium Plaques**: Operative rankings displayed on chamfered metallic plaques with brass, steel, and copper edge highlights.

---

## Palette & Design Philosophy

ShadowPlay strictly avoids generic synthetic AI gradients and neon cyber styling in favor of an authentic analog optical instrument aesthetic:

- **Obsidian Noir & Deep Charcoal** (`#090c12`, `#121622`): Darkroom stage foundation.
- **Tungsten Lantern Amber** (`#d97706`, `#b45309`): Warm incandescent lamp spectrum.
- **Precision Emerald** (`#10b981`): Optical tracking lock confirmation.
- **Warm Parchment** (`#f5f3ef`): Clean light theme for daylight inspection.
- **Tactile Depth Bevels**: Physical top specular highlights and bottom drop shadows on all interactive controls.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Canvas API, Web Audio API, Web Speech API |
| 3D Styling | Vanilla CSS 3D Transforms (`perspective`, `preserve-3d`, tactile extrusions) |
| Computer Vision | MediaPipe Hands (21 3D coordinates, client-side WASM/WebGL) |
| Classification | Rotation-invariant Euclidean distance ratio algorithms |
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
│   │   ├── components/     # Stage3D (3D Theatre Chamber & Optics Console),
│   │   │                   # ShadowCanvas, WebcamFeed, BattlePanel, SpeedrunPanel,
│   │   │                   # Gallery, Leaderboard, Header, Sidebar, Icons,
│   │   │                   # PrivacyPolicy, TermsAndConditions, CookiePolicy,
│   │   │                   # CookieBanner, PlaySetupModal, SplashScreen, NotFound
│   │   ├── hooks/          # useMediaPipe
│   │   ├── utils/          # gestureClassifier, shadowDrawers, sounds, api
│   │   ├── App.jsx
│   │   ├── index.css       # 3D spatial tokens, mechanical switches, depth bevels
│   │   └── main.jsx
│   └── package.json
├── backend/
│   ├── models/             # User, Session, Attempt (Mongoose schemas)
│   ├── routes/             # challenge.js, leaderboard.js
│   ├── controllers/        # challengeController.js, leaderboardController.js
│   ├── server.js
│   └── package.json
└── README.md
```

---

## Setup & Local Development

### 1. Prerequisites
- Node.js 18+
- MongoDB instance (MongoDB Atlas free tier or local MongoDB)
- Modern web browser with camera access (Chrome, Edge, Firefox, Safari)

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

Start backend service:
```bash
npm run dev
```

Verify service status: `http://localhost:5000/api/health`

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

Start frontend development server:
```bash
npm run dev
```

Access the studio at `http://localhost:5173`.

---

## Game Modes

1. **Free Practice**: Untimed exploration across 20 animal and object formations with real-time silhouette projection, speech synthesis narration, and ghost target alignment guides.
2. **Shadow Quest Arena**: Progressive adversarial trials against three challenging rounds. Match counter-silhouettes before the optical countdown interval expires.
3. **Chronograph Time Attack**: Fast-paced 30-second dexterity challenge. Rapid consecutive hand matches reward streak multiplier points and add +2s bonus extensions.

---

## API Endpoints & Security Architecture

| Method | Endpoint | Authorization | Description |
|---|---|---|---|
| POST | `/api/challenge/start` | Public (Rate Limited) | Initiates scoring session and returns `sessionId` |
| POST | `/api/challenge/attempt` | Public (Rate Limited) | Records individual gesture attempt verification |
| POST | `/api/challenge/save-score` | Public (Rate Limited) | Finalizes player score linked to `guestId` |
| GET | `/api/leaderboard?limit=10` | Public (Rate Limited) | Fetches top operative records |
| GET | `/api/user/:guestId/stats` | Public (Rate Limited) | Retrieves player historical performance metrics |
| GET | `/api/health` | Public | Service connectivity and database status check |
| GET | `/api/admin/health` | Admin (`x-admin-key`) | System diagnostics, memory metrics, and uptime |
| GET | `/api/admin/stats` | Admin (`x-admin-key`) | Aggregated operative counts and session metrics |
| POST | `/api/admin/purge-old-sessions` | Admin (`x-admin-key`) | Maintenance route to purge stale empty sessions |

### Defensive Hardening Summary

- **Security Headers**: Powered by Helmet with strict Content-Security-Policy (CSP), HSTS (31536000s with preload), X-Content-Type-Options (nosniff), and X-Frame-Options (DENY).
- **Rate Limiting**: Multi-tier express-rate-limit protection: 200 req/15min general API limiter, 60 req/min challenge write limiter, and 30 req/15min admin brute-force limiter.
- **Input Sanitization**: Recursive NoSQL operator stripping (removes `$` prefixes and dot notation) plus UUID and alphanumeric regex parameter verification.
- **CORS Protection**: Explicit allowlist policy with unreflected origins and preflight caching.
- **Credential Protection**: Constant-time comparison (`crypto.timingSafeEqual`) for administrative keys and scrypt hashing primitives. Stack traces and internal database errors are completely masked in production.

If the database is unreachable, scores and session states automatically fall back to browser local storage with automatic deduplicated synchronization once the network connection is restored.


---

## Legal & Compliance Notice

Copyright (c) 2026 ShadowPlay Studio. All rights reserved.
Operated in full compliance with the Digital Personal Data Protection Act, 2023 (India) and global privacy standards.
Camera streams are processed client-side only and are never transmitted, recorded, or used for model training.
