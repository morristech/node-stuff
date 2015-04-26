var express = require("express");
var partials = require("express-partials");
var ejs = require("ejs");

var app = express();

// Set Express to use the EJS view engine
app.engine("html", ejs.renderFile);
app.set("view engine", "html");

// Set up express to use layouts
app.use(partials());

// Anything under /client is served as a static file
app.use("/client", express.static("client"));

app.get("/", function(req, res) {
  res.render("index", {
    title: "Index Page (from index.js)"
  });
});

var server = app.listen(3000, function() {
  var port = server.address().port;
  console.log("Listening on http port %d", port);
});
