# Copyright (C) 2011 Jacob Beard
# Released under GNU LGPL, read the file 'COPYING' for more information

dn=`dirname $0`
abspath=`cd $dn; pwd`
basedir=`dirname $abspath`

if [ ! -e $basedir/build/tests/loaders/spartan-loader-for-all-tests.js ]; then
	echo Please run \"make interpreter tests test-loader\" before running this file.
	exit 1
fi;

#we can use regular r.js (the version installed from npm) here
#we could also use the version of r.js which we bundle in lib/ which supports spartan shell environments
#r.js -lib is primarily used to set up the env plugin
r.js -lib $basedir/build/core/runner.js $basedir/build/core scxml/test/node-harness
