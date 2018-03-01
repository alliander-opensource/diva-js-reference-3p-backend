const actorNames = {
  hhb: 'Huishoudboekje',
};

/*
 * Converts a policy json structure to a message string representation
 * @function toMessage
 * @param {object} policy The Policy to convert
 * @returns {string} the resulting message string
 */
module.exports.toMessage = function toMessage(policy) {
  const actorName = actorNames[policy.actorId];
  const message = `${actorName} mag ${policy.actee} ${policy.action}, met als doel ${policy.goal}`;
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
