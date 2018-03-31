const diva = require('diva-irma-js');

const Policy = require('../../database/models/Policy');

/**
 * Request handler
 * @function requestHandler
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {undefined}
 */
module.exports = function requestHandler(req, res) {
  const sessionId = req.sessionId;
  diva
    .getAttributes(sessionId)
    .then(attributes => ({
      initials: attributes['irma-demo.idin.idin.initials'][0],
      familiyname: attributes['irma-demo.idin.idin.familyname'][0],
      bsn: attributes['irma-demo.MijnOverheid.root.BSN'][0],
    }))
    .then(owner => Policy.query().where('owner', '=', owner))
    .then(policies => res.json(policies))
    .catch((err) => {
      console.log(err);
      return res.end('Something went wrong.');
    });
};
