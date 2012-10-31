var environment =  process.env.NODE_ENV || 'development';

var config = {
  development: {
    cookieSecret: '23vdh23llfk949038hckjd3',
    db: {
      url: 'mongodb://express-restrict-dev:express-restrict-dev@localhost/express-restrict-dev'
    }
  },
  test: {
    cookieSecret: '23vdh23llfk949038hckjd3',
    db: {
      url: 'mongodb://express-restrict-test:express-restrict-test@localhost/express-restrict-test'
    }
  }
};

exports = module.exports = config[environment];