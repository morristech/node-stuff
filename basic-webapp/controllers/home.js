/*eslint-env node */

"use strict";

var express = require("express"),
    path = require("path"),
    config = require("../config.json"),
    extend = require("extend");

var router = express.Router(), // eslint-disable-line new-cap
    controller = path.basename(__filename, ".js"),
    loginRoute = config.loginRoute || "/account/login";

/**
 * Set of default properties for the rendering engine
 */
function defaultProperties(req) {
  return {
    title: "Unknown",   // Default title in case the developer doesn't set one
    user: req.user
  };
}

/**
 * GET /{controller=Home}/index
 */
function index(req, res) {
  if (!req.isAuthenticated()) {
    res.redirect(loginRoute);
    return;
  }
  res.render(controller + "/index.html", extend({}, defaultProperties(req), {
    title: "Home"
  }));
}

// Per-route functionality
router.get("/index", index);

// Default route is to GET index
router.get("/", index);

module.exports = router;
