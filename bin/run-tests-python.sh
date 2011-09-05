#!/bin/sh
# Copyright (C) 2011 Jacob Beard
# Released under GNU LGPL, read the file 'COPYING' for more information

dn=`dirname $0`
abspath=`cd $dn; pwd`
basedir=`dirname $abspath`

PYTHONPATH=$PYTHONPATH:$basedir/src/main/python/:$basedir/lib/py/:$basedir/src/main/xslt/ python $basedir/src/main/python/scxml/test/harness.py $* #src/test/*/*.json
