var browserify = require('browserify');
var tsify = require('tsify');
var uglifyify = require('uglifyify');
var babelify = require('babelify');
var exorcist = require('exorcist');
var browserifyCss = require('browserify-css');
var fs = require('fs');
var path = require('path');

var mapfile = path.join(__dirname, 'dist/schviz.js.map');
var jsFile = path.join(__dirname, 'dist/schviz.js')

browserify({ 
      debug: true, 
      standalone : "SCHVIZ"
     })
    .add('src/index.ts')
    .transform({global: true}, browserifyCss)
    .plugin(tsify)
    .transform(babelify, { extensions: [ '.tsx', '.ts' ], presets: ["es2015"] })
    .transform({ global: true }, uglifyify)
    .bundle()
    .pipe(exorcist(mapfile))
    .on('error', function (error) { console.error(error.toString()); })
    .pipe(fs.createWriteStream(jsFile, 'utf8'));
