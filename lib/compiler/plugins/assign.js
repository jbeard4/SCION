exports.assign = function(action) {
    return action.location.expr + " = " + generateFnCall(generateAttributeExpression(action, 'expr')) + ";";
};