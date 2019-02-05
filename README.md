# Introduction 
Express Middleware to validate request Bearer JWT token.
If token is valid - next middleware invoked, and request.securityContext set to content of JWT token

# Getting Started
1.	Installation process: `npm install @finastra/express-platform-jwt`

2. How to use it:
```
var app = require('express')();

var {expressJWTValidatorMiddleware} = require('@finastra/express-platform-jwt');


var options = {
  "jwksUri":"https://api-qa.int.fusionfabric.cloud/login/v1/sandbox/oidc/jwks.json"
};

app.all('/', expressJWTValidatorMiddleware(options),
  (req, res, next) => {
    console.log('here');
    res.send(req.securityContext);
  });

app.listen(100)

```

```@finastra/express-platform-jwt``` package exports constructor function which takes ```options``` object and returns middleware function.

For ```options``` parameter details see [node-jwks-rsa](https://github.com/auth0/node-jwks-rsa).
The most important parameter is ```jwksUri``` - it is URL of token key store, url of the server where token was created.



# Tests
`npm run test`


