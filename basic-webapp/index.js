var express = require("express"),
    partials = require("express-partials"),
    ejs = require("ejs"),
    passport = require("passport"),
    cookieParser = require("cookie-parser"),
    session = require("express-session"),
    auth0strategy = require("./auth0-strategy");

var app = express();

// Set Express to use the EJS view engine
app.engine("html", ejs.renderFile);
app.set("view engine", "html");

// Set up express to use layouts
app.use(partials());

// Set up express to use the passport authentication middleware
app.use(cookieParser());
app.use(session({ secret: "my-little-secret" }));
app.use(passport.initialize());
app.use(passport.session());

// Anything under /client is served as a static file
app.use("/client", express.static("client"));

// Serve up pages - Callback handler from Auth0
app.get("/callback",
  passport.authenticate("auth0", {
    failureRedirect: "/client/failure.html"
  }),
  function(req, res) {
    if (!req.user) {
      throw new Error("user is null");
    }
    console.log("User is %o", req.user);
    res.redirect("/");
  }
);

// Serve up pages - Home Page
app.get("/", function(req, res) {
  if (!req.isAuthenticated()) {
    res.redirect("/client/login.html");
  } else {
    res.render("index", {
      title: "Index Page (from index.js)",
      user: req.user
    });
  }
});


var server = app.listen(3000, function() {
  var port = server.address().port;
  console.log("Listening on http port %d", port);
});
