var path = require('path');
var fs = require('fs');

var normalizedPath = path.join(__dirname, "");
var pluginFiles = fs.readdirSync(normalizedPath);

var plugins = {};

for (var i = pluginFiles.length - 1; i >= 0; i--) {
    var fileName = pluginFiles[i];
    var moduleName = fileName.replace('.js', '');

    if(fileName !== 'index.js') {
        plugins[fileName.replace('.js', '')] = require(normalizedPath + '/' + fileName)[moduleName];
    }

    if(i === 0) {
        module.exports = plugins;
    }
}