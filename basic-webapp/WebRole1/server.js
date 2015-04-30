/*eslint-env node */

"use strict";

var express = require("express"),
    http = require("http"),
    path = require("path"),
    fs = require("fs"),
    partials = require("express-partials"),
    ejs = require("ejs"),
    passport = require("passport"),
    cookieParser = require("cookie-parser"),
    session = require("express-session"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    favicon = require("serve-favicon");

/**
 * Configure the Express server to serve up the application
 * @param {express} app - the express application object
 * @return - the express application object (pipelining allowed)
 */
function configure(app) {
  // Load the server configuration file
  console.info("Loading Server Configuration");
  var config = require("./config.json");

  // Load the authentication strategy
  console.info("Loading Authentication Strategy");
  var authStrategy = require("./auth0-strategy"); // eslint-disable-line no-unused-vars

  // Set up the port that the server will listen on
  console.info("Setting Listening port");
  app.set("port", process.env.PORT || config.server.port || 3000);

  // Set up the location of the views
  console.info("Setting view location");
  app.set("views", path.join(__dirname, "views"));

  // Set Express to use the EJS view engine
  console.info("Configuring view engine");
  app.engine("html", ejs.renderFile);
  app.set("view engine", "html");

  // Set up express to use layouts with the default layout being in
  // /views/Shared/layout.html
  console.info("Configuring layout engine");
  app.set("view options", { defaultLayout: "Shared/layout" });
  app.use(partials());

  // Set up express to use the passport authentication middleware
  console.info("Configuring Passport authentication");
  app.use(cookieParser());
  app.use(session({
    secret: "app-secret",
    resave: false,
    saveUninitialized: false,
    unset: "destroy"
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  // Set up static file serving
  console.info("Configuring static file serving");
  app.use("/client", express.static(path.join(__dirname, "client")));

  // Provide middleware for decoding JSON, URL-encoded body parts
  console.info("Loading Body Parser Middleware");
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  // Allows a controller to override HTTP verbs such as PUT or DELETE
  console.info("Loading Method Overrides");
  app.use(methodOverride());

  // Serve up a default favicon
  console.info("Configuring favicon");
  app.use(favicon(path.join(__dirname, "client/favicon.ico")));

  // Dynamically include controllers in the controllers directory
  console.info("Loading Controllers");
  fs.readdirSync("./controllers").forEach(function (file) {
    if (file.substr(-3) === ".js") {
      console.info("Loading Controller " + file);
      var base = "/" + path.basename(file, ".js");
      var route = require("./controllers/" + file);
      app.use(base, route);
    }
  });

  console.info("Configuring Home Controller");
  app.get("/", function(req, res) {
    res.redirect("/home");
  });

  // Return the app so we can pipeline
  console.info("Finished configuring server");
  return app;
}

/*
 * Configure the application
 */
var server = configure(express());
http.createServer(server).listen(server.get("port"), function () {
  console.info("Express Server listening on port " + server.get("port"));
});
