var stitch = require('stitch');
var fs = require('fs');
var path = require('path');

var pkg = stitch.createPackage({
    rootModuleName  : 'scion',
    paths: ['lib'],
    excludes : [
        path.join('lib','node'),
        path.join('lib','rhino'),
        path.join('lib','browser','build'),
        path.join('lib','external')
    ]
});

var out = process.argv[2];

pkg.compile(function (err, source){
    fs.writeFile(out, source, function (err) {
        if (err) throw err;
        console.log('Compiled', out);
    });
});

