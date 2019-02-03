require('chai').should();
const sinon = require('sinon');
const { expressJWTValidatorMiddleware } = require('../index');

const validRequest = require('./validRequest');
const invalidRequest = require('./invalidRequest');

describe("expressMiddleware", function () {
  describe("export", function () {
    //check for middleware signature interface
    it("should export function which returns function with 3 params", function () {
      expressJWTValidatorMiddleware().length.should.be.equal(3);
    })

    it("should call next without params if authorization header has valid bearer", async function () {
      const middleware = expressJWTValidatorMiddleware();
      const next = sinon.fake();
      const res = sinon.fake();
      try {
        await middleware(validRequest, res, next);
      } catch (error) {

      }
      next.called.should.be.true;
      next.args.length.should.be.equal(0)
    });

    it("should call next with error if no authorization header in request", async function () {
      var req = invalidRequest;
      req.headers.authorization={}

      const middleware = expressJWTValidatorMiddleware();
      const next = sinon.fake();
      const res = sinon.fake();
      try {
        await middleware(req, res, next);
      } catch (error) {

      }
      next.called.should.be.true;
      next.args.length.should.be.equal(1);
    });

    it("should call next with error if bearer token invalid", async function () { 
      const middleware = expressJWTValidatorMiddleware();
      const next = sinon.fake();
      const res = sinon.fake();
      try {
        await middleware(invalidRequest, res, next);
      } catch (error) {

      }
      next.called.should.be.true;
      next.args.length.should.be.equal(1);
    });


    it("should set res.user object when bearer token valid", async function () { 
      var req = validRequest;
      req.headers.authorization={}

      const middleware = expressJWTValidatorMiddleware();
      const next = sinon.fake();
      const res = sinon.fake();
      try {
        await middleware(req, res, next);
      } catch (error) {

      }
      res.should.have.property('user');
    });
  })
})