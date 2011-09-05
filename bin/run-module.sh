# Copyright (C) 2011 Jacob Beard
# Released under GNU LGPL, read the file 'COPYING' for more information

dn=`dirname $0`
abspath=`cd $dn; pwd`
basedir=`dirname $abspath`

moduleToRun=$1
interpreter=${2-"node"}

shift;shift;

$interpreter $basedir/lib/js/r.js $basedir/src/main/javascript/runner.js $basedir/build/ $moduleToRun $*
