const diva = require('diva-irma-js');

/**
 * Request handler
 * @function requestHandler
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {undefined}
 */
module.exports = function requestHandler(req, res) {
  const irmaSessionId = req.query.irmaSessionId;
  if (!irmaSessionId) {
    return res.json({ status: 'INVALID' });
  }
  return diva
    .getIrmaAPISessionStatus(irmaSessionId)
    .then((disclosureStatus) => {
      if (disclosureStatus === 'COMPLETED') {
        const divaSessionId = req.sessionId;
        return diva.getProofStatus(divaSessionId, irmaSessionId)
          .then(proofStatus =>
            res.json({
              disclosureStatus,
              proofStatus,
            }),
          );
      }
      return res.json({ disclosureStatus });
    });
};
