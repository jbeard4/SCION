var stitch = require('stitch');
var fs = require('fs');
var path = require('path');

var pkg = stitch.createPackage({
    paths: ['lib'],
    excludes : [
        path.join('lib','node'),
        path.join('lib','rhino'),
        path.join('lib','browser','build')
    ]
});

pkg.compile(function (err, source){
    fs.writeFile('scion-browser.js', source, function (err) {
        if (err) throw err;
        console.log('Compiled scion-browser.js');
    });
});

