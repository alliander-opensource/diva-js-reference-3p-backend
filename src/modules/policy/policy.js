const actorNames = {
  hhb: 'Het Huishoudboekje, de Gemeente Utrecht en relevante ketenpartners',
};

/*
 * Converts a policy json structure to a message string representation
 * @function toMessage
 * @param {object} policy The Policy to convert
 * @returns {string} the resulting message string
 */
// actor: Het Huishoudboekje, de Gemeente Utrecht en relevante ketenpartners
// actee: mijn (persoonlijke) gegevens
// action: verwerken en onderling delen
// goal: het Huishoudboekje mijn Inkomsten en Vaste Lasten voor mij kan beheren.
module.exports.toMessage = function toMessage(policy) {
  const actorName = actorNames[policy.actorId];
  const message = `${actorName} mogen ${policy.actee} ${policy.action}, zodat ${policy.goal}`;
  if (policy.conditions.length === 0) {
    return `${message}.`;
  }
  const conditionsPart = policy.conditions.reduce((result, condition, i) => {
    if (i === policy.conditions.length) {
      return `${result}, en indien ${condition}`;
    }
    return `${result}, indien ${condition}`;
  }, '');

  return `${message} ${conditionsPart}.`;
};
