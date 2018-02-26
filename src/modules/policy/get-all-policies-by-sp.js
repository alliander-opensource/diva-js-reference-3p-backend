const diva = require('diva-irma-js');
const basicAuth = require('basic-auth')

const Policy = require('../../database/models/Policy');

/**
 * Request handler
 * @function requestHandler
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {undefined}
 */
module.exports = function requestHandler(req, res) {
  Promise
    .resolve(basicAuth(req))
    .then((credentials) => { // TODO extract this to something like isAuthenticatedServiceProvider
      const validCredentials = {
        'hhb': 'secret',
      };
      if (!credentials || !(validCredentials.hasOwnProperty(credentials.name) && validCredentials[credentials.name] === credentials.pass)) {
        throw new Error("Unauthorized");
      }
      return credentials.name;
    })
    .then((serviceProvider) => {
      if (req.query.id) {
        return Policy.query().where('service_provider', '=', serviceProvider).andWhere('id', '=', req.query.id);
      } else {
        return Policy.query().where('service_provider', '=', serviceProvider);
      }
    })
    .then(policies => {
      res.json(policies);
    })
    .catch((err) => {
      console.log(err);
      return res.end('Something went wrong: ' + err.message);
    });

};
