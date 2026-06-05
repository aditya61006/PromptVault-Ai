# PromptVault AI

A MERN prompt marketplace with a Vite React client and an Express/MongoDB API server.

The project is intentionally split into two standalone apps:

```text
prompthub/
  client/   Vite + React frontend
  server/   Express + MongoDB backend API
```

There is no root `package.json`. Install, run, build, and deploy each app from its own folder.

## Run Locally

Open one terminal for the backend:

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

The API runs on:

```text
http://localhost:5001
http://localhost:5001/api/health
```

Open a second terminal for the frontend:

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

The client runs on:

```text
http://localhost:5173
```

In local development, the Vite proxy sends `/api` requests to `http://localhost:5001`.

## Environment Files

Backend: `server/.env`

```env
NODE_ENV=development
PORT=5001
CLIENT_URL=http://localhost:5173
MONGO_URI=your_mongodb_uri
JWT_SECRET=replace_with_long_random_secret
JWT_EXPIRES_IN=15m
```

Frontend: `client/.env`

```env
VITE_API_URL=http://localhost:5001/api
VITE_RAZORPAY_KEY_ID=
```

## Build Separately

Frontend:

```bash
cd client
npm run build
```

Backend:

```bash
cd server
npm start
```

## Deploy Separately

Frontend can be deployed from the `client` folder on Vercel or Netlify.

Vercel settings:

```text
Root Directory: client
Install Command: npm install --include=optional
Build Command: npm run build
Output Directory: dist
```

Set this frontend environment variable:

```env
VITE_API_URL=https://your-backend-domain.com/api
```

Backend can be deployed from the `server` folder on Render, Railway, or a VPS.

Render settings:

```text
Root Directory: server
Build Command: npm install
Start Command: npm start
Health Check Path: /api/health
```

Set this backend environment variable to your deployed frontend origin:

```env
CLIENT_URL=https://your-frontend-domain.com
```

After both deploys are live, put the backend URL in the frontend `VITE_API_URL`, and put the frontend URL in the backend `CLIENT_URL`.
