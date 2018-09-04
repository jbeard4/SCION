const path = require('path'),
    fs = require('fs-extra');

const nodeModulesDir = path.join(__dirname, '../node_modules');
const scionScxmlDir = path.join(nodeModulesDir , '@scion-scxml');

fs.mkdirpSync(scionScxmlDir);

[
  '@scion-scxml/jsondiffpatch',
  'font-awesome',
  'jquery',
  'jquery-ui-dist',
  'ui-contextmenu',
  'react-ui-layout',
  'slickgrid',
].forEach((moduleName) => {
  module.paths.forEach( (modulePath) => {
    const moduleSrcDir = path.join(modulePath, moduleName);
    const moduleDestDir = path.join(nodeModulesDir, moduleName)

    if(fs.existsSync(moduleSrcDir) && !fs.existsSync(moduleDestDir)){
      console.log('copying', moduleSrcDir, 'to', moduleDestDir);
      fs.copySync(moduleSrcDir, moduleDestDir);
    }
  })
})


