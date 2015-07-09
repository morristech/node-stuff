var express = require("express"),
	morgan = require("morgan"),
	staticFiles = require("serve-static");

var app = express();

// Set the port to listen on
app.set("port", process.env.PORT || 3000);

// Set up logging
app.use(morgan("combined"));

// Set up static files within public
app.use(staticFiles("public"));

// Listen on the TCP port
app.listen(app.get("port"), function () {
	console.log("Listening on port " + app.get("port"));
});
