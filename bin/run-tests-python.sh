#!/bin/sh
dn=`dirname $0`
abspath=`cd $dn; pwd`
basedir=`dirname $abspath`

PYTHONPATH=$PYTHONPATH:$basedir/src/main/python/:$basedir/lib/py/:$basedir/src/main/xslt/ python $basedir/src/main/python/scxml/test/harness.py $* #src/test/*/*.json
