#!/bin/bash
dn=`dirname $0`
abspath=`cd $dn; pwd`
basedir=`dirname $abspath`
projdir=`cd $dn/../../../../; pwd`
utildir=`cd $dn/../util/; pwd`

for i in $projdir/src/test/*; do 
	x=`basename $i`; 
	mkdir $projdir/build/test/$x; 
	for scxmlFile in $i/*.scxml; do 
		y=`basename $scxmlFile`; 
		echo converting $scxmlFile to json at "$projdir/build/test/$x/$y.js"; 
		$utildir/scxml-to-json.sh $scxmlFile --param wrapInAsyncModuleDefinition "true()" > $projdir/build/test/$x/$y.js; 
	done; 
done
