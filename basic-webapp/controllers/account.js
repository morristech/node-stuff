/*eslint-env node */

"use strict";

var express = require("express"),
    passport = require("passport"),
    path = require("path"),
    config = require("../config.json");


var router = express.Router(), // eslint-disable-line new-cap
    controller = path.basename(__filename, ".js");

/**
 * Build a URL for a specific provider based on the configuration and
 * the provider name
 */
function buildurl(provider) {
  var server = config.server.uri || "http://localhost:3000";

  var url = "https://" + config.passport.auth0.domain + "/authorize" +
    "?response_type=code&scope=openid%20profile" +
    "&client_id=" + config.passport.auth0.clientid +
    "&redirect_uri=" + server + "/" + controller + "/external-callback" +
    "&connection=" + provider;

  return url;
}

/**
 * GET /{controller}/login
 */
function login(req, res) {
  var locals = {
    layout: false,
    connections: {}
  };
  var connections = config.passport.auth0.connections || [];
  for (var i = 0; i < connections.length; i++) {
    locals.connections[connections[i].replace("-","_")] = buildurl(connections[i]);
  }

  res.render(controller + "/login.html", locals);
}

/**
 * GET /{controller}/logout
 */
function logout(req, res) {
  req.logout();
  res.redirect("/");
}

// Wire up Per-route functionality
router.get("/login", login);
router.get("/logout", logout);

// Social Identity callback - set this in the Auth0 Manage App page
router.get(
  "/external-callback",
  passport.authenticate("auth0", {
    failureRedirect: "/" + controller + "/failure-callback"
  }),
  function (req, res) {
    if (!req.user) {
      throw new Error("user is null");
    }
    res.redirect("/");
  }
);

module.exports = router;
