import app from './app.js';
import connectDB from './config/db.js';

const port = process.env.PORT || 5001;
const isProduction = process.env.NODE_ENV === 'production';

function validateEnvironment() {
  const required = isProduction ? ['MONGO_URI', 'JWT_SECRET', 'CLIENT_URL'] : [];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error(`Missing required production environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
}

validateEnvironment();

const server = app.listen(port, () => {
  console.log(`PromptVault API running on port ${port}`);
  console.log(`Health check available at /api/health`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Stop the existing process or set PORT=5001 in server/.env.`);
    process.exit(1);
  }
  throw error;
});

connectDB().catch((error) => {
  console.error('MongoDB connection failed. API health is still available, but database routes will fail until this is fixed.');
  if (process.env.NODE_ENV !== 'production') console.error(error.message);
});
