const uuidv4 = require('uuid/v4');

// TODO: get these from config
const cookieName = 'diva-session';
const cookieSettings = {
  httpOnly: true,
  maxAge: 300000,
  sameSite: true,
  signed: true,
  secure: false, // TODO: NOTE: must be set to true and be used with HTTPS only!
};


function deauthenticate(req, res) {
  console.log('deauth');
  req.sessionId = uuidv4();
  res.cookie(cookieName, req.sessionId, cookieSettings);
}

function simpleSessionCookieParser(req, res, next) {
  if (!req.signedCookies[cookieName]) {
    deauthenticate(req, res);
  } else {
    req.sessionId = req.signedCookies[cookieName];
  }
  next();
}

module.exports = simpleSessionCookieParser;
module.exports.deauthenticate = deauthenticate;
