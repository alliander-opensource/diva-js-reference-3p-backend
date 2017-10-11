const diva = require('diva-irma-js');

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
exports = module.exports = function requestHandler(req, res) {
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
  res.cookie(divaCookieName, req.divaSessionState, cookieSettings);

  // Display session state
  return res.json(req.divaSessionState);
}
