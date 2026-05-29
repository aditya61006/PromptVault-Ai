import mongoose from 'mongoose';

export default async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn('MONGO_URI missing. API can start, but database operations will fail until configured.');
    return;
  }
  mongoose.set('strictQuery', true);
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (error) {
    if (error?.code === 8000 || /auth/i.test(error?.message || '')) {
      console.error(
        'MongoDB authentication failed. Check that MONGO_URI uses an Atlas Database Access user/password, URL-encodes special characters in the password, and includes the target database name.'
      );
    }
    throw error;
  }
}
