const diva = require('diva-irma-js');

/**
 * Request handler
 * @function requestHandler
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {undefined}
 */
module.exports = function requestHandler(req, res) {
  // Note: The IRMA API server concatenates the irma session id (session token
  // in the IRMA documentation to this route. That is why a route param is used.
  // All routes without session id are non-existent.
  if (!req.params.irmaSessionId) {
    return res.sendStatus(404);
  }

  const proof = req.body;
  if (proof !== undefined) {
    return diva
      .completeDisclosureSession(req.params.irmaSessionId, proof)
      .then(() => res.sendStatus(200)) // Proof was successfully processed
      .catch(() => res.sendStatus(401)); // Error during proof processing
  }

  return res.sendStatus(400); // No proof provided
};
