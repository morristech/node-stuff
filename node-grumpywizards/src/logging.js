"use strict";

var fs = require("fs"),
    log4js = require("log4js"),
    objectAssign = require("object-assign"),
    path = require("path");

var defaultConfig = {
    appenders: [
        { type: "console" }
    ]
};

// You can't use ./configuration.js - you have to use a separate log4js.json
// because ./configuration uses logging and you need to explicitly avoid a
// circular reference loop.
var configFile = path.resolve(path.join(__dirname, "../config/log4js.json"));
var loadedConfig = fs.exists(configFile) ? require(configFile) : {};
var log4jsConfig = objectAssign(defaultConfig, loadedConfig);

// Configure log4js with the merged file
log4js.configure(log4jsConfig);

module.exports = log4js;
