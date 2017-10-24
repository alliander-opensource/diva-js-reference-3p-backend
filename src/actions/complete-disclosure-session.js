const diva = require('diva-irma-js');

/**
 * Request handler
 * @function requestHandler
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {undefined}
 */
module.exports = function requestHandler(req, res) {
  // All routes without session token are non-existent
  if (!req.params.sessionToken) {
    return res.sendStatus(404);
  }

  const proof = req.body;
  if (proof !== undefined) {
    return diva.completeDisclosureSession(req.params.sessionToken, proof)
      .then(() => {
        res
          .status(200)
          .send({
            success: true,
            message: 'Proof valid',
          });
      })
      .catch((e) => {
        console.log(e); // for debugging...
        return res
          .status(401)
          .send({
            success: false,
            message: 'Invalid proof!',
          });
      });
  }

  return res
    .status(400)
    .send({
      success: false,
      message: 'No proof provided!',
    });
};
