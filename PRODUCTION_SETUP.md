# Prompt Vault Production Setup

## Current Architecture

```text
prompthub/
  client/
    src/components
    src/pages
    src/services
    src/redux
    src/hooks
    src/utils
  server/
    src/config
    src/controllers
    src/middleware
    src/models
    src/routes
    src/services
    src/utils
```

## Required Environment Variables

Backend `server/.env`:

```env
NODE_ENV=production
PORT=5001
CLIENT_URL=https://your-frontend-domain.com
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_long_random_jwt_secret
JWT_EXPIRES_IN=15m
COOKIE_EXPIRES_DAYS=7
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://your-backend-domain.com/api/auth/google/callback
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
FROM_EMAIL=no-reply@yourdomain.com
```

Frontend `client/.env`:

```env
VITE_API_URL=https://your-backend-domain.com/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## Commands

Install and run each app from its own folder.

Backend:

```bash
cd server
npm install
npm run dev
npm run seed
```

Frontend:

```bash
cd client
npm install
npm run dev
npm run build
```

## Deployment

Frontend on Vercel or Netlify:

```text
Root: client
Build command: npm run build
Output directory: dist
```

Backend on Render, Railway, or VPS:

```text
Root: server
Build command: npm install
Start command: npm start
```

MongoDB Atlas:

- Enable database user with strong password.
- Restrict Network Access to deployed backend IPs where possible.
- Enable backups.
- Create indexes from Mongoose models by running the app once against production.

## Security Checklist

- Rotate secrets before production.
- Do not commit `.env`.
- Use HTTPS only in production.
- Set `NODE_ENV=production`.
- Configure `CLIENT_URL` to exact deployed frontend origin.
- Use Razorpay webhooks with signature validation.
- Keep admin accounts minimal.
- Review `AuditLog` collection regularly.

## Functional Testing Checklist

- Register normal user.
- Login normal user.
- Confirm `/admin` is blocked for normal user.
- Login admin.
- Create, edit, archive prompt from `/admin/prompts`.
- Verify prompt appears on `/explore`.
- Open prompt detail page.
- Bookmark prompt.
- Create Razorpay test order.
- Verify payment and prompt unlock.
- Confirm purchase appears in history.
- Test forgot/reset password.
- Test Google OAuth callback.

## Remaining Recommendations

- Add Redis caching for public prompt list endpoints.
- Add real SMTP templates for verification/reset emails.
- Add Playwright end-to-end tests.
- Add CI pipeline for build and backend syntax checks.
- Add image transformation presets in Cloudinary.
- Add database backup monitoring alerts in Atlas.
