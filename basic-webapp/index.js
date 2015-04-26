var express = require("express");
var app = express();

// Anything under /client is served as a static file
app.use("/client", express.static("client"));

app.get("/", function(req, res) {
  res.redirect("/client/index.html");
});

var server = app.listen(3000, function() {
  var port = server.address().port;
  console.log("Listening on http port %d", port);
});
