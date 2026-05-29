import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';

dotenv.config();

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`PromptVault API running on port ${port}`);
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
