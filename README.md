# AlgoFirst

**Version:** 0.2.0

AlgoFirst is a coding practice platform UI built with Next.js, TypeScript, and Tailwind CSS. Fully integrated with Express backend, MongoDB, and Judge0 for code execution.

## Tech Stack

- **Frontend:** Next.js 15.5.15 (App Router), React 19, TypeScript 5, Tailwind CSS 4, Monaco Editor
- **Backend:** Express 5.2.1, Node.js 20+, Mongoose 9.4.1 (MongoDB ODM)
- **Code Execution:** Judge0 API (ce.judge0.com) with configurable timeout
- **Build & Quality:** ESLint, Prettier, Concurrently for parallel tasks

## ✅ Latest Updates (v0.2.0)

### Security & Stability
- ✅ Fixed all npm audit vulnerabilities (0 remaining)
- ✅ Pinned critical dependencies to exact versions (prevents drift)
- ✅ Added `.npmrc` with `save-exact=true` for reproducible installs
- ✅ Next.js 15.1.11 → 15.5.15, PostCSS 8.4.8 → 8.5.10

### Smart Port Management
- ✅ **Automatic port detection:** Frontend auto-selects free port (4028, 4029, 4030...)
- ✅ **Backend reuse:** If backend on 5000 is busy, reuses existing instance
- ✅ **IPv4 + IPv6 support:** Probes both localhost and 127.0.0.1
- ✅ **Windows-compatible:** Direct Node.js execution (bypasses PowerShell .cmd issues)

### Network & CORS
- ✅ **Dynamic localhost CORS:** Accepts any localhost port during development
- ✅ Fixed "Network Error" on code execution
- ✅ Configurable origins for production

### Data Validation & Output
- ✅ **Auto-slug generation:** Dynamically created problems now generate proper slugs automatically
- ✅ **Output normalization:** Multi-stage comparison pipeline handles:
  - JSON string literals (`"BANC"` vs `BANC`)
  - Whitespace differences
  - Quote variations
  - Primitive JSON parsing
- ✅ **Robust test case comparison:** No false negatives from formatting differences

## Current Status

- ✅ All routes fully implemented with real backend integration
- ✅ Code execution via Judge0 with live result storage
- ✅ Submission history & progress tracking synchronized
- ✅ MongoDB for persistent problem/user/submission storage
- ✅ Production build passes with 0 errors
- ✅ TypeScript strict mode passes
- ✅ Dynamic problem creation & validation complete

## Local Setup

### Option 1: Smart Combined Launch (Recommended)

```bash
npm run dev:full
```

This single command:
- Auto-detects free frontend port (4028+)
- Starts backend on 5000 (or reuses if already running)
- Handles graceful shutdown on Ctrl+C

### Option 2: Manual Control

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
npm run dev:backend
```

### First Time Setup

```bash
npm install
npm run dev:full
```

Then open: `http://localhost:4028` (or the assigned port shown in terminal)

## Available Scripts

### Development
- `npm run dev` - Start Next.js frontend (auto-selects free port starting from 4028)
- `npm run dev:backend` - Start Express backend (port 5000)
- `npm run dev:full` - Start both frontend and backend with intelligent port management

### Build & Production
- `npm run build` - Create optimized production build
- `npm run start:backend` - Start backend in production mode
- `npm run type-check` - Run TypeScript type checking
- `npm run lint` - Check code style with ESLint
- `npm run lint:fix` - Auto-fix fixable lint issues
- `npm run format` - Format code with Prettier

### Scripts
- `scripts/dev-next.js` - Frontend launcher with port detection (invoked by `dev` script)
- `scripts/dev-full.js` - Combined launcher with backend management (invoked by `dev:full` script)

## App Routes

- `/` - Home/landing page
- `/sign-up-login-screen` - Authentication (login/registration)
- `/problem-list` - Browse and filter coding problems
- `/problem-detail?id=<problemId>` - Problem statement + Monaco editor + test results
- `/progress` - Submission history and statistics
- `/profile` - User profile and performance metrics
- `/student-plan` - Topic-based learning roadmap

## Project Structure

