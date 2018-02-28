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
      street: attributes['pbdf.pbdf.idin.address'][0],
      city: attributes['pbdf.pbdf.idin.city'][0],
    }))
    .then((address) => {
      const { transaction_hash, service_provider, policy, message, irma_signature } = req.body;
      return Policy.query().insert({
        id: transaction_hash,
        policy,
        service_provider,
        message,
        irma_signature,
        owner: address,
      });
      // Example: {
      //   id: "62uhkjasgdk",
      //   policy: {
      //     actor: "Huishoudboekje",
      //     action: "lezen",
      //     actee: "mijn inkomensgegevens",
      //     conditions: [],
      //     goal: "om mijn financiën te regelen."
      //   },
      //   service_provider: "hhb",
      //   message: "Huishoudboekje mag mijn inkomensgegevens lezen om mijn financiën te regelen.",
      //   irma_signature: {},
      //   owner: address,
      // }
    })
    .then((policy) => {
      res
        .set({ Location: `${res.req.baseUrl}/${policy.id}` })
        .status(201)
        .send({
          success: true,
          message: 'Created',
          id: policy.id,
        });
    })
    .catch((err) => {
      console.log(err);
      return res.end('Something went wrong.');
    });
};
