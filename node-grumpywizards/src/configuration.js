"use strict";

var fs = require("fs"),
    path = require("path"),
    objectAssign = require("object-assign"),
    logManager = require("./logging");

var logger = logManager.getLogger("configuration");

    // List of all the options and their default values
var defaultOptions = {
    port: 3000,
    host: "localhost",
    defaultRoute: "/home",
    https: {
        ciphers: "ECDHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA256:AES128-GCM-SHA256:RC4:HIGH:!MD5:!aNULL",
        honorCipherOrder: true
    },
    views: {
        directory: path.join(__dirname, "views"),
        options: {
            defaultLayout: "_layouts/main"
        }
    },
    controllers: {
        directory: path.join(__dirname, "controllers")
    },
    session: {
        options: {
            secret: "app-secret",
            resave: false,
            saveUninitialized: false,
            unset: "destroy"
        }
    },
    staticFiles: {
        directory: path.join(__dirname, "static"),
        favicon: path.join(__dirname, "static/favicon.ico"),
        options: {
            dotfiles: "ignore",
            etag: true,
            index: ["index.html", "index.htm"],
            lastModified: true,
            redirect: true
        }
    }
};

var configurationPath = path.resolve(path.join(__dirname, "../config")),
    mainConfigFile = path.join(configurationPath, "config.json"),
    localConfigFile = path.join(configurationPath, "config-local.json");

logger.debug("Loading %s", mainConfigFile);
var mainConfig = require(mainConfigFile) || {};
logger.debug("Loading %s", localConfigFile);
var localConfig = require(localConfigFile) || {};

// Create a environment override object
var envOverrides = {};
// If the following environment variables exist, then use them
//      PORT => options.port
//      HOST => options.host
//      CERTPASSPHRASE => options.https.passphrase
if (process.env.PORT) {
    logger.debug("Loading Environment override for PORT");
    envOverrides.port = process.env.PORT;
}
if (process.env.HOST) {
    logger.debug("Loading Environment override for HOST");
    envOverrides.host = process.env.HOST;
}
if (process.env.CERTPASSPHRASE) {
    logger.debug("Loading Environment override for CERTPASSPHRASE");
    envOverrides.https.passphrase = process.env.CERTPASSPHRASE;
}

// Merge the default, main and local options
logger.debug("Merging Configurations");
var options = objectAssign(defaultOptions, mainConfig, localConfig, envOverrides);

// If the following options exist, then load them from the file into a Buffer
//      options.https.pfx
//      options.https.cert
//      options.https.key
//      options.https.ca
var fixFilename = function (fn) {
    if (fn[0] !== "/" && fn[1] !== ":") {
        return path.resolve(path.join(__dirname, fn));
    } else {
        return fn;
    }
};

if (options.https.pfx) {
    logger.debug("Loading PFX File %s", fixFilename(options.https.pfx));
    options.https.pfx = fs.readFileSync(fixFilename(options.https.pfx));
}
if (options.https.cert) {
    logger.debug("Loading CERT File %s", fixFilename(options.https.cert));
    options.https.cert = fs.readFileSync(fixFilename(options.https.cert));
}
if (options.https.key) {
    logger.debug("Loading KEY File %s", fixFilename(options.https.key));
    options.https.key = fs.readFileSync(fixFilename(options.https.key));
}
if (options.https.ca) {
    logger.debug("Loading CA File %s", fixFilename(options.https.ca));
    options.https.ca = fs.readFileSync(fixFilename(options.https.ca));
}

// Export the modified configuration
module.exports = options;
