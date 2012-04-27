var stitch  = require('stitch');
var fs      = require('fs');

var pkg = stitch.createPackage({
  paths: [__dirname + '/../core']
});

pkg.compile(function (err, source){
  fs.writeFile('scion.js', source, function (err) {
    if (err) throw err;
    console.log('Compiled scion.js');
  });
});
