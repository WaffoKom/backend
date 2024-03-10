import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import User from "../../models/user.models.js";
import { generateToken } from "./utils/help.js";
import jwt from "jsonwebtoken";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// Fonction de génération de jeton JWT (en utilisant une fonction fléchée)

const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const secret = process.env.JWT_SECRET;
  const options = {
    expiresIn: "1h", // Durée de vie du jeton (modifiable)
  };

  return jwt.sign(payload, secret, options);
};

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user));
});

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      const email = profile.emails[0].value;
      const googleId = profile.id;

      try {
        const user = await User.findOne({ $or: [{ email }, { googleId }] });

        if (!user) {
          const newUser = new User({
            name: profile.displayName,
            email,
            googleId,
            role: "user",
          });
          await newUser.save();
          return done(null, { user: newUser, token: generateToken(newUser) });
        }

        return done(null, { user, token: generateToken(user) });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
