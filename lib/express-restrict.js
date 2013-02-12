/*!
 * express-restrict
 * Copyright(c) 2012 RGBboy <me@rgbboy.com>
 * MIT Licensed
 *
 * @todo Change redirect to signin page using req.routeToPath('signin')
 */

/**
 * Module Dependencies
 */

var util = require('util');

/**
 * Library version.
 */

exports.version = '0.0.2';

/**
 * Return a middleware function for testing user[field] against values
 *
 * @param {String|Array} field
 * @return {Function} middleware function
 * @api public
 */
exports.to = function (field, values) {

  var test;

  if (util.isArray(values)) {
    test = function (value) {
      return values.indexOf(value) !== -1;
    };
  } else {
    test = function (value) {
      return values === value;
    };
  };

  return function (req, res, next) {

    if (req.authenticatedUser) {
      if (test(req.authenticatedUser[field])) {
        next();
      } else {
        req.flash('warning', 'Restricted Area');
        res.redirect('/');
      };
    } else {
      req.flash('warning', 'Please sign in');
      req.session.redirect = req.url;
      res.redirect(req.routeToPath('signin.index')); // Change this to redirect to signin page
    }

  };

};
