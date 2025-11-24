**Project**
- **Name:**: Nova-Realm
- **Description:**: Full-stack web application with a React/Vite frontend and an Express/Node backend. The backend provides authentication (email + Google OAuth), referral and reward systems, wallet integration (Solana), and scheduled jobs.

**Repository Layout**
- **Root:**: Project root contains this `README.md` and top-level configuration files.
- **Frontend:**: `frontend/` — client app built with Vite + React.
- **Backend:**: `backend/` — Express server, routes, controllers, services, cron jobs, and database code.

**Prerequisites**
- **Node.js:**: v16+ recommended.
- **npm:**: v8+ (or `yarn` if you prefer).
- **Postgres:**: A running PostgreSQL database for the backend.
- **Solana RPC provider (optional):**: If using Solana verification you need an RPC URL.

**Environment Variables**
Create `.env` files in the `backend` and `frontend` folders (or provide env vars by your deployment provider).

- Backend `.env` (required keys):
  - `PORT` — server port (e.g. `3000`).
  - `NODE_ENV` — `development` or `production`.
  - `DATABASE_URL` — Postgres connection string.
  - `ACCESS_SECRET` — JWT access token secret.
  - `REFRESH_SECRET` — JWT refresh token secret.
  - `EMAIL_USER` — SMTP/Gmail user for sending emails.
  - `EMAIL_PASSWORD` — SMTP/Gmail password or app password.
  - `FRONTEND_URL` — Frontend base URL (e.g. `http://localhost:5173`).
  - `BACKEND_URL` — Backend base URL (e.g. `http://localhost:3000`).
  - `RPC_URL` — (optional) Solana RPC URL.
  - `WALLET_ADDRESS` — (optional) Receiver wallet address used in on-chain verification.
  - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` — for Google OAuth.
  - `TELEGRAM_BOT_TOKEN` — (optional) for Telegram verification.

- Frontend `.env` (example variables used by the frontend):
  - `VITE_API_BASE_URL` — Backend API base URL (e.g. `http://localhost:3000`).
  - Any OAuth redirect URLs used by frontend should match `FRONTEND_URL`.

**Quick Start — Backend**
- **Install dependencies**:
  ```bash
  cd backend
  npm install
  ```
- **Run in development**:
  ```bash
  nodemon ./server.js
  ```
- **Run production**:
  ```bash
  npm run start
  ```

**Quick Start — Frontend**
- **Install dependencies**:
  ```bash
  cd frontend
  npm install
  ```
- **Run dev server**:
  ```bash
  npm run dev
  ```
- **Build for production**:
  ```bash
  npm run build
  ```

**Testing / Smoke checks**
- After starting the backend, verify the health endpoint:
  ```bash
  curl http://localhost:3000/health
  ```
- Check frontend by visiting `http://localhost:5173` (or the configured `FRONTEND_URL`).

**Database / Migrations**
- This repo expects a Postgres DB with several tables used by the backend. If you don't have migrations in this repo, create schema tables manually or with your preferred migration tool (e.g., `knex`, `typeorm`, `prisma`, or raw SQL).
- Typical tables referenced by the code: `users`, `pending_verifications`, `wallet`, `daily_reward`, `referral_bonus`, `tasks`, `completed_tasks`, `completed_investment`, `completed_referral`, `investment_tasks`, `referral_tasks`.

**Important Notes & Best Practices**
- **Cookie `secure` setting:**: Cookies are set as `secure` (and `sameSite: None`) when `NODE_ENV=production`. For local development ensure `NODE_ENV` is not `production` if you need cookies on `http://localhost`.
- **Secrets:**: Never commit `.env` or secret values to git. Use a secrets manager for production deployment.
- **Email sending:**: The backend uses SMTP (Gmail in examples). If using Gmail, prefer an App Password and ensure `EMAIL_PASSWORD` is the app password.
- **Token lifetimes:**: Access token expiry is short (e.g., `15m`). Refresh tokens in this project are long-lived; consider revocation mechanisms for production.
- **Sanitize inputs & validation:**: Inputs should be validated (email format, password strength) before production usage.

**Common Troubleshooting**
- **Port already in use:**: Change `PORT` in `backend/.env` or kill the process occupying the port.
- **Cookies not being set locally:**: If cookies don't appear on localhost, ensure `NODE_ENV` is `development` so `secure` is not forced to `true`.
- **SMTP errors:**: Verify `EMAIL_USER`/`EMAIL_PASSWORD`. If using Gmail, create an App Password or enable the proper access settings.
- **Database connection refused:**: Confirm `DATABASE_URL` is correct and Postgres is running. Check firewall and allowed hosts.
- **Google OAuth redirect errors:**: Verify `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` and ensure OAuth redirect URIs include `BACKEND_URL` and `FRONTEND_URL` entries in Google Cloud Console.

**Project Structure (high-level)**
- `backend/`
  - `server.js`: Minimal bootstrap to mount routes & start cron jobs.
  - `config/`: centralized configuration (env, passport strategy).
  - `db/`: Postgres pool wrapper.
  - `controllers/`: business logic split by feature (auth, users, wallet, tasks).
  - `routes/`: express routers that map endpoints to controllers.
  - `services/`: mail sending, Solana verification, auth helpers.
  - `middlewares/`: auth middleware, rate limiters, error handlers.
  - `jobs/`: cron jobs (periodic cleanup & daily reward updates).
- `frontend/`
  - Vite + React app (see `frontend/package.json` for scripts).

**Deploying**
- When deploying, set relevant env variables at your hosting provider (Vercel, Netlify, Render, Heroku, Railway, etc.).
- Ensure `FRONTEND_URL` and `BACKEND_URL` are set to the deployed URLs and CORS/cookie options reflect production.

Last updated: 2025-11-25
