#!/bin/sh
dn=`dirname $0`
abspath=`cd $dn; pwd`
basedir=`dirname $abspath`
projdir=`cd $dn/../../../../; pwd`

#TODO: hook up optional beautification
scxmlFile=$1
shift	#all other args are params
xsltproc $projdir/src/main/xslt/normalizeInitialStates.xsl $scxmlFile | xsltproc $* $projdir/src/main/xslt/scxmlToJSON.xsl -
