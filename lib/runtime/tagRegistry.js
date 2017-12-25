const registry = {};

function registerCustomActionTags(namespaceToTagNameMap, sandboxObject){
  //TODO: integrate sandboxObject
  //merge him into the global registry 
  Object.keys(namespaceToTagNameMap).forEach( namespace => {
    const tags = registry[namespace] = registry[namespace] || {};
    
    Object.keys(namespaceToTagNameMap[namespace]).forEach( tagName => {
      tags[tagName] = namespaceToTagNameMap[namespace][tagName];
    });
  });
};

module.exports = {
  registerCustomActionTags,
  registry
};
