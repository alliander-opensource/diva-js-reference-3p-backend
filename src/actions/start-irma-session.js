const diva = require('diva-irma-js');
const moment = require('moment');

function startIssueSession(credentialType, sessionId) {
  switch (credentialType) {
    case 'EAN':
      throw new Error(`Error starting ${sessionId}. Not supported yet!`);
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
          console.log(`Requesting disclosure of ${content}`);
          return diva.startDisclosureSession(content, null, req.sessionId);

        case 'SIGN':
          if (!content) {
            return res.end('content not set.');
          }
          if (!message) {
            return res.end('message not set.');
          }

          console.log(`Requesting signing of "${message}" with ${content}`);
          return diva.startSignatureSession(content, null, message);

        case 'ISSUE':
          console.log(`Issuing ${credentialType}`);
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
      console.log(error);
      res.end(error.toString());
    });
};
