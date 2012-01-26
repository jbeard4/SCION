# Copyright (C) 2011 Jacob Beard
# Released under GNU LGPL, read the file 'COPYING' for more information

dn=`dirname $0`
abspath=`cd $dn; pwd`
t=`dirname $abspath`
basedir=`dirname $t`

if [ ! -e $basedir/target/tests/loaders/spartan-loader-for-all-tests.js ]; then
	echo Please run \"make interpreter tests test-loader\" before running this file.
	exit 1
fi;

#these tests are highly recursive, so we increase the size of the nodejs stack. 
#same thing is done with the rhino tests running under the JVM
node --stack_size=4096 $basedir/lib/js/r.js -lib $basedir/target/core/runner.js $basedir/target/core test-harness/node-optimization-harness
