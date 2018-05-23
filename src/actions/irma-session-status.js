const diva = require('diva-irma-js');

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
        .getIrmaAPISessionStatus(req.sessionId, irmaSessionId)
        .then(status => res.json(status));
    case 'SIGN':
      return diva
        .getIrmaSignatureStatus(irmaSessionId)
        .then(result => res.json(result));
    default:
      return res.json({ serverStatus: 'INVALID' });
  }
};
