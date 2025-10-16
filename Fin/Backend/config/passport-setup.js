const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

        // Try to find by googleId first
        let user = await User.findOne({ googleId: profile.id });

        // If not found, try by email to link existing account
        if (!user && email) {
          user = await User.findOne({ email });
        }

        if (!user) {
          // Create a new user for Google auth
          user = await User.create({
            fullName: profile.displayName || (email ? email.split('@')[0] : 'Google User'),
            email,
            googleId: profile.id,
            profileimageurl: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
          });
        } else if (!user.googleId) {
          // Link googleId to existing account
          user.googleId = profile.id;
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// If sessions were used, we would serialize/deserialize. Not needed with session:false.

module.exports = passport;