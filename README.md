# SRM BFHL Full Stack Challenge

A MERN-stack implementation of the SRM Full Stack Engineering Challenge.

## Project Structure

```
srm-bfhl/
├── backend/          # Node.js + Express REST API
│   ├── server.js
│   └── package.json
└── frontend/         # React SPA
    ├── src/
    │   ├── App.jsx
    │   ├── App.css
    │   ├── index.js
    │   ├── index.css
    │   └── components/
    │       └── TreeView.jsx
    └── package.json
```

## Setup & Run Locally

### 1. Backend

```bash
cd backend
npm install
node server.js        
```

**Before running**, open `server.js` and update the identity fields:

```js
const USER_ID = "yourname_ddmmyyyy";
const EMAIL_ID = "your@email.com";
const COLLEGE_ROLL_NUMBER = "your_roll_number";
```

### 2. Frontend

```bash
cd frontend
npm install
npm start             
```

The frontend proxies `/bfhl` to `http://localhost:5000` automatically (via `"proxy"` in `package.json`).

## Deployment

### Backend (Render / Railway / Fly.io)
1. Create a new Web Service pointing to the `backend/` directory.
2. Set Start Command: `node server.js`
3. Note the deployed URL (e.g. `https://srm-bfhl.onrender.com`)

### Frontend (Vercel / Netlify)
1. Create a project pointing to the `frontend/` directory.
2. Set environment variable:
   ```
   REACT_APP_API_URL=https://your-backend-url.com
   ```
3. Build command: `npm run build`
4. Output directory: `build`

## API Reference

### POST /bfhl

**Request:**
```json
{ "data": ["A->B", "A->C", "B->D"] }
```

**Response:** See the challenge specification for the full schema.

## Tech Stack
- **Backend**: Node.js, Express, CORS
- **Frontend**: React 18, CSS Variables
- **Hosting**: Any (Render + Vercel recommended)
