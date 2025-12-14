## Copilot / AI Agent Instructions — Sweet Management System

Short, actionable notes to get an AI coding agent productive in this repository.

1) Big picture
- Backend: Node.js + Express app at `backend/src` (entry `backend/src/server.js` -> loads `backend/src/app.js`). Mongoose connects in `backend/src/config/db.js` to the `sweetshop` database.
- Frontend: React app under `frontend/src`. `frontend/src/api.js` centralizes API calls; pages live in `frontend/src/pages` (e.g. `Dashboard.js`, `Login.js`, `Register.js`).

2) Key service boundaries & data flow
- API base: `http://localhost:4000` by default (frontend `proxy` set in `frontend/package.json`), backend routes mounted under `/api` (`/api/auth`, `/api/sweets`).
- Auth: JWT issued by `/api/auth` routes; frontend passes token as `Authorization: Bearer <token>` via `frontend/src/api.js`.
- Data: Sweet documents stored in MongoDB using Mongoose model `backend/src/models/Sweet.js` (fields: `name`, `category`, `price`, `quantity`, `imageUrl`).
- Images: `backend/src/services/imageService.js` uses Google Custom Search (env: `GOOGLE_API_KEY`, `GOOGLE_CSE_ID`) and falls back to Unsplash if keys missing.

3) Important files to reference when changing behavior
- `backend/src/controllers/sweetController.js` — all sweets CRUD, purchase & restock logic and validation.
- `backend/src/services/imageService.js` — image fetching + fallback logic. Preserve current contract: returns a string `imageUrl`.
- `backend/src/config/db.js` — mongoose connect; ensure retries / error handling if changing connection logic.
- `frontend/src/api.js` — single place to update API URL or auth header logic.
- `frontend/src/pages/Dashboard.js` — UI rendering, admin-only add/update/delete features; uses `user.role === 'admin'` to gate admin flows.

4) Run / dev / test commands (what works now)
- Backend dev: from `backend/` run `npm run dev` (nodemon). Start: `npm start`.
- Backend tests: from `backend/` run `npm test` (uses Jest & supertest).
- Frontend dev: from `frontend/` run `npm start` (Create React App). Proxy is configured to `http://localhost:4000`.

5) API contract examples (use these exact shapes)
- Create sweet (admin): POST `/api/sweets` JSON body { "name": "Lollipop", "category": "Candy", "price": 1.5, "quantity": 10 }
  - Response: 201 JSON sweet document with `_id`, `imageUrl`, `createdAt`.
- List sweets: GET `/api/sweets` -> 200 JSON array of sweets.
- Purchase: POST `/api/sweets/:id/purchase` body { "amount": 1 } -> 200 updated sweet or 400 if insufficient quantity.

6) Project-specific conventions & patterns
- Validation happens in controllers (not in models). Follow controller-style checks used in `sweetController.js` (explicit Number coercion, integer checks for quantity, descriptive 400 errors).
- Controllers return JSON with either resource or `{ error: 'message' }`. Keep using HTTP status codes: 200/201/204/400/404/500.
- Image fetching: prefer Google's Custom Search when env vars present; otherwise fallback to Unsplash `https://source.unsplash.com/featured/?sweet,<name>`.
- Frontend relies on `frontend/src/api.js` helper which throws errors with `payload?.error || 'Request failed'`. Update UI to show those messages.

7) Credentials & env vars (examples)
- Backend `.env` required variables (example):
  - `MONGODB_URI=mongodb://127.0.0.1:27017/sweetshop`
  - `PORT=4000`
  - `JWT_SECRET=your_jwt_secret`
  - `GOOGLE_API_KEY=your_google_api_key` (optional)
  - `GOOGLE_CSE_ID=your_google_cse_cx` (optional)

8) Quick debugging tips
- If sweets are not appearing on the frontend: check browser console for network errors; ensure `Authorization` header is present for protected endpoints; verify backend logs from `nodemon`.
- If image URLs are missing: confirm `GOOGLE_API_KEY`/`GOOGLE_CSE_ID` in backend env or rely on the Unsplash fallback.
- DB connection issues: check `backend/src/config/db.js` uri and that MongoDB is reachable at `MONGODB_URI`.

9) Tests & CI notes
- Unit/integration tests use Jest + supertest in `backend/tests/*`. When modifying routes, update or add tests in that directory.

10) When editing code — practical instructions for the agent
- Edit controllers for validation/logic; leave Mongoose schemas simple (see `models/Sweet.js`).
- Use `frontend/src/api.js` to change request headers or base URL — client code expects functions like `createSweet`, `getSweets`.
- Prefer small, focused changes and run backend tests (`npm test`) and `frontend` dev to verify UI.

If anything here is unclear or you want more detail (example: exact env samples, test run output, or a short checklist for adding a new protected endpoint), tell me which section to expand. Thanks!
