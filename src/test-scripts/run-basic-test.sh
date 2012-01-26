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

#first argument specifies the interpreter.
#TODO: make this more helpful

for interpreter in $@;
do $interpreter $basedir/lib/js/r.js -lib $basedir/target/core/runner.js $basedir/target/core test-harness/basic-test-harness
done;
