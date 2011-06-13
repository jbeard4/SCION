#!/bin/sh
dn=`dirname $0`
abspath=`cd $dn; pwd`
basedir=`dirname $abspath`
#TODO: hook up optional beautification
scxmlFile=$1
shift	#all other args are params
xsltproc $basedir/src/main/xslt/normalizeInitialStates.xsl $scxmlFile | xsltproc $* $basedir/src/main/xslt/scxmlToJSON.xsl -
