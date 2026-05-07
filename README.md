# AlgoFirst

AlgoFirst is a full-stack coding practice platform built with Next.js, TypeScript, Tailwind CSS, Express, MongoDB, and Judge0. It supports authenticated code execution, per-user submissions, dynamic progress stats, and AI mentor analysis.

## Features

- Authenticated login and registration with JWT
- Per-user submissions and problem progress stored in MongoDB
- Judge0-backed code execution for multiple languages
- Dynamic profile stats and streaks computed from the signed-in user's submission history
- Submission history filtered to the authenticated user only
- AI mentor analysis endpoint powered by OpenRouter
- Responsive dark UI with problem list, detail, progress, profile, and student plan pages

## Tech Stack

- Frontend: Next.js 15, React 19, TypeScript, Tailwind CSS
- Backend: Node.js, Express 5, Mongoose
- Database: MongoDB
- Code execution: Judge0 API
- AI mentor: OpenRouter

## Project Structure

- `src/app` - App Router pages and page-level components
- `src/components` - Shared UI and layout components
- `src/context` - Auth and submission state
- `src/services` - Frontend API client
- `server` - Express backend, controllers, routes, services, and models
- `scripts` - Development helpers for running frontend and backend together

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

- Frontend: create `.env` with `NEXT_PUBLIC_API_BASE_URL=http://localhost:5000`
- Backend: create `server/.env` from `server/.env.example`

3. Start the app:

```bash
npm run dev:full
```

This starts:
- Frontend on the first available local port starting at `4028`
- Backend on `http://localhost:5000`

You can also run the services separately:

```bash
npm run dev
npm run dev:backend
```

## Available Scripts

- `npm run dev` - Start the Next.js frontend only
- `npm run dev:backend` - Start the Express backend only
- `npm run dev:full` - Start frontend and backend together
- `npm run build` - Build the frontend
- `npm run start` - Start the frontend in production mode
- `npm run start:backend` - Start the backend in production mode
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Auto-fix lint issues
- `npm run type-check` - Run TypeScript checks
- `npm run format` - Run Prettier formatting

## Environment Variables

### Frontend `.env`

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

### Backend `server/.env`

```bash
BACKEND_PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/algofirst
MONGODB_DB_NAME=algofirst
FRONTEND_ORIGIN=http://localhost:4028

JUDGE0_BASE_URL=https://ce.judge0.com
JUDGE0_RAPIDAPI_KEY=
JUDGE0_RAPIDAPI_HOST=
JUDGE0_AUTH_TOKEN=
JUDGE0_TIMEOUT_MS=20000

OPENROUTER_API_KEY=
```

See `server/.env.example` for the full template.

## API Overview

### Auth

- `POST /api/auth/register` - Create a new account
- `POST /api/auth/login` - Sign in and receive a JWT
- `GET /api/auth/me` - Get the authenticated user and dynamic stats

### Execution

- `POST /api/execute` - Run code against a problem's test cases
- `GET /api/submissions` - Get the current user's submissions

### Profile

- `GET /api/profile/stats` - Get dynamic submission stats and streak for the current user

### Mentor

- `POST /api/mentor-analysis` - Get AI analysis for a successful submission

## Data Rules

- All submission queries are scoped to the authenticated user
- Streaks are computed from the user's Accepted submissions only
- New users start with zero submissions, zero solved problems, and zero streak
- Demo UI autofill is removed; real registration is required

## Notes

- Make sure MongoDB is running before starting the backend
- If mentor analysis is enabled, provide a valid OpenRouter API key in `server/.env`
- The backend seeds problem data automatically on startup

## License

This repository does not currently include a license file.
