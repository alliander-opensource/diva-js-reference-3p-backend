const diva = require('diva-irma-js');
/**
 * Request handler
 * @function requestHandler
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {undefined}
 */
module.exports = function requestHandler(req, res) {
  // This is just for now to test and will be removed once we connect IRMA
  // Process proofs
  let proofs;
  if (req.query.proof) {
    // Force array of proofs
    if (!Array.isArray(req.query.proof)) {
      proofs = [req.query.proof];
    } else {
      proofs = req.query.proof;
    }

    // TODO: Check proofs

    // Add proofs to session sessionState
    proofs.forEach((proof) => {
      req.divaSessionState = diva.addProof(req.divaSessionState, proof);
    });
  }
  diva.sendCookie(req, res);

  // Display session state
  return res.json(req.divaSessionState);
};
