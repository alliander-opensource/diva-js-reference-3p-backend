const diva = require('diva-irma-js');
const qr = require('qr-image');

/**
 * Request handler
 * @function requestHandler
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {undefined}
 */
module.exports = function requestHandler(req, res) {
  const attribute = req.query.attribute;
  const attributesLabel = req.query.attributesLabel;
  if (attribute && attributesLabel) {
    diva
      .startDisclosureSession(req.divaSessionState.user.sessionId, attribute, attributesLabel)
      .then((qrContent) => {
        switch (req.query.type) {
          case 'json':
          case 'qr':
          default:
            res.setHeader('Content-type', 'image/png');
            res.setHeader('Content-Disposition', 'inline; filename="qr.png"'); // Note: to force display in browser
            qr.image(qrContent, { type: 'png' }).pipe(res);
            break;
        }
      })
      .catch((error) => {
        res.end(error.toString());
      });
  } else {
    res.end('attribute or attributesLabel not set.');
  }
};
