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
    .then((attributes) => {
      //TODO remove this as diva middleware makes sure this is not undefined
      attributes['pbdf.pbdf.idin.address'] = ["Straat 1"]
      attributes['pbdf.pbdf.idin.city'] = ["Stad"]
      return {
        street: attributes['pbdf.pbdf.idin.address'][0],
        city: attributes['pbdf.pbdf.idin.city'][0],
      };
    })
    .then(address => {
      return Policy.query().where('owner', '=', address);
    })
    .then(policies => {
      res.json(policies);
    })
    .catch((err) => {
      console.log(err);
      return res.end('Something went wrong.');
    });

};
