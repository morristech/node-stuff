/*
 * Node Server Bootstrap
 */
"use strict";

var https = require("https"),
    logManager = require("./logging"),
    app = require("./application"),
    config = require("./configuration");

var logger = logManager.getLogger("bootstrap");

https.createServer(config.https, app).listen(app.get("port"), config.host, function () {
    logger.info("Listening on HTTPS Port %d", app.get("port"));
});
