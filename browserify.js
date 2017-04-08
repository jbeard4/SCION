var browserify = require('browserify');
var tsify = require('tsify');
var uglifyify = require('uglifyify');
var babelify = require('babelify');
var exorcist = require('exorcist');
var fs = require('fs');
var path = require('path');

var mapfile = path.join(__dirname, 'dist/index.js.map');
var jsFile = path.join(__dirname, 'dist/index.js')

browserify({ 
      noParse: [ undefined ],
      extensions: [],
      ignoreTransform: [],
      entries: [ 'src/index.tsx' ],
      fullPaths: false,
      builtins: false,
      commondir: false,
      bundleExternal: true,
      basedir: undefined,
      browserField: true,
      transformKey: undefined,
      dedupe: true,
      detectGlobals: true,
      insertGlobals: false,
      insertGlobalVars:
       { process: undefined,
         global: undefined,
         'Buffer.isBuffer': undefined,
         Buffer: undefined },
      ignoreMissing: false,
      debug: true,
      standalone: undefined 
    })
    .exclude('electron') 
    .plugin(tsify)
    .transform(babelify, { extensions: [ '.tsx', '.ts' ], presets: ["es2015"] })
    .transform({ global: true }, uglifyify)
    .bundle()
    .pipe(exorcist(mapfile))
    .on('error', function (error) { console.error(error); })
    .pipe(fs.createWriteStream(jsFile, 'utf8'));

