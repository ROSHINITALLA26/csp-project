# Mini Instagram (Anonymous) — Backend

Anonymous, aesthetic social platform for diaries (text, image, voice), Echo Galaxy voice-stars, clubs, relaxing games (front-end), and sentiment-based recommendations — with strict privacy defaults.

## Features (Backend)
- JWT auth with anonymous IDs
- Posts: text, image, voice (Multer uploads)
- Sentiment analysis (npm `sentiment`)
- Human detection **stub** for images (privacy-first). Real model hook ready.
- Echo: support reactions for voice posts (stars shine brighter)
- Comments with profanity filter
- Clubs: list + join
- Daily reminder scheduler (demo logging)
- Simple metrics

## Quick Start
1. **Install & Run MongoDB** (local or Atlas).
2. Copy env:  
   ```bash
   cp .env.example .env
   # adjust MONGO_URI, JWT_SECRET, ORIGIN, etc.
   ```
3. **Install deps & start**:  
   ```bash
   npm install
   npm run dev
   ```
4. Upload dir served at `/uploads`.

## API (Essential)
- `POST /auth/register` `{ email?, password? }` → `{ token, anonId }`
- `POST /auth/login` `{ email, password }` → `{ token, anonId }`
- `GET /profile/me` *(auth)* → anon profile

### Posts
- `POST /posts` *(auth, multipart)* fields:  
  - `kind`: `text | image | voice`  
  - `text`: optional (analyzed for sentiment)  
  - `media`: file for `image`/`voice`  
  - Enforces human detection stub when `HUMAN_DETECTION=on` (blocks images until real model installed)
- `GET /posts?kind=text|image|voice` *(auth)* → feed
- `POST /posts/:id/support` *(auth, voice-only)*

### Comments
- `POST /comments` *(auth)* `{ postId, text }` — blocks profanity
- `GET /comments/:postId` *(auth)*

### Echo
- `GET /echo/stars` *(auth)* → `{ count, stars:[{id,audio,support,createdAt}] }`

### Clubs
- `GET /clubs` *(auth)* — seeds defaults on first call
- `POST /clubs/:id/join` *(auth)*

### Metrics
- `GET /metrics` → counts + reminder stats

## Human Detection (Hook)
`src/services/humanDetector.js` currently returns **true** (reject) when `HUMAN_DETECTION=on`.
Replace it with a Python/OpenCV or YOLO script and call from Node.
For development, set `HUMAN_DETECTION=off` to allow images.

## Notes
- This repo focuses on the **backend**. Frontend (React + galaxy canvas, tabs) can consume these APIs.
- For production: add rate-limits, validations, S3 for media, push/email service, monitoring, and robust moderation.
