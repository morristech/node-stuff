"use strict";

var config = require("./configuration"),
    logManager = require("./logging");

var bodyParser = require("body-parser"),
    cookieParser = require("cookie-parser"),
    ejs = require("ejs"),
    express = require("express"),
    favicon = require("serve-favicon"),
    fs = require("fs"),
    methodOverride = require("method-override"),
    partials = require("express-partials"),
    path = require("path"),
    serveStatic = require("serve-static"),
    session = require("express-session");

var app = express(),
    logger = logManager.getLogger("express");

var resolvePath = function (fn) {
    if (fn[0] !== "/" && fn[1] !== ":") {
        return path.resolve(path.join(__dirname, fn));
    } else {
        return fn;
    }
};

// Set up the configuration
logger.debug("Configuring Express Basic Settings");
app.set("port", config.port);
app.set("views", resolvePath(config.views.directory));

// Install the logger
app.use(logManager.connectLogger(logger, { level: logManager.levels.INFO }));

// Install the View Engine
logger.debug("Configuring View Engine");
app.engine("html", ejs.renderFile);
app.set("view engine", "html");
app.set("view options", config.views.options);
app.use(partials());

// Session Management
logger.debug("Configuring Session Management");
app.use(cookieParser());
app.use(session(config.session.options));

// HTTP Stream handling
logger.debug("Configuring HTTP Stream Handling");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

// Static File Area
logger.debug("Configuring Static File Service");
app.use(serveStatic(resolvePath(config.staticFiles.directory), config.staticFiles.options));
logger.debug("Configuring favicon to be %s", resolvePath(config.staticFiles.favicon));
app.use(favicon(resolvePath(config.staticFiles.favicon)));

// Controllers
var controllerPath = resolvePath(config.controllers.directory);
logger.debug("Loading Controllers from %s", controllerPath);
fs.readdirSync(controllerPath).forEach(function (file) {
    if (file.substr(-3) === ".js") {
        logger.debug("Loading Controller " + file);
        app.use("/" + path.basename(file, ".js"),
            require(path.join(controllerPath, file)));
    }
});

// Get a redirect from / to the default Route
console.log("Installing home page redirect to %s", config.defaultRoute);
app.get("/", (req, res)=> res.redirect(config.defaultRoute));

module.exports = app;
