# Introduction 
Express Middleware to validate request Bearer JWT token.

Validation performed with help of public key - companion of secret key which was used to sign JWT Bearer.

Location (URL) of the public key is provided via middleware configuration.

If token is valid - next middleware invoked, and request.securityContext set to content of access JWT token.

# Getting Started
1.	Installation: `npm install express-platform-jwt`

2. How to use it:
```
var app = require('express')();

var {expressJWTValidatorMiddleware} = require('express-platform-jwt');

const locationOfYourPublicKeyServer='<SET LOCATION>';

var options = {
"jwksUri":`https://${locationOfYourPublicKeyServer}/oidc/jwks.json`
};

app.all('/', expressJWTValidatorMiddleware(options),
  (req, res, next) => {
    console.log('here');
    res.send(req.securityContext);
  });

app.listen(100)
```
```express-platform-jwt``` package exports constructor function which takes ```options``` object and returns middleware function.

For ```options``` parameter details see [node-jwks-rsa](https://github.com/auth0/node-jwks-rsa).
The most important parameter is ```jwksUri``` - it is URL of token key store, url of the public key.

You can get locationOfYourPublicKeyServer value from .well-known oauth server metadata. For details and properties see:
[OAuth 2.0 Authorization Server Metadata. rfc8414](https://tools.ietf.org/html/rfc8414).
You will need jwks_uri.


# Tests
`npm run test`


