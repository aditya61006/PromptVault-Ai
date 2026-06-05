# Deploy PromptVault AI

This repo is configured for:

- Frontend: Vercel
- Backend API: Render
- Database: MongoDB Atlas

## 1. Deploy Backend On Render

Use either the included `render.yaml` Blueprint or create a Render Web Service manually.

Manual settings:

```text
Root Directory: server
Build Command: npm install
Start Command: npm start
Health Check Path: /api/health
```

Render environment variables:

```env
NODE_ENV=production
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/promptvault
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=15m
CLIENT_URL=https://your-vercel-app.vercel.app
```

Add these only if you use the feature:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=https://your-render-service.onrender.com/api/auth/google/callback
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

After Render deploys, open:

```text
https://your-render-service.onrender.com/api/health
```

Expected result:

```json
{
  "status": "ok",
  "service": "PromptVault AI API",
  "environment": "production",
  "database": "connected"
}
```

## 2. Deploy Frontend On Vercel

Import the same GitHub repo into Vercel.

The included `vercel.json` already sets:

```text
Framework: Vite
Install Command: npm install
Build Command: npm run build --workspace client
Output Directory: client/dist
SPA Rewrite: enabled
```

Vercel environment variables:

```env
VITE_API_URL=https://your-render-service.onrender.com/api
VITE_RAZORPAY_KEY_ID=
```

Redeploy Vercel after changing `VITE_API_URL`; Vite reads env variables during build.

## 3. Connect Both Apps

After Vercel gives you a frontend URL, copy it into Render:

```env
CLIENT_URL=https://your-vercel-app.vercel.app
```

After Render gives you a backend URL, copy it into Vercel:

```env
VITE_API_URL=https://your-render-service.onrender.com/api
```

No trailing slash is needed.

## 4. MongoDB Atlas

In Atlas:

- Create a database user.
- Add the Render outbound IPs to Network Access, or use `0.0.0.0/0` temporarily while testing.
- Make sure `MONGO_URI` includes the database name, for example `/promptvault`.
- URL-encode special characters in the password.

## 5. Quick Checks

Backend:

```text
https://your-render-service.onrender.com/
https://your-render-service.onrender.com/api/health
https://your-render-service.onrender.com/api/prompts
```

Frontend:

```text
https://your-vercel-app.vercel.app
```

If frontend loads but data does not:

- Confirm Vercel `VITE_API_URL` includes `/api`.
- Confirm Render `CLIENT_URL` exactly matches the Vercel origin.
- Confirm `/api/health` says `database: "connected"`.