```
AlgoFirst1/
├── public/                                 # Static assets
│   └── assets/images/                     # Image files
├── server/                                 # Express backend (NEW)
│   ├── controllers/
│   │   └── executeController.js          # Code execution & test case comparison
│   ├── models/
│   │   ├── Problem.js                    # Mongoose problem schema
│   │   ├── User.js                       # User schema
│   │   └── Submission.js                 # Submission schema
│   ├── routes/
│   │   └── executeRoutes.js              # POST /api/execute endpoint
│   ├── services/
│   │   ├── db.js                         # MongoDB connection
│   │   ├── judge0Service.js              # Judge0 API wrapper
│   │   └── seedProblems.js               # Problem data seeding
│   ├── data/
│   │   └── problems.seed.json            # Initial problem dataset
│   └── server.js                         # Express app entry point
├── scripts/                                # Node.js utility scripts (NEW)
│   ├── dev-next.js                       # Frontend launcher with port detection
│   └── dev-full.js                       # Combined frontend+backend launcher
├── src/
│   ├── app/                              # Next.js App Router
│   │   ├── layout.tsx                    # Root layout with AppLayout
│   │   ├── page.tsx                      # Home page
│   │   ├── problem-detail/
│   │   │   ├── page.tsx                  # Problem detail page (with Suspense boundary)
│   │   │   └── components/
│   │   │       ├── CodeEditorPanel.tsx   # Editor + test controls
│   │   │       ├── MonacoEditor.tsx      # Monaco integration
│   │   │       ├── ProblemDetailClient.tsx
│   │   │       ├── ProblemDetailHeader.tsx
│   │   │       ├── ProblemStatement.tsx
│   │   │       └── TestResultsPanel.tsx  # Test execution results
│   │   ├── problem-list/
│   │   │   ├── page.tsx
│   │   │   └── components/
│   │   │       ├── ProblemFilters.tsx
│   │   │       ├── ProblemListClient.tsx
│   │   │       ├── ProblemListStats.tsx
│   │   │       └── ProblemTable.tsx
│   │   ├── progress/
│   │   ├── profile/
│   │   ├── sign-up-login-screen/
│   │   └── student-plan/
│   ├── components/
│   │   ├── AppLayout.tsx                 # Main layout wrapper
│   │   ├── Sidebar.tsx                   # Navigation sidebar
│   │   └── ui/                           # Reusable UI components
│   │       ├── AppIcon.tsx
│   │       ├── AppImage.tsx
│   │       ├── DifficultyBadge.tsx
│   │       └── VerdictBadge.tsx
│   ├── context/
│   │   ├── AuthContext.tsx               # Authentication state
│   │   └── SubmissionContext.tsx         # Submission history & stats
│   ├── lib/
│   │   └── mockData.ts                   # Test problems & cases
│   ├── services/
│   │   └── api.ts                        # Axios client for backend
│   ├── styles/
│   │   ├── index.css
│   │   ├── tailwind.css
│   │   └── styles.d.ts
│   └── types/
│       └── styles.d.ts
├── .npmrc                                 # npm config (NEW): save-exact=true
├── .env                                   # Frontend environment variables
├── .env.example                           # Environment template
├── server/.env                            # Backend environment variables (NEW)
├── server/.env.example                    # Backend environment template (NEW)
├── package.json                          # Dependencies (pinned versions)
├── tsconfig.json                         # TypeScript config
├── next.config.mjs                       # Next.js config
├── tailwind.config.js                    # Tailwind CSS config
├── postcss.config.js                     # PostCSS config
├── README.md                             # This file
└── LICENSE
```

## Environment Configuration

### Frontend (.env)
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

### Backend (server/.env)
```
BACKEND_PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/algofirst
JUDGE0_BASE_URL=https://ce.judge0.com
JUDGE0_API_KEY=<your-api-key>
JUDGE0_API_SECRET=<your-api-secret>
FRONTEND_ORIGIN=http://localhost:4028
```

See `server/.env.example` for all available options.

## Key Features & Architecture

### 1. Smart Port Detection (NEW)
- **Location:** `scripts/dev-next.js` and `scripts/dev-full.js`
- **Why:** Eliminates "EADDRINUSE" errors on Windows
- **How:** TCP socket connection probes + IPv4/IPv6 fallback
- **Benefit:** Developers can re-run `npm run dev:full` without manual cleanup

### 2. Output Normalization (NEW)
- **Location:** `server/controllers/executeController.js`
- **Functions:**
  - `tryParsePrimitiveJson()` - Parses JSON string literals
  - `stripSurroundingQuotes()` - Recursively removes quotes
  - `normalizeComparableText()` - Pipeline combining both
  - `outputsMatch()` - Robust test case comparison
