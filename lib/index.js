//this module provides a single point of access to all important user-facing modules in scion
module.exports = {
    annotator : require('./util/annotate-scxml-json'),
    json2model : require('./scxml/json2model'),
    scxml : require('./scxml/SCXML')
};
