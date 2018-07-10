const uuidv4 = require('uuid/v4');
const config = require('./../config');
const logger = require('./../common/logger')('session');

function deauthenticate(req, res) {
  logger.trace('calling deauthenticate()');
  req.sessionId = uuidv4();
  res.cookie(config.cookieName, req.sessionId, config.cookieSettings);
}

function simpleSessionCookieParser(req, res, next) {
  logger.trace('calling SimpleSessionCookieparser()');
  if (!req.signedCookies[config.cookieName]) {
    logger.debug('invalid cookie');
    deauthenticate(req, res);
  } else {
    req.sessionId = req.signedCookies[config.cookieName];
  }
  next();
}

module.exports = simpleSessionCookieParser;
module.exports.deauthenticate = deauthenticate;