- **Why:** Judge0 returns raw stdout; seed data may contain JSON strings
- **Example:** `"BANC"` (expected) == `BANC` (actual) ✅

### 3. Dynamic CORS (NEW)
- **Location:** `server/server.js`
- **Functions:** `isLocalDevOrigin()`, `isAllowedOrigin()`
- **Behavior:** Accepts any `localhost` or `127.0.0.1` port during development
- **Production:** Uses hardcoded `FRONTEND_ORIGIN` from `.env`

### 4. Auto-Slug Generation (NEW)
- **Location:** `server/controllers/executeController.js`
- **Function:** `toProblemSlug()`
- **Why:** Mongoose schema requires slug field; dynamic problems now auto-generate it
- **Example:** Problem ID `prob-001` → Slug `prob-001`

### 5. Suspense Boundary (NEW)
- **Location:** `src/app/problem-detail/page.tsx`
- **Why:** Next.js 15.5.15 enforces Suspense for `useSearchParams()`
- **Fix:** Wrapped `ProblemDetailClient` in `<Suspense>` boundary

## Troubleshooting

### Port Already in Use
```bash
# Manual: Kill process on port 4028 or 5000
# Auto: Use dev:full which detects and reuses ports
npm run dev:full
```

### CORS Error (Network Error in browser)
- Backend must be running: `npm run dev:backend`
- Check backend is accessible: `curl http://localhost:5000/health`
- Check `.env` `FRONTEND_ORIGIN` matches your frontend URL

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check `MONGODB_URI` in `server/.env`
- Default: `mongodb://127.0.0.1:27017/algofirst`

### Test Output Mismatch
- If tests fail with "Output does not match expected":
  - Verify both stdout and expected output are normalized
  - Check for quote variations (`"value"` vs `value`)
  - Ensure no trailing newlines in expected output
  - Review `normalizeComparableText()` in executeController.js

### Build Errors
- Always run `npm run type-check` before build
- Verify Suspense boundaries are in place for dynamic search params
- Clear `.next` directory: `rm -r .next`

## Development Workflow

1. **Clone & Install**
   ```bash
   git clone <repo>
   cd AlgoFirst1
   npm install
   ```

2. **Start Development**
   ```bash
   npm run dev:full
   ```
   - Frontend available at `http://localhost:4028` (or next free port)
   - Backend running on `http://localhost:5000`
   - MongoDB seeded with sample problems

3. **Code & Test**
   - Edit files in `src/` for frontend
   - Edit files in `server/` for backend
   - Changes auto-reload via HMR

4. **Validate Before Commit**
   ```bash
   npm run type-check    # TypeScript checks
   npm run lint          # ESLint analysis
   npm run build         # Production build test
   ```

5. **Deploy**
   ```bash
   npm run build         # Creates .next/ directory
   npm run start:backend # Runs backend in production
   ```

## Dependency Versions (Pinned)

All critical dependencies are pinned to exact versions in `package.json` to ensure reproducible builds:

- `next`: 15.5.15
- `react`: 19.0.0-rc-66855b96d9-20250101
- `typescript`: 5.7.2
- `tailwindcss`: 4.0.0
- `@monaco-editor/react`: 4.6.0
- `express`: 5.2.1
- `mongoose`: 9.4.1
- `axios`: 1.6.0

See `package.json` for complete list and `npm.lock` for transitive dependencies.

## Performance Notes

- **Frontend:** Next.js 15 with static prerendering where possible
- **Backend:** Express with proper error handling and timeouts
- **Judge0:** 10-30s timeout per code execution (configurable)
- **Database:** MongoDB with indexed queries on frequently accessed fields

## Security

- ✅ All npm audit vulnerabilities fixed (0 remaining)
- ✅ CORS properly configured for development and production
- ✅ Environment variables stored in `.env` (not committed)
- ✅ Input validation on backend for problem creation
- ✅ Output comparison pipeline prevents injection attacks

## Contributing

1. Create a feature branch
2. Make changes following the current code style
3. Run `npm run lint:fix` for formatting
4. Run `npm run type-check` and `npm run build` to validate
5. Commit with descriptive message
6. Push and create a pull request

## License

This project is part of AlgoFirst platform. All rights reserved.

---

**Last Updated:** April 22, 2026  
**Version:** 0.2.0  
**Status:** ✅ Production Ready
