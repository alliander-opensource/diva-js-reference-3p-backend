const diva = require('diva-irma-js');
const { addIrmaProofToSession } = require('diva-irma-js/session');

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
    case 'ISSUE':
      return diva
        .getIrmaIssueStatus(irmaSessionId)
        .then(result => res.json(result));
    case 'DISCLOSE':
      return diva
        .getIrmaDisclosureStatus(irmaSessionId)
        .then((result) => {
          if (result.serverStatus === 'DONE') {
            addIrmaProofToSession(result.disclosureProofResult, irmaSessionId);
          }
          res.json(result);
        });
    case 'SIGN':
      return diva
        .getIrmaSignatureStatus(irmaSessionId)
        .then(result => res.json(result));
    default:
      return res.json({ serverStatus: 'INVALID' });
  }
};
