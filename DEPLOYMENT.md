# Separate Deployment Guide

PromptVault AI is split into two independent apps:

- `client`: Vite React frontend
- `server`: Express API backend

Deploy them as two separate services.

## Backend On Render

Create a Render Web Service from the `server` folder.

```text
Root Directory: server
Build Command: npm install
Start Command: npm start
Health Check Path: /api/health
```

Backend environment variables:

```env
NODE_ENV=production
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/promptvault
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=15m
CLIENT_URL=https://your-frontend-domain.com
```

Optional feature variables:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=https://your-backend-domain.com/api/auth/google/callback
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
FROM_EMAIL=no-reply@promptvault.ai
```

Check the deployed API:

```text
https://your-backend-domain.com/api/health
```

## Frontend On Vercel

Create a Vercel project from the `client` folder.

```text
Root Directory: client
Framework Preset: Vite
Install Command: npm install --include=optional
Build Command: npm run build
Output Directory: dist
```

Frontend environment variables:

```env
VITE_API_URL=https://your-backend-domain.com/api
VITE_RAZORPAY_KEY_ID=
```

Redeploy after changing `VITE_API_URL`; Vite reads env variables during build.

## Connect Both Apps

After frontend deployment, set the frontend URL in the backend:

```env
CLIENT_URL=https://your-frontend-domain.com
```

After backend deployment, set the backend API URL in the frontend:

```env
VITE_API_URL=https://your-backend-domain.com/api
```

No trailing slash is needed.

## MongoDB Atlas

- Create a database user.
- Add the deployed backend IPs to Network Access, or use `0.0.0.0/0` temporarily while testing.
- Make sure `MONGO_URI` includes the database name, for example `/promptvault`.
- URL-encode special characters in the password.

## Quick Checks

Backend:

```text
https://your-backend-domain.com/
https://your-backend-domain.com/api/health
https://your-backend-domain.com/api/prompts
```

Frontend:

```text
https://your-frontend-domain.com
```

If frontend loads but data does not:

- Confirm `VITE_API_URL` includes `/api`.
- Confirm backend `CLIENT_URL` exactly matches the frontend origin.
- Confirm `/api/health` says `database: "connected"`.
- Clear the Vercel build cache if a dependency install issue appears.
