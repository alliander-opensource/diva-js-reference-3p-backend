const diva = require('diva-irma-js');
const qr = require('qr-image');

/**
 * Request handler
 * @function requestHandler
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {undefined}
 */
exports = module.exports = function requestHandler(req, res) {
  const attribute = req.query.attribute;
  const attributesLabel = req.query.attributesLabel;
  if (attribute && attributesLabel) {
    diva
      .startDisclosureSession(req.divaSessionState.user.sessionId, attribute, attributesLabel)
      .then((qrContent) => {
        console.log(qrContent);
        switch(req.query.type) {
          case 'json':
          case 'qr':
          default:
            let code = qr.image(qrContent, { type: 'png' });
            res.setHeader('Content-type', 'image/png');
            res.setHeader('Content-Disposition', 'inline; filename="filename.pdf"'); // Note: to force display in browser
            code.pipe(res);
            break;
        }
      })
      .catch((error) => {
        res.end(error.toString());
      })
  } else {
    res.end('attribute or attributesLabel not set.')
  }
}
