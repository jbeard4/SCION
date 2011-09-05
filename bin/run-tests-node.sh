# Copyright (C) 2011 Jacob Beard
# Released under GNU LGPL, read the file 'COPYING' for more information

dn=`dirname $0`
abspath=`cd $dn; pwd`
basedir=`dirname $abspath`

if [ ! -e $basedir/build/spartanLoaderForAllTests.js ]; then
	echo Please run \"make scion gen-requirejs-test-loader-module\" before running this file.
	exit 1
fi;

node $basedir/lib/js/r.js $basedir/src/main/javascript/runner.js $basedir/build/ scxml/test/node-harness
