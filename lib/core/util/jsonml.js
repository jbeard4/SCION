/*
 * Some utilities functions for working with jsonml.
 * Right now, there's only one.
 */

module.exports = {
    deconstructNode : function(node, filterText) {
        var attributes, child, children, n1, tagName;
        tagName = node[0];
        n1 = node[1];
        if (n1 && typeof n1 === "object" && !(Array.isArray(n1) || typeof n1 === "string")) {
            attributes = n1;
            children = node.slice(2);
        } else {
            attributes = {};
            children = node.slice(1);
        }
        if (filterText) {
            children = children.filter(function(child){return typeof child !== "string";});
        }
        return [tagName, attributes, children];
    }
};

