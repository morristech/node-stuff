/*eslint-env node */

"use strict";

var passport = require("passport"),
    Auth0Strategy = require("passport-auth0"),
    config = require("./config.json");

var strategy = new Auth0Strategy({
  domain: config.passport.auth0.domain,
  clientID: config.passport.auth0.clientid,
  clientSecret: config.passport.auth0.clientsecret,
  callbackURL: "/account/external-callback"
}, function(accessToken, refreshToken, extraParams, profile, done) {
  return done(null, profile);
});

passport.use(strategy);

// This is not a best practice, but we want to keep things simple for now
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = strategy;
