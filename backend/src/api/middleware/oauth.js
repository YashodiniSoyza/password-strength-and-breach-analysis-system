const passport = require('passport');
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
import 'dotenv/config';

passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8090/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    return done(null,profile);
  }
));

passport.serializeUser(function(user,done) {
    done(null, user);
})
passport.deserializeUser(function(user,done) {
    done(null, user);
})