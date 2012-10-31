/*!
 * express-restrict example
 */

/**
 * Module dependencies.
 */

var express = require('express'),
    fs = require('fs'),
    https = require('https'),
    app = module.exports = express(),
    config = require('./config'),
    mongoose = require('mongoose'),
    namedRoutes = require('express-named-routes'),
    authenticate = require('express-authenticate'),
    flash = require('express-flash'),
    User = require('basic-user-model'),
    signin = require('express-signin'),
    signup = require('express-signup'),
    restrict = require('../index');

namedRoutes.extend(app);

// Connect to DB
if (!mongoose.connection.db) {
  mongoose.connect(config.db.url);
};

// Views
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', { layout: false });

// Configuration
app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));

app.use(express.cookieParser(config.cookieSecret));
app.use(express.session({ cookie: { maxAge: 60000 }}));

// Authenticate
app.use(authenticate(User));

// Flash
app.use(flash());

// Signin
var signinComponent = signin(User);
app.defineRoute('signin', signinComponent.lookupRoute()); //make signin route accessible to restrict module
app.use(signinComponent);

// Signup
app.use(signup('/signup', User));

// Routes
app.get('/', function (req, res) {
  res.render('index', {
    title: 'Home'
  });
});

app.get('/restrict-to-user-and-admin', restrict.to('role', ['user', 'admin']), function (req, res) {
  res.render('index', {
    title: 'Restrict To User And Admin',
  });
});

app.get('/restrict-to-admin', restrict.to('role', 'admin'), function (req, res) {
  res.render('index', {
    title: 'Restrict To Admin',
  });
});

// Error Handler
app.use(express.errorHandler());

// HTTPS

var server = module.exports = https.createServer({
  key: fs.readFileSync(__dirname + '/ssl/key.pem'),
  cert: fs.readFileSync(__dirname + '/ssl/cert.pem')
}, app);

/**
 * Module exports.
 */

if (!module.parent) {
  server.listen(8000);
  console.log('Express app started on port 8000');
};