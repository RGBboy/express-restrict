# Express Restrict

  User restrictions for your Express Application.

  [![Build Status](https://secure.travis-ci.org/RGBboy/express-restrict.png)](http://travis-ci.org/RGBboy/express-restrict)

## Installation

  Works with Express 3.0.x

    npm install git://github.com/RGBboy/express-restrict.git

## Usage

  Use `restrict` as middleware in your routes to grant/deny access to a resource:

``` javascript
  var restrict = require('express-restrict'),
      authenticate = require('express-authenticate'),
      flash = require('express-flash'),
      express = require('express'),
      app = express();

  app.use(express.cookieParser('miyahamiyahimiyahemiyahoho'));
  app.use(express.session({ cookie: { maxAge: 60000 }}));
  app.use(authenticate());
  app.use(flash());

  app.get('/restrict-to-admin', restrict.to('role', 'admin'), function (req, res) {
    res.send('Admin Access Granted');
  });

  app.get('/restrict-to-user-and-admin', restrict.to('role', ['user', 'admin']), function (req, res) {
    res.send('User and Admin Access Granted');
  });

```

## Redirection

When a resource is restricted, users that are not authenticated will be redirected to your signin path.

Users that are authenticated and are restricted will be redirected to the root path '/'.

## Requires

### Middleware

  The following middleware should be used by the application to use the 
  Restrict Component:

  * express.cookieParser
  * express.session
  * express-authenticate
  * express-flash
  * express-named-routes

### Express Named Routes

  Express Restrict requires a path to be returned for the 'signin' route via the `request.routeToPath` method.

## Setting Up Development

  In order to develop and run tests with the supplied example you will need to set up MongoDB with two databases:

  * express-restrict-dev
  * express-restrict-test

The usernames and passwords for each are the same as their database names.

## Todo

  * Write process helpers for other components to use for integration tests.
  * Update usage to include setting express-named-routes and 'signin' route.

## License 

(The MIT License)

Copyright (c) 2012 RGBboy &lt;me@rgbboy.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
