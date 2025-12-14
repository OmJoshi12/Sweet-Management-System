# Sweet Shop Management System (TDD Kata)

## Video Demonstration

Watch the full project demo here:  
[Project Demo Video](https://drive.google.com/file/d/1gttkYaH7UjYXwHAmj75gES_cQKJwlg6j/view?usp=sharing)

---

## Admin Panel Access (Demo)

Use the following credentials to access the **Admin Panel** features  
(create/update/delete sweets, restock inventory):

- **Email:** `admin@example.com`
- **Password:** `admin123`

> These credentials are for **demo/testing purposes only** and are auto-created on backend startup if not already present.

## Overview
Sweet Shop Management System is a full-stack MERN application to manage a sweet shop inventory.

It supports:

- **Authentication** (Register/Login) using **JWT**
- **Sweets inventory** CRUD (admin-only for create/update/delete)
- **Search & filters** (name/category/price range)
- **Purchasing** (decreases stock)
- **Restocking** (admin-only)

This repository is structured to demonstrate API design, database usage, frontend integration, and automated testing.

## Tech Stack

- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, bcrypt
- **Frontend**: React (Create React App), React Router, Axios
- **Testing**: Jest + Supertest

## Project Structure

- **backend/**
  - `src/app.js` Express app
  - `src/server.js` server bootstrap
  - `src/routes/*` REST routes
  - `src/controllers/*` request handlers
  - `src/models/*` Mongoose models
  - `tests/*` Jest/Supertest integration tests
- **frontend/**
  - React SPA (Login/Register/Dashboard/Sweet details + admin pages)

## Prerequisites

- Node.js (LTS recommended)
- MongoDB running locally, or a MongoDB Atlas connection string

## Environment Variables

There are **no `.env.example` files** in this repo currently. Create them manually.

### Backend (`backend/.env`)

Create a file `backend/.env`:

```bash
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/sweetshop
JWT_SECRET=replace_me_with_a_long_random_secret
```

### Frontend (`frontend/.env`) (optional)

If you run the backend on a different host/port, create `frontend/.env`:

```bash
REACT_APP_API_URL=http://localhost:4000
```

## Run Locally

### 1) Start MongoDB

Ensure MongoDB is running.

### 2) Start Backend

```bash
cd backend
npm install
npm start
```

Expected logs:

```text
✅ MongoDB connected successfully
✅ Server running on http://localhost:4000
```

### 3) Start Frontend

In a new terminal:

```bash
cd frontend
npm install
npm start
```

Open:

- Frontend: `http://localhost:3000`
- Backend health: `http://localhost:4000/health`

## Demo Credentials

On backend start, a default admin user is created (if not present):

- Email: `admin@example.com`
- Password: `admin123`

## API Endpoints (per Kata Requirements)

Base URL: `http://localhost:4000`

### Auth

- `POST /api/auth/register`
  - Body: `{ "email": string, "password": string }`
- `POST /api/auth/login`
  - Body: `{ "email": string, "password": string }`

### Sweets (Protected - JWT required)

All endpoints below require header:

```text
Authorization: Bearer <token>
```

- `POST /api/sweets` (Admin only)
- `GET /api/sweets`
- `GET /api/sweets/search?name=&category=&minPrice=&maxPrice=`
- `PUT /api/sweets/:id` (Admin only)
- `DELETE /api/sweets/:id` (Admin only)

### Inventory (Protected - JWT required)

- `POST /api/sweets/:id/purchase`
  - Body: `{ "amount": number }`
- `POST /api/sweets/:id/restock` (Admin only)
  - Body: `{ "amount": number }`

## Tests

### Run backend test suite

```bash
cd backend
npm test
```

### Test report

When submitting, include the console output of `npm test` (or a screenshot) as the “test report”.

## TDD Notes (Red-Green-Refactor)

The goal of this kata is to follow a TDD workflow:

- **Red**: Write a failing test first
- **Green**: Implement the smallest change to make it pass
- **Refactor**: Improve the design without changing behavior

In this repo, Jest + Supertest integration tests cover auth and sweets workflows.

## Screenshots

Add screenshots to the repo and reference them here:

- Login page
- Register page
- Dashboard (sweets list)
- Admin actions (add/edit/delete)
- Purchase flow
- Everything in Screenshots folder

Example:

```md
![Dashboard](./screenshots/dashboard.png)
```

## Git & Version Control

Use small, descriptive commits that narrate the kata journey (especially if you are following TDD).

## AI Usage Policy (Mandatory)

### AI Co-authorship in commits

For any commit where you used AI assistance, add a co-author trailer at the end of the commit message:

```bash
git commit -m "feat: Implement user registration endpoint" \
  -m "" \
  -m "" \
  -m "Co-authored-by: ChatGPT <AI@users.noreply.github.com>"
```

## My AI Usage

### Tools used

- **ChatGPT (Cascade)**
- **GitHub Copilot** 
- **ZenCoder** 
- **Blackbox** 

### How I Used AI

- **Backend**
  - **GitHub Copilot & Blackbox AI** were used to generate initial route, controller, and model skeletons.
  - **ChatGPT** helped reason about JWT authentication middleware, role-based access control, and request validation logic.
  - **Zencoder** assisted in refactoring backend code for better readability and maintainability during TDD cycles.

- **Frontend**
  - **GitHub Copilot & Blackbox AI** assisted with React component scaffolding and folder structuring.
  - **ChatGPT** helped with API integration patterns, state management decisions, and UX wording aligned with kata requirements.
  - **Zencoder** was used to improve code consistency and reduce duplication.

- **Testing**
  - **GitHub Copilot & Blackbox AI** helped draft initial Jest and Supertest test cases.
  - **ChatGPT** assisted in identifying edge cases for authentication, purchase, and restock workflows.
  - **Zencoder** supported refactoring tests during Red–Green–Refactor iterations.

- **Documentation**
  - **ChatGPT** was used to structure and format the README.md according to the kata guidelines.
  - **Zencoder** assisted in refining technical explanations and setup instructions.
  - **GitHub Copilot** provided inline suggestions while documenting code comments.


### Reflection

AI sped up boilerplate, reduced iteration time while debugging integration issues, and helped keep docs aligned with requirements. I still verified behavior locally, reviewed changes, and made final decisions on architecture and security.
