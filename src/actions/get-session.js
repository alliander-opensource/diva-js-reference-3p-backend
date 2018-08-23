const divaSession = require('diva-irma-js/session');

/**
 * Request handler
 * @function requestHandler
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {undefined}
 */
module.exports = function requestHandler(req, res) {
  const sessionId = req.sessionId;
  divaSession
    .getAttributes(sessionId)
    .then(attributes => res.json({
      sessionId,
      attributes,
    }));
};
