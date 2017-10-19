const uuidv4 = require('uuid/v4');
const diva = require('diva-irma-js');

// TODO: get these from config
const cookieName = 'diva-session';
const cookieSettings = {
  httpOnly: true,
  maxAge: 300000,
  sameSite: true,
  signed: true,
  secure: false, // TODO: NOTE: must be set to true and be used with HTTPS only!
};


function deauthenticate(oldSession) {
  if (oldSession !== undefined) {
    diva.removeDivaSession(oldSession);
  }

  return { session: uuidv4() };
}

function simpleSessionCookieParser(req, res, next) {
  if (typeof req.signedCookies[cookieName] === 'undefined' ||
      typeof req.signedCookies[cookieName].session === 'undefined') {
    req.divaSessionState = deauthenticate();
    res.cookie(cookieName, req.divaSessionState, cookieSettings);
  } else {
    const session = req.signedCookies[cookieName].session;
    const attributes = diva.getAttributes(session);
    req.divaSessionState = {
      session,
      attributes,
    };
  }
  next();
}

module.exports = simpleSessionCookieParser;
module.exports.deauthenticate = deauthenticate;
