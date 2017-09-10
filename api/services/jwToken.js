var jwt = require('jsonwebtoken');
var tokenSecret = "AWo5Nw3W2Uk96Og2RlDbsoSiApdpDAvf";

// Generate token for the supplied payload
module.exports.issue = function (payload) {
  'use strict';

  return jwt.sign(
    payload,
    tokenSecret, {
      expiresIn: 60 * 60 * 24
    }
  );
};

//verify token on request
module.exports.verify = function (token, callback) {
  'use strict';

  return jwt.verify(
    token,
    tokenSecret, {},
    callback
  );
};
