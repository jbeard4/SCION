# Copyright (C) 2011 Jacob Beard
# Released under GNU LGPL, read the file 'COPYING' for more information

f=`readlink -f $0`
dn=`dirname $f`
abspath=`cd $dn; pwd`
t=`dirname $abspath`
basedir=`dirname $t`

moduleToRun=$1
shift
interpreter=${1-node}
shift

$interpreter $basedir/lib/js/r.js -lib $basedir/target/core/runner.js $basedir/target/core $moduleToRun $*
