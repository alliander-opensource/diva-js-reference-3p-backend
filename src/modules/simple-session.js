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

  return {
    sessionId: uuidv4(),
    attributes: [],
    proofs: [],
  };
}

function simpleSessionCookieParser(req, res, next) {
  if (typeof req.signedCookies[cookieName] === 'undefined' ||
      typeof req.signedCookies[cookieName].sessionId === 'undefined') {
    req.divaSessionState = deauthenticate();
    res.cookie(cookieName, req.divaSessionState, cookieSettings);
  } else {
    const sessionId = req.signedCookies[cookieName].sessionId;
    const attributes = diva.getAttributes(sessionId);
    const proofs = diva.getProofs(sessionId);
    req.divaSessionState = {
      sessionId,
      attributes,
      proofs,
    };
  }
  next();
}

module.exports = simpleSessionCookieParser;
module.exports.deauthenticate = deauthenticate;
