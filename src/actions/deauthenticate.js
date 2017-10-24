const simpleSession = require('./../modules/simple-session');
const diva = require('diva-irma-js');

/**
 * Request handler
 * @function requestHandler
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {undefined}
 */
module.exports = function requestHandler(req, res) {
  diva.removeSession(req.sessionId);

  simpleSession.deauthenticate(req, res);
  return res.json({
    sessionId: req.sessionId,
  });
};
