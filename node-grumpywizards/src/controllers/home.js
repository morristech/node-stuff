"use strict";

var express = require("express"),
    objectAssign = require("object-assign"),
    path = require("path");

var controller = path.basename(__filename, ".js"),
    router = express.Router();      // eslint-disable-line new-cap

var mkPath = function (view) {
    return controller + "/" + view + ".html";
};

var defaultProperties = {
    title: "Not Set"
};

router.get("/index", function (req, res) {
    res.render(mkPath("index"), objectAssign(defaultProperties, {}));
});

// The bare-controller version just redirects to the proper thing
router.get("/", function (req, res) {
    res.redirect("/" + controller + "/index");
});

module.exports = router;

