const BPromise = require('bluebird');
const jwt = require('jsonwebtoken');

const Policy = require('../../database/models/Policy');
const config = require('./../../config');
const toMessage = require('./policy').toMessage;

// Every attribute that is disclosed should also be in signature jwt
function checkAttributes(disclAttr, signatureAttr) {
  return Object.keys(disclAttr).every(el => (
    disclAttr[el] === signatureAttr[el]
  ));
}

// Verify signature:
// - check jwt key
// - check signature proof status
// - check if message in signature equals policy
// - check if attributes in signature corresponds to provided attributes
function verifySignature(signature, policy) {
  return BPromise
    .try(() => jwt.verify(signature.jwt, config.irmaApiServerPublicKey, { ignoreExpiration: true }))
    .then(jwtBody => (
      jwtBody.status === 'VALID' &&
      checkAttributes(signature.attributes, jwtBody.attributes) &&
      jwtBody.message === signature.message &&
      toMessage(policy) === signature.message &&
      signature.attributes['pbdf.pbdf.idin.address'] !== null &&
      signature.attributes['pbdf.pbdf.idin.city'] !== null
    ))
    .catch((error) => {
      console.log('error: ', error);
      return false;
    });
}

/**
 * Request handler
 * @function requestHandler
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {undefined}
 */
module.exports = function requestHandler(req, res) {
  const { transaction_hash, service_provider, policy, signature } = req.body;
  return verifySignature(signature, policy)
    .then((result) => {
      if (result) { // Signature is valid, add policy
        return Policy.query().insert({
          id: transaction_hash,
          policy,
          service_provider,
          message: signature.message,
          irma_signature: signature,
          owner: {
            street: signature.attributes['pbdf.pbdf.idin.address'],
            city: signature.attributes['pbdf.pbdf.idin.city'],
          },
        })
          .then(dbResult => (
            res
              .set({ Location: `${res.req.baseUrl}/${policy.id}` })
              .status(201)
              .send({
                success: true,
                message: 'Created',
                id: dbResult.id,
              })
          ))
          .catch((err) => {
            console.log(err);
            return res
              .status(500)
              .send({
                success: false,
                message: 'error_db_insert',
              });
          });
      }

      return res
        .status(400)
        .send({
          success: false,
          message: 'error_signature',
        });
    });
};

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
