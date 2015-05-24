/*eslint-env node */

"use strict";

var express = require("express"),
    passport = require("passport"),
    path = require("path"),
    config = require("../config.json"),
    spells = require("../data/spells.json");


var router = express.Router(), // eslint-disable-line new-cap
    controller = path.basename(__filename, ".js");

function get_login_api() {
  var connections = config.passport.auth0.connections || [],
      r = {},
      buildurl = function(provider) {
        var server = config.server.uri || "http://localhost:3000";
        var url = "https://" + config.passport.auth0.domain + "/authorize" +
          "?response_type=code&scope=openid%20profile" +
          "&client_id=" + config.passport.auth0.clientid +
          "&redirect_uri=" + server + "/" + controller + "/external-callback" +
          "&connection=" + provider;
        return url;
      };

  for (var i = 0; i < connections.length; i++) {
    r[connections[i].replace("-","_")] = buildurl(connections[i]);
  }

  return r;
}

function get_all_spells(req, res) {
  // If the user is not authenticated, only show spells on level
  // 1 or the cantrips.
  if (!req.isAuthenticated()) {
    var spell_list = spells.filter(function(o) {
      return (o.Level === "Cantrip" || o.Level === 1);
    });
    res.status(200).json(spell_list);
    return;
  } else {
    // User is authenticated - show all the spells
    res.status(200).json(spells);
  }
}

function get_one_spell(req, res) {
  // If the user is not authenticated, tell them to authenticate
  if (!req.isAuthenticated()) {
    res.status(511).json(get_login_api());
    return;
  }

  // Figure out what ID we are actually looking for.  If it is non-numeric,
  // then throw a "Not Found" error back to the user.
  try {
    if (req.params && req.params.id) {
      var id = parseInt(req.params.id);
    } else {
      res.status(404).json({ error: "Spell ID must be numeric" });
      return;
    }
  } catch (e) {
    res.status(404).json({ error: "Spell ID is always a number" });
    return;
  }

  // Find the spell by ID - returns empty array if not found
  var spell = spells.filter(function(o) {
    return o._id === id;
  });
  if (spell === undefined || spell.length === 0) {
    res.status(404).json({ error: "Spell ID Not Found" });
  } else {
    res.status(200).json(spell[0]);
  }
}

router.get("/spells", get_all_spells);
router.get("/spells/:id", get_one_spell);

module.exports = router;
