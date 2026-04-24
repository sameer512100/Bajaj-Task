# Bajaj Full Stack Task

Full stack submission for the Bajaj Finserv Health / SRM challenge.

This project contains:

- `backend/`: Node.js + Express API for processing hierarchy edge data
- `frontend/`: React + Vite + TypeScript UI for submitting input and visualizing the response

## Live Links

- Frontend: `https://bajaj-task-peach.vercel.app/`
- Backend: `https://bajaj-backend-moem.onrender.com`

## Project Structure

```text
Bajaj-Task/
  backend/
    server.js
    package.json
    src/
      app.js
      config/
      controllers/
      models/
      routes/
      services/
  frontend/
    package.json
    vite.config.ts
    src/
      components/
      hooks/
      lib/
      pages/
```

## Backend Summary

The backend exposes:

- `GET /` for a health check
- `POST /bfhl` for processing edge input like `A->B`

The API:

- validates entries
- tracks invalid entries
- tracks duplicate edges
- builds hierarchy groups
- detects cycles
- returns user identity details and a summary object

CORS is enabled for all origins so evaluator clients can access the API from a different origin.

## Frontend Summary

The frontend:

- accepts comma-separated or newline-separated edge input
- sends requests to the deployed backend
- displays hierarchy trees, cycles, duplicates, invalid entries, and summary stats

The frontend reads the backend URL from:

```bash
VITE_API_BASE_URL=https://bajaj-backend-moem.onrender.com
```

If that variable is not set, the code falls back to the same deployed backend URL in `frontend/src/lib/api.ts`.

## Local Setup

### Backend

```bash
cd backend
npm install
npm start
```

Default local backend URL:

```text
http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Set this in `frontend/.env` for local or deployed frontend builds:

```bash
VITE_API_BASE_URL=https://bajaj-backend-moem.onrender.com
```

If you want the frontend to call a local backend instead, use:

```bash
VITE_API_BASE_URL=http://localhost:5000
```

## API Example

### Request

```json
{
  "data": ["A->B", "B->C", "C->D"]
}
```

### Response Shape

```json
{
  "user_id": "sameer_06122005",
  "email_id": "ss5250@srmist.edu.in",
  "college_roll_number": "RA2311026010628",
  "hierarchies": [],
  "invalid_entries": [],
  "duplicate_edges": [],
  "summary": {
    "total_trees": 0,
    "total_cycles": 0,
    "largest_tree_root": ""
  }
}
```

## Tech Stack

- Backend: Node.js, Express, CORS
- Frontend: React, Vite, TypeScript, Tailwind CSS, shadcn/ui
- Deployment: Render, Vercel

## Final Recheck

The current codebase is aligned end to end:

- frontend requests `POST /bfhl` on the deployed backend
- backend accepts cross-origin requests
- request and response shapes match between UI and API
- deployed backend URL matches the frontend environment variable
