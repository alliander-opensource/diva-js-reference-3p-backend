const moment = require('moment');
const diva = require('diva-irma-js');
const divaSession = require('diva-irma-js/session');

const logger = require('./../common/logger')('actions');
const { startEanIssueSession } = require('./../modules/ean-issue');

function startIssueSession(credentialType, sessionId) {
  switch (credentialType) {
    case 'EAN':
      return divaSession.requireAttributes(sessionId, ['pbdf.pbdf.idin.address', 'pbdf.pbdf.idin.zipcode'])
        .then(() => startEanIssueSession(sessionId));
    default:
      return diva.startIssueSession([{
        credential: 'irma-demo.MijnOverheid.address',
        validity: moment().add(6, 'months').unix(),
        attributes: {
          country: 'The Netherlands',
          city: 'The Hague',
          street: 'Lange Poten 4',
          zipcode: '2511 CL',
        },
      }]);
  }
}

/**
 * Request handler for starting a new irma session via POST request
 * @function requestHandler
 * @param {object} req Express request object, containing an IRMA content object
 * @param {object} res Express response object
 * @returns {undefined}
 */
module.exports = function requestHandler(req, res) {
  const { type, content, message, credentialType } = req.body;
  Promise
    .resolve()
    .then(() => {
      switch (type) {
        case 'DISCLOSE':
          if (!content) {
            return res.end('content not set.');
          }
          logger.debug(`Requesting disclosure of ${content}`);
          return diva.startDisclosureSession(content, null, req.sessionId);

        case 'SIGN':
          if (!content) {
            return res.end('content not set.');
          }
          if (!message) {
            return res.end('message not set.');
          }

          logger.debug(`Requesting signing of "${message}" with ${content}`);
          return diva.startSignatureSession(content, null, message);

        case 'ISSUE':
          logger.debug(`Issuing ${credentialType}`);
          return startIssueSession(credentialType, req.sessionId);
        default:
          throw new Error('IRMA session type not specified');
      }
    })
    .then((irmaSessionData) => {
      res.setHeader('Content-type', 'application/json; charset=utf-8');
      res.json(irmaSessionData);
    })
    .catch((error) => {
      logger.warn('Error starting IRMA session');
      logger.debug(error);
      res.end(error.toString());
    });
};
