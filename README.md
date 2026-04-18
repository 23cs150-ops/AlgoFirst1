# AlgoFirst

AlgoFirst is a coding practice platform UI built with Next.js, TypeScript, and Tailwind CSS.

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Monaco Editor (`@monaco-editor/react`)

## Current Status

- Frontend routes and problem workflow are implemented.
- Run/Submit behavior is currently simulated in frontend logic.
- Submission history and solved counts are synchronized through a shared client-side submission store.
- Judge0 and MongoDB are planned for backend integration later.

## Local Setup

1. Install dependencies

```bash
npm install
```

2. Start development server

```bash
npm run dev
```

3. Open in browser

```text
http://localhost:4028
```

## Available Scripts

- `npm run dev` - Start local development server (port 4028)
- `npm run build` - Create production build
- `npm run serve` - Start production server
- `npm run start` - Start dev server (same as configured script)
- `npm run type-check` - Run TypeScript checks
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix lint issues
- `npm run format` - Format project files

## App Routes

- `/sign-up-login-screen` - Authentication UI
- `/problem-list` - Problem listing and filters
- `/problem-detail` - Problem statement + editor + run/submit
- `/progress` - Submission history and progress analytics
- `/profile` - User profile and stats
- `/student-plan` - Topic-wise practice plan and problem lists

## Project Structure

```text
src/
  app/
  components/
  context/
  lib/
  services/
  styles/
public/
```

## Notes

- If port 4028 is already in use, stop the existing process or run on another port.
- This repository currently uses mock data for problems/submissions.
