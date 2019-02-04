const jsonwebtoken = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const { ExtractJwt } = require('passport-jwt');
const ms = require('ms');
const debug = require('debug')('expressJWTValidatorMiddleware:');

function fail(res, message = 'Unauthorized') {
  res.setHeader('WWW-Authenticate', 'Bearer');
  res.status(401).send(message);
}

module.exports = function getMiddleware(options) {
  const defaults = {
    cache: true,
    cacheMaxEntries: 5, // Default value
    cacheMaxAge: ms('10h'), // Default value
    jwksUri: 'https://api.fusionfabric.cloud/login/v1/sandbox/oidc/jwks.json',
  };

  const claimsToValidate = { //what to validate additionally?
    // audience: '??',
    // issuer: '??',
  };

  const actualOptions = Object.assign(defaults, options);

  return async function middleWare(req, res, next) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (!token) {
      debug('No JWT found in Authorization Header');
      fail(res);
      return;
    }

    function getKey(header, cb) {
      jwksClient(actualOptions).getSigningKey(header.kid, (err, key) => {
        if (err) {
          debug(`jwksClient unable to get keys. Error ${err}`);
          cb(err);
          return;
        }
        const signingKey = key.publicKey || key.rsaPublicKey;
        cb(null, signingKey);
      });
    }

    // eslint-disable-next-line consistent-return
    return new Promise((resolve) => {
      jsonwebtoken.verify(token, getKey, claimsToValidate, (err, decoded) => {
        if (err) {
          debug(`failed to validate JWT token. Error: ${err}`);
          fail(res);
          //next(err);
          resolve(); // resolve anyway, headers and reponse set.
          return;
        }
        req.user = decoded;
        resolve(next());
      });
    });
  };
};
