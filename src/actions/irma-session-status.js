const diva = require('diva-irma-js');
const { addAttributesFromProof } = require('diva-irma-js/session');

/**
 * Request handler
 * @function requestHandler
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {undefined}
 */
module.exports = function requestHandler(req, res) {
  const { irmaSessionId, irmaSessionType } = req.query;

  if (!irmaSessionId) {
    return res.json({ serverStatus: 'INVALID' });
  }

  switch (irmaSessionType) {
    case 'DISCLOSE':
      return diva
        .getIrmaStatus(irmaSessionType, irmaSessionId)
        .then((result) => {
          if (result.serverStatus === 'DONE') {
            addAttributesFromProof(result.disclosureProofResult, irmaSessionId);
          }
          res.json(result);
        });
    case 'ISSUE':
      // falls through
    case 'SIGN':
      return diva
        .getIrmaStatus(irmaSessionType, irmaSessionId)
        .then(result => res.json(result));
    default:
      return res.json({ serverStatus: 'INVALID' });
  }
};
