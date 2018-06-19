const { getAddressZipcode, startEanIssueSession, getEan } = require('./../modules/ean-issue');

/**
 * Request handler for starting a new ean issue session via POST request
 * @function requestHandler
 * @param {object} req Express request object, containing an IRMA content object
 * @param {object} res Express response object
 * @returns {undefined}
 */
module.exports = function requestHandler(req, res) {
  const { sessionId } = req;
  console.log('ping!');

  getAddressZipcode(sessionId)
    .then(attributes => getEan(...attributes))
    .then(eanInfo => startEanIssueSession(...eanInfo))
    .then((irmaSessionData) => {
      res.setHeader('Content-type', 'application/json; charset=utf-8');
      res.json(irmaSessionData);
    })
    .catch((error) => {
      res.end(error.toString());
    });
};
