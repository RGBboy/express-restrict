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
    Storekeeper = require('storekeeper'),
    attach = require('attach'),
    siphon = require('siphon'),
    namedRoutes = require('express-named-routes'),
    authenticate = require('express-authenticate'),
    flash = require('express-flash'),
    UserSchema = require('basic-user-schema'),
    Signin = require('express-signin'),
    Signup = require('express-signup'),
    restrict = require('../index');

exports = module.exports = function (config) {

  var app = express(),
      shared = {
        schema: new Storekeeper().store,
        model: new Storekeeper().store
      },
      signin = Signin(shared),
      signup = Signup(shared),
      components = [
        signin,
        signup
      ];

  namedRoutes.extend(app);
  attach.extend(app);

  function init () {

    // Connect to DB
    if (!mongoose.connection.db) {
      mongoose.connect(config.db.url);
    };

    // Schemas
    shared.schema('User', UserSchema());

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
    app.use(authenticate(shared.model('User')));

    // Flash
    app.use(flash());

    // Define Routes
    app.defineRoute('signup', '/signup');
    app.defineRoute('signin', '/');

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

    // Attach components
    app.attach('signup', signup);
    app.attach('signin', signin);

    // Error Handler
    app.use(express.errorHandler());

  };

  // May need to change this incase the same schema is being stored.
  shared.schema.on('stored', function (name, schema) {
    var model = mongoose.model(name, schema);
    shared.model(name, model);
  });

  siphon('init', components, function () {
    init();
  });

  siphon('ready', components, function () {
    app.emit('ready');
  })

  return app;

};

// HTTPS

if (!module.parent) {
  var app = module.exports(config),
      server;
  app.on('ready', function () {
    server = https.createServer({
          key: fs.readFileSync(__dirname + '/ssl/key.pem'),
          cert: fs.readFileSync(__dirname + '/ssl/cert.pem')
        }, app);
    server.listen(8443);
    console.log('Application started on port 8443');
  });
};