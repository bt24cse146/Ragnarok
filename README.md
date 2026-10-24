# Relay — Agent Hackathon Starter

A clean MERN starter with React + Vite, Express, Firebase email/password and Google authentication, MongoDB Atlas persistence, a dashboard, an agent workspace, and run history.

## Start locally

1. Install Node.js 20 or newer.
2. Copy `frontend/.env.example` to `frontend/.env`; the example contains the Firebase web configuration for this starter. The downloadable ZIP intentionally excludes active `.env` files so your local credentials are not overwritten or shared.
3. Copy `backend/.env.example` to `backend/.env`. Replace the placeholder `MONGO_URI` with the full connection string from MongoDB Atlas. The cluster host is specific to your Atlas cluster, so it cannot be filled in from the database username alone.
4. In Firebase Console, open **Authentication → Sign-in method** and enable both **Email/Password** and **Google**. Under **Authentication → Settings → Authorized domains**, make sure `localhost` is listed. Google sign-in buttons are included on both Sign In and Sign Up pages.
5. In Firebase Console → Project settings → Service accounts, generate a private key. Keep the JSON file private; either set `GOOGLE_APPLICATION_CREDENTIALS` to its path or fill the three `FIREBASE_ADMIN_*` values in `backend/.env`.
6. In MongoDB Atlas, allow your development IP and use the database user's password in `MONGO_URI` (URL-encode special characters in the password).
7. From the project root folder (the folder containing this README and the root `package.json`) run:

   ```bash
   npm install
   npm run dev
   ```

   If you already navigated into `frontend` and saw `vite is not recognized`, run `cd ..` first to return to the project root, then run the two commands above. `npm install` installs Vite and the other workspace dependencies.

Frontend: `http://localhost:5173` · API: `http://localhost:5000/api/health`

## Included screens

- **Sign in / Create account** — Firebase email/password and Google authentication.
- **Dashboard** — run counts, recent activity, and shortcuts.
- **Agent workspace** — prompt composer and result panel, ready for your team's agent.
- **History** — searchable previous runs.
- **Settings** — current account details and sign-out.

## Connect your team's agent

Replace the placeholder implementation in `backend/src/services/agentService.js`. Keep its input/output contract, or update `backend/src/controllers/agentController.js` and the corresponding UI together. The starter clearly labels local fallback responses as previews, not real AI output.

## Data and security

- Firebase handles user authentication. The Express API verifies Firebase ID tokens with Firebase Admin.
- MongoDB stores synchronized user profiles and agent-run history.
- Do not commit `.env` files, Firebase service-account JSON, or database credentials.
- The Firebase web configuration is supplied as client-side environment variables; restrict its API key in Google Cloud when appropriate.
