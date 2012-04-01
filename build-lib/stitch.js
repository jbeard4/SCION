var stitch  = require('stitch');
var fs      = require('fs');

var package = stitch.createPackage({
  paths: [__dirname + '/../lib']
});

package.compile(function (err, source){
  fs.writeFile('scion.js', source, function (err) {
    if (err) throw err;
    console.log('Compiled package.js');
  })
})
