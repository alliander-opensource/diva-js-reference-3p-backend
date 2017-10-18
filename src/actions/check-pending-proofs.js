const diva = require('diva-irma-js');
/**
 * Request handler
 * @function requestHandler
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {undefined}
 */
module.exports = function requestHandler(req, res) {
  return diva.checkPendingProofs(req.divaSessionState)
    .then((newDivaSessionState) => {
      req.divaSessionState = newDivaSessionState;
      diva.sendCookie(req, res);
      return res
        .json(req.divaSessionState);
    })
    .catch(error =>
      res
        .status(400)
        .send({
          success: false,
          message: JSON.stringify(error),
        }),
    );
};
