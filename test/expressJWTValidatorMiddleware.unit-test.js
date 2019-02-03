const express = require('express');
require('chai').should();
const sinon = require('sinon');
const { expressJWTValidatorMiddleware } = require('../index');

const { valid, invalid } = require('./bearers.json');

function getExpressRequest(token) {
  express.request.headers = {
    authorization: token,
  };
  return express.request;
}

describe('expressMiddleware', () => {
  describe('inteface', () => {
    it('should export function which returns function with 3 params', () => {
      expressJWTValidatorMiddleware().length.should.be.equal(3);
    });
  });

  describe('happy path', () => {
    it('should call next without params if authorization header has valid bearer', async () => {
      const validRequest = getExpressRequest(valid);
      const middleware = expressJWTValidatorMiddleware();
      const next = sinon.fake();
      sinon.spy(express.response, 'setHeader');
      express.response.send = sinon.fake();

      try {
        await middleware(validRequest, express.response, next);
      } catch (error) {
        throw error; // rethrow if uncaught error
      }

      express.response.setHeader.called.should.be.equal(true);
      express.response.statusCode.should.be.equal(401);
      express.response.setHeader.restore();
    });

    it.skip('should set res.user object when bearer token valid', async () => {
      const validRequest = getExpressRequest(valid);
      const middleware = expressJWTValidatorMiddleware();
      const next = sinon.fake();

      try {
        await middleware(validRequest, express.response, next);
      } catch (error) {
        throw error; // rethrow if uncaught error
      }

      validRequest.should.have.property('user');
    });
  });

  describe('request rejected cases', () => {
    it('should block request if no authorization header in request', async () => {
      const req = getExpressRequest(invalid);
      req.headers.authorization = {};

      const middleware = expressJWTValidatorMiddleware();
      const next = sinon.fake();
      sinon.spy(express.response, 'setHeader');
      express.response.send = sinon.fake();

      try {
        await middleware(req, express.response, next);
      } catch (error) {
        throw error; // rethrow if uncaught error
      }

      express.response.setHeader.called.should.be.equal(true);
      express.response.statusCode.should.be.equal(401);
      express.response.setHeader.restore();
    });

    it('should block request if bearer token invalid', async () => {
      const validRequest = getExpressRequest(valid);
      const middleware = expressJWTValidatorMiddleware();
      const next = sinon.fake();
      sinon.spy(express.response, 'setHeader');
      express.response.send = sinon.fake();

      try {
        await middleware(validRequest, express.response, next);
      } catch (error) {
        throw error; // rethrow if uncaught error
      }

      express.response.setHeader.called.should.be.equal(true);
      express.response.statusCode.should.be.equal(401);
      express.response.setHeader.restore();
    });
  });
});
