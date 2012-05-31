var stitch  = require('stitch');
var fs      = require('fs');

var pkg = stitch.createPackage({
    paths: ['lib/'],
    excludes : ['lib/node','lib/rhino','lib/browser/build']
});

pkg.compile(function (err, source){
    fs.writeFile('scion.js', source, function (err) {
        if (err) throw err;
        console.log('Compiled scion.js');
    });
});
