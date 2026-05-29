import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import { signToken } from '../middleware/authMiddleware.js';

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
      },
      async (accessToken, refreshToken, profile, done) => {
        const email = profile.emails?.[0]?.value;
        const user = await User.findOneAndUpdate(
          { email },
          { name: profile.displayName, email, googleId: profile.id, avatar: profile.photos?.[0]?.value, isVerified: true },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        user.token = signToken(user._id);
        done(null, user);
      }
    )
  );
}

export default passport;
