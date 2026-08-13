// google login strategy - finds an existing user by googleId/email or creates a fresh one
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const env = require('./env');
const db = require('./db');

// Enable Google OAuth only when credentials are configured.
// This allows the backend to run locally without Google OAuth credentials.
if (env.googleClientId && env.googleClientSecret) {
  passport.use(
      new GoogleStrategy(
          {
            clientID: env.googleClientId,
            clientSecret: env.googleClientSecret,
            callbackURL: env.googleCallbackUrl,
          },
          async function findOrCreateGoogleUser(accessToken, refreshToken, profile, done) {
            try {
              const email = profile.emails?.[0]?.value;

              let existingUser = await db.user.findFirst({
                where: { OR: [{ googleId: profile.id }, { email }] },
              });

              if (!existingUser) {
                const studentRole = await db.role.findUnique({
                  where: { name: 'student' },
                });

                existingUser = await db.user.create({
                  data: {
                    name: profile.displayName,
                    email,
                    googleId: profile.id,
                    avatarUrl: profile.photos?.[0]?.value,
                    isEmailVerified: true,
                    roleId: studentRole.id,
                  },
                });
              } else if (!existingUser.googleId) {
                existingUser = await db.user.update({
                  where: { id: existingUser.id },
                  data: { googleId: profile.id },
                });
              }

              return done(null, existingUser);
            } catch (error) {
              return done(error, null);
            }
          }
      )
  );
} else {
  console.log('Google OAuth credentials not configured. Google login is disabled.');
}

module.exports = passport;