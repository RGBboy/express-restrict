/**
 * express-restrict unit tests
 */

/**
 * Module dependencies.
 */

var should = require('should'),
    sinon = require('sinon'),
    restrict = require('../');

describe('Restrict', function () {

  describe('.version', function () {

    it('should match the format x.x.x', function (done) {
      restrict.version.should.match(/^\d+\.\d+\.\d+$/);
      done();
    });

  });

  describe('.to', function () {

    it('should return a function', function (done) {
      restrict.to().should.be.a('function');
      done();
    });

    describe('returned function', function () {

      var fakeErr,
          fakeReq,
          fakeRes,
          fakeNext,
          returnedFunction,
          signinPath = '/signin-path';

      beforeEach(function (done) {
        fakeReq = {
          flash: function () {},
          authenticatedUser: {},
          routeToPath: function (routeName) {
            return signinPath;
          }
        };
        fakeRes = {
          redirect: function () {}
        };
        fakeNext = sinon.stub();
        done();
      });

      describe('when request.authenticatedUser does not exist', function () {

        beforeEach(function (done) {
          delete fakeReq.authenticatedUser;
          returnedFunction = restrict.to('role', 'user');
          done();
        });

        it('should add a warning to request.flash', function (done) {
          fakeReq.flash = function (type, message) {
            type.should.equal('warning');
            message.should.equal('Please sign in');
            done();
          }
          returnedFunction(fakeReq, fakeRes, fakeNext);
        });

        it('should redirect to signin route', function (done) {
          fakeRes.redirect = function (route) {
            route.should.equal(signinPath);
            done();
          };
          returnedFunction(fakeReq, fakeRes, fakeNext);
        });

        it('should not call next', function (done) {
          returnedFunction(fakeReq, fakeRes, fakeNext);
          fakeNext.calledOnce.should.be.false;
          done();
        });

      });

      describe('when passed a string', function () {

        beforeEach(function (done) {
          fakeReq.authenticatedUser = { role: 'super-admin' };
          returnedFunction = restrict.to('role', 'super-admin');
          done();
        });

        describe('when property matches the authenticated users', function () {

          it('should call next without an error', function (done) {
            returnedFunction(fakeReq, fakeRes, fakeNext);
            fakeNext.calledOnce.should.be.true;
            fakeNext.calledWithExactly().should.be.true;
            done();
          });

        });

        describe('when property does not match the authenticated users', function () {

          beforeEach(function (done) {
            fakeReq.authenticatedUser = { role: 'admin' };
            returnedFunction = restrict.to('role', 'super-admin');
            done();
          });

          it('should add a warning to request.flash', function (done) {
            fakeReq.flash = function (type, message) {
              type.should.equal('warning');
              message.should.equal('Restricted Area');
              done();
            }
            returnedFunction(fakeReq, fakeRes, fakeNext);
          });

          it('should redirect to index', function (done) {
            fakeRes.redirect = function (route) {
              route.should.equal('/');
              done();
            };
            returnedFunction(fakeReq, fakeRes, fakeNext);
          });

          it('should not call next', function (done) {
            returnedFunction(fakeReq, fakeRes, fakeNext);
            fakeNext.called.should.be.false;
            done();
          });

        });

      });

      describe('when passed an array', function () {

        beforeEach(function (done) {
          fakeReq.authenticatedUser = { role: 'super-admin' };
          returnedFunction = restrict.to( 'role', ['testRole', 'super-admin'] );
          done();
        });

        describe('when property matches the authenticated users', function () {

          it('should call next without an error', function (done) {
            returnedFunction(fakeReq, fakeRes, fakeNext);
            fakeNext.calledOnce.should.be.true;
            fakeNext.calledWithExactly().should.be.true;
            done();
          });

        });

        describe('when property does not match the authenticated users', function () {

          beforeEach(function (done) {
            fakeReq.authenticatedUser = { role:'admin' };
            done();
          });

          it('should add a warning to request.flash', function (done) {
            fakeReq.flash = function (type, message) {
              type.should.equal('warning');
              message.should.equal('Restricted Area');
              done();
            }
            returnedFunction(fakeReq, fakeRes, fakeNext);
          });

          it('should redirect to index', function (done) {
            fakeRes.redirect = function (route) {
              route.should.equal('/');
              done();
            };
            returnedFunction(fakeReq, fakeRes, fakeNext);
          });

          it('should not call next', function (done) {
            returnedFunction(fakeReq, fakeRes, fakeNext);
            fakeNext.calledOnce.should.be.false;
            done();
          });

        });

      });

    });

  });

});