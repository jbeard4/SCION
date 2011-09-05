# Copyright (C) 2011 Jacob Beard
# Released under GNU LGPL, read the file 'COPYING' for more information

dn=`dirname $0`
abspath=`cd $dn; pwd`
basedir=`dirname $abspath`

if [ ! -e $basedir/build/spartanLoaderForAllTests.js ]; then
	echo Please run \"make scion gen-requirejs-test-loader-module\" before running this file.
	exit 1
fi;

#these tests are highly recursive, so we increase the size of the nodejs stack. 
#same thing is done with the rhino tests running under the JVM
node --stack_size=4096 $basedir/lib/js/r.js $basedir/src/main/javascript/runner.js $basedir/build/ scxml/test/node-optimization-harness
