#!/usr/bin/env node

var path = require('path');
var electron = require('electron')

var proc = require('child_process')

console.log('process.argv', process.argv);
var child = proc.spawn(electron, [path.join(__dirname,'..')].concat(process.argv.slice(2)), {stdio: 'inherit'})
child.on('close', function (code) {
  process.exit(code)
})
