
/**
 * Module dependencies.
 */

var object;

try {
  object = require('object');
} catch(e){
  object = require('object-component');
}

/**
 * Module exports.
 */

module.exports = minify;

/**
 * Minifies a `query` based on `fields`.
 *
 * @param {Object] query
 * @param {Object} fields
 * @api public
 */

function minify(qry, fields){
  var mods = object.keys(qry);
  var keys = object.keys(fields);

  if (!keys.length) return qry;
  if (!mods.length || '$' != mods[0][0]) return qry;

  // determine field types
  var excluded = [];
  var included = [];

  for (var i = 0; i < keys.length; i++) {
    if (0 == fields[keys[i]]) {
      excluded.push(keys[i]);
    } else {
      included.push(keys[i]);
    }
  }

  // go through keys
  var obj = {};

  for (var i = 0, l = mods.length; i < l; i++) {
    var mod = mods[i];

    each_key:
      for (var key in qry[mod]) {
        if (qry[mod].hasOwnProperty(key)) {
          var checks = [];
          var pieces = key.split('.');
          for (var ii = 0, ll = pieces.length; ii < ll; ii++) {
            checks.push(pieces.slice(0, ii + 1).join('.'));
          }

          var kept;

          // having at least one exclusion makes us ignore inclusions
          if (excluded.length) {
            kept = true;
            for (var ii = 0, ll = checks.length; ii < ll; ii++) {
              if (~excluded.indexOf(checks[ii])) {
                continue each_key;
              }
            }
          } else {
            kept = false;
            for (var ii = 0, ll = checks.length; ii < ll; ii++) {
              if (~included.indexOf(checks[ii])) {
                kept = true;
              }
            }
          }

          if (kept) {
            if (!obj[mod]) obj[mod] = {};
            obj[mod][key] = qry[mod][key];
          }
        }
      }
  }

  return obj;
}
