# Backend - BFHL API

Node.js + Express backend for the Bajaj task, implemented using MVC architecture.

## Tech Stack

- Node.js
- Express
- CORS
- Nodemon (dev)

## Project Structure

```text
backend/
  server.js
  .env.example
  package.json
  src/
    app.js
    config/
      identity.js
    controllers/
      bfhlController.js
    models/
      entryModel.js
    routes/
      bfhlRoutes.js
    services/
      hierarchyService.js
```

## MVC Flow

- Route layer: maps HTTP routes to controller methods.
- Controller layer: handles request validation and response status codes.
- Service layer: contains the business logic for graph parsing and hierarchy generation.
- Model layer: contains entry-level validation rules.
- Config layer: stores identity constants (`user_id`, `email_id`, `college_roll_number`).

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example` if needed:

```bash
PORT=5000
```

3. Run the server:

```bash
npm start
```

4. Run in development mode (auto-restart):

```bash
npm run dev
```

Deployed API base URL:

https://bajaj-backend-moem.onrender.com

## Environment Variables

- `PORT`: Port for the Express server.
- `CORS_ORIGIN`: Comma-separated allowed frontend origins in production.

Example:

```bash
CORS_ORIGIN=https://your-frontend-domain.com
```

If `CORS_ORIGIN` is not set, all origins are allowed (useful for local testing).

## API Endpoints

### 1) Health Check

- Method: `GET`
- URL: `/`
- Description: Checks if the API is running.

Sample response (`200`):

```json
{
  "status": "SRM BFHL API is running",
  "endpoint": "POST /bfhl"
}
```

### 2) Process Hierarchy Data

- Method: `POST`
- URL: `/bfhl`
- Content-Type: `application/json`

Request body:

```json
{
  "data": ["A->B", "B->C", "C->D"]
}
```

Validation rules for each entry:

- Whitespace is trimmed.
- Must match `^[A-Z]->[A-Z]$`.
- Self-loop like `A->A` is invalid.

Processing behavior:

- Duplicate valid edges are tracked in `duplicate_edges`.
- Invalid entries are tracked in `invalid_entries`.
- If a child gets multiple parents, first encountered parent is kept.
- Cycles are detected per connected group.

Sample success response (`200`):

```json
{
  "user_id": "sameer__5121",
  "email_id": "ss5250@srmist.edu.in",
  "college_roll_number": "RA2311026010628",
  "hierarchies": [
    {
      "root": "A",
      "tree": {
        "A": {
          "B": {
            "C": {
              "D": {}
            }
          }
        }
      },
      "depth": 4
    }
  ],
  "invalid_entries": [],
  "duplicate_edges": [],
  "summary": {
    "total_trees": 1,
    "total_cycles": 0,
    "largest_tree_root": "A"
  }
}
```

Bad request example (`400`) when `data` is not an array:

```json
{
  "error": "`data` must be an array of strings."
}
```

## Quick Manual Test (Postman)

1. `GET https://bajaj-backend-moem.onrender.com/`
2. `POST https://bajaj-backend-moem.onrender.com/bfhl` with:

```json
{
  "data": ["A->B", "B->C", "C->D"]
}
```

3. `POST https://bajaj-backend-moem.onrender.com/bfhl` with invalid/duplicate values:

```json
{
  "data": ["A->A", "A->B", "A->B", "bad"]
}
```

## Notes

- Identity values are configured in `src/config/identity.js`.
- Server entry point is `server.js`.
- App wiring (middleware + routes) is in `src/app.js`.
