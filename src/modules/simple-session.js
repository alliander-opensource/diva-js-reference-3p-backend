const uuidv4 = require('uuid/v4');
const config = require('./../config');

function deauthenticate(req, res) {
  console.log('deauth!');
  req.sessionId = uuidv4();
  res.cookie(config.cookieName, req.sessionId, config.cookieSettings);
}

function simpleSessionCookieParser(req, res, next) {
  console.log(req.signedCookies);
  if (!req.signedCookies[config.cookieName]) {
    deauthenticate(req, res);
  } else {
    req.sessionId = req.signedCookies[config.cookieName];
  }
  next();
}

module.exports = simpleSessionCookieParser;
module.exports.deauthenticate = deauthenticate;
