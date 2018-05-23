const diva = require('diva-irma-js');
const moment = require('moment');

/**
 * Request handler for starting a new disclosure session via POST request
 * @function requestHandler
 * @param {object} req Express request object, containing an IRMA content object
 * @param {object} res Express response object
 * @returns {undefined}
 */
module.exports = function requestHandler(req, res) {
  const type = req.body.type;
  const content = req.body.content;
  const message = req.body.message;
  Promise
    .resolve()
    .then(() => {
      switch (type) {
        case 'DISCLOSE':
          if (!content) {
            return res.end('content not set.');
          }
          console.log(`Requesting disclosure of ${content}`);
          return diva.startDisclosureSession(req.sessionId, content);

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
          console.log('Issuing');
          return diva.startIssueSession([{
            credential: 'irma-demo.MijnOverheid.address',
            validity: moment().add(6, 'months').unix(),
            attributes: {
              country: 'The Netherlands2',
              city: 'Nijmegen',
              street: 'Toernooiveld 212',
              zipcode: '6525 EC',
            },
          }]);

        default:
          throw new Error('IRMA session type not specified');
      }
    })
    .then((irmaSessionData) => {
      res.setHeader('Content-type', 'application/json; charset=utf-8');
      res.json(irmaSessionData);
    })
    .catch((error) => {
      res.end(error.toString());
    });
};
