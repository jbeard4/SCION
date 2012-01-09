# Copyright (C) 2011 Jacob Beard
# Released under GNU LGPL, read the file 'COPYING' for more information

dn=`dirname $0`
abspath=`cd $dn; pwd`
basedir=`dirname $abspath`

if [ ! -e $basedir/build/tests/loaders/spartan-loader-for-all-tests.js ]; then
	echo Please run \"make interpreter tests test-loader\" before running this file.
	exit 1
fi;

#first argument specifies the interpreter.
#TODO: make this more helpful

interpreter=${1-node}
$interpreter $basedir/lib/js/r.js -lib $basedir/build/core/runner.js $basedir/build/core scxml/test/basic-test-harness
