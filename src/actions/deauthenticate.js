const simpleSession = require('./../modules/simple-session');

// TODO: get this from config
const divaCookieName = 'diva-session';
const cookieSettings = {
  httpOnly: true,
  maxAge: 300000,
  sameSite: true,
  signed: true,
  secure: false, // TODO: NOTE: must be set to true and be used with HTTPS only!
};

/**
 * Request handler
 * @function requestHandler
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {undefined}
 */
module.exports = function requestHandler(req, res) {
  req.divaSessionState = simpleSession.deauthenticate(req.divaSessionState.sessionId);
  res.cookie(divaCookieName, req.divaSessionState, cookieSettings);
  res.json(req.divaSessionState);
};
