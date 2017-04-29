var browserify = require('browserify');
var tsify = require('tsify');
var uglifyify = require('uglifyify');
var babelify = require('babelify');
var exorcist = require('exorcist');
var fs = require('fs');
var path = require('path');
var through = require('through2');
var browserifyCss = require('browserify-css');

var mapfile = path.join(__dirname, 'dist/index.js.map');
var jsFile = path.join(__dirname, 'dist/index.js')

var options = { 
      noParse: [ undefined ],
      extensions: [],
      ignoreTransform: [],
      //entries: [ 'src/index.tsx' ],
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
    };

browserify(options)
    //.add(require.resolve('scxml'))
    //.add(require.resolve('scion-core'))
    .add('src/index.tsx')
    .exclude('electron') 
    .transform({global: true}, browserifyCss)
    .plugin(tsify)
    .transform(function (file) {
        return through(function (buf, enc, next) {
            var s = buf.toString('utf8');
            console.log('file',file);
            this.push(s);
            next();
        })
    })
    .transform(babelify, {global: true, presets: ["es2015"], ignore : /react-dom/ })
    //.transform({ global: true }, uglifyify)
    .bundle()
    .on('error', function (error) { console.error(error); })
    .pipe(fs.createWriteStream(jsFile, 'utf8'));


