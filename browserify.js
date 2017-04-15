var browserify = require('browserify');
var uglifyify = require('uglifyify');
var babelify = require('babelify');
var watchify = require('watchify');
var exorcist = require('exorcist');
var fs = require('fs');
var path = require('path');

var mapfile = path.join(__dirname, 'dist/scxml.js.map');
var jsFile = path.join(__dirname, 'dist/scxml.js')

browserify({ 
      debug: true, 
      standalone : "scxml"
     })
    .add('lib/runtime/facade.js')
    //.plugin('watchify')
    .transform(babelify, { presets: ["es2015"] })
    //.transform({ global: true }, uglifyify)
    .bundle()
    .on('log',function(message){console.log(message);})
    .pipe(exorcist(mapfile))
    .on('error', function (error) { console.error(error.toString()); })
    .pipe(fs.createWriteStream(jsFile, 'utf8'));

