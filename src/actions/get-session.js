const diva = require('diva-irma-js');

/**
 * Request handler
 * @function requestHandler
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {undefined}
 */
module.exports = function requestHandler(req, res) {
  const sessionId = req.sessionId;
  const attributes = diva.getAttributes(sessionId);
  // Display session state
  return res.json({
    sessionId,
    attributes,
  });
};
