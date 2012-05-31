var stitch  = require('stitch');
var fs      = require('fs');

var pkg = stitch.createPackage({
  paths: [__dirname + '/..']
});

pkg.compile(function (err, source){
  fs.writeFile('SCION.js', source, function (err) {
    if (err) throw err;
    console.log('Compiled scion.js');
  });
});
