# Copyright (C) 2011 Jacob Beard
# Released under GNU LGPL, read the file 'COPYING' for more information

dn=`dirname $0`
abspath=`cd $dn; pwd`
basedir=`dirname $abspath`

for interpreter in spidermonkey-js v8-js webcore-js; do
$basedir/bin/run-tests-spartan-shell.sh $interpreter;
done;
