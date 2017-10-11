/**
 * Request handler
 * @function requestHandler
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {undefined}
 */
exports = module.exports = function requestHandler(req, res) {
  // Display session state
  return res.json(req.divaSessionState);
}
