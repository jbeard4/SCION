# Copyright (C) 2011 Jacob Beard
# Released under GNU LGPL, read the file 'COPYING' for more information

dn=`dirname $0`
abspath=`cd $dn; pwd`
basedir=`dirname $abspath`

moduleToRun=$1

shift

r.js $basedir/build/core/runner.js $basedir/build/core $moduleToRun $*
