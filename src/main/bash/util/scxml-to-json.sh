#!/bin/sh
# Copyright (C) 2011 Jacob Beard
# Released under GNU LGPL, read the file 'COPYING' for more information

f=`readlink -f $0`
dn=`dirname $f`
abspath=`cd $dn; pwd`
basedir=`dirname $abspath`
projdir=`cd $dn/../../../../; pwd`

#TODO: hook up optional beautification
scxmlFile=$1
shift	#all other args are params
xsltproc $projdir/lib/xsl/strip-whitespace.xsl $scxmlFile | \
#xsltproc $projdir/src/main/xslt/normalizeInitialStates.xsl - | \
xsltproc $projdir/lib/xsl/JsonML.xslt -
