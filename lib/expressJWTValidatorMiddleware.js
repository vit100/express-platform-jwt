const jsonwebtoken = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const { ExtractJwt } = require('passport-jwt');
const ms = require('ms')

module.exports = function (options) {
  const _options = {
    cache: true,
    cacheMaxEntries: 5, // Default value
    cacheMaxAge: ms('10h'), // Default value
    jwksUri: 'https://platformUri.somewhereCloud'
  };
  Object.assign(_options, options);

  return async function (req, res, next) {
    function getKey(header, cb) {
      jwksClient(_options)
        .getSigningKey(header.kid, function (err, key) {
          if (err) {
            cb(err);
            return;
          }
          var signingKey = key.publicKey || key.otherKey //need to check.
          cb(null, signingKey);
        })
    }

    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    return new Promise(function(resolve, reject){
      jsonwebtoken.verify(token, getKey, {}, function (err, decoded) {
        if (err) {
          next(err);
          reject(err);
          return;
        }
        req.user = decoded; //set prop;
        resolve(next());
      });
    });

    
  }
}