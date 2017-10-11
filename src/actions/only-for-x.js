/**
 * Request handler
 * @function requestHandler
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {undefined}
 */
exports = module.exports = function requestHandler(req, res) {
  res.send('This is only visible if you have attribute x');
}
