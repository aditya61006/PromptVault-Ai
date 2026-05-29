# PromptVault AI

Premium MERN prompt marketplace and community platform for AI prompts across ChatGPT, Midjourney, Claude, Gemini, Stable Diffusion, Sora, Suno, and more.

## Stack

- Frontend: React, Vite, Tailwind CSS, Framer Motion, Redux Toolkit, React Router, TanStack Query, Axios, React Hook Form
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, Razorpay, Multer, Cloudinary, Helmet, rate limiting
- Deployment: Vercel or Netlify for `client`, Render or Railway for `server`, MongoDB Atlas, Cloudinary CDN

## Local Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy backend env:
   ```bash
   cp server/.env.example server/.env
   ```
3. Fill `MONGO_URI`, `JWT_SECRET`, Razorpay, Cloudinary, and Google OAuth keys.
4. Run both apps:
   ```bash
   npm run dev
   ```

Frontend runs on `http://localhost:5173`. Backend runs on `http://localhost:5000`.

## API Surface

- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/prompts`, `GET /api/prompts/:id`, `POST /api/prompts`
- `POST /api/payments/create-order`, `POST /api/payments/verify`, `POST /api/payments/webhook`
- `GET /api/reviews/:promptId`, `POST /api/reviews/:promptId`
- `GET /api/creator/dashboard`
- `GET /api/admin/stats`, `PATCH /api/admin/prompts/:id/moderate`

## Notes

The frontend includes demo data so the polished UI works immediately. Connect `VITE_API_URL` and replace mock reads with `promptService` calls as your Atlas database fills up.
