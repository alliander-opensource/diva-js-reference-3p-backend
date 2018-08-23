const simpleSession = require('./../modules/simple-session');
const divaSession = require('diva-irma-js/session');

/**
 * Request handler
 * @function requestHandler
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {undefined}
 */
module.exports = function requestHandler(req, res) {
  divaSession.removeDivaSession(req.sessionId); // Clear attributes

  simpleSession.deauthenticate(req, res); // Create a new sessionId

  return res.json({
    sessionId: req.sessionId,
  });
};
