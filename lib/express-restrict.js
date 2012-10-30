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

// None yet

/**
 * Library version.
 */

exports.version = '0.0.1';

/**
 * Return a middleware function for testing user[field] against values
 *
 * @param {String|Array} field
 * @return {Function} middleware function
 * @api public
 */
exports.to = function (field, values) {

  return function (req, res, next) {

    if (req.authenticatedUser) {
      if (values.indexOf(req.authenticatedUser[field]) !== -1) {
        next();
      } else {
        req.flash('warning', 'Restricted Area');
        res.redirect('/');
      };
    } else {
      req.flash('warning', 'Please sign in');
      // req.session.redirect = req.url;
      res.redirect(req.routeToPath('signin')); // Change this to redirect to signin page
    }

  };

};
