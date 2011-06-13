#!/bin/bash
#this script packages tests into a form that can be easily consumed by spartan shell environments running RequireJS
dn=`dirname $0`
abspath=`cd $dn; pwd`
basedir=`dirname $abspath`
projdir=`cd $dn/../../../../; pwd`
utildir=`cd $dn/../util/; pwd`

for testDir in $projdir/src/test/*; do 

	testDirBase=`basename $testDir`; 
	mkdir $projdir/build/test/$testDirBase; 

	for scxmlFile in $testDir/*.scxml; do 
		scxmlFileBase=`basename $scxmlFile`; 
		scxmlFileWithoutExtension=${scxmlFileBase%.*}
		jsonTestFile="$scxmlFileWithoutExtension.json"
		target="$scxmlFileWithoutExtension.js"
		
		scxmlAsJsonContents=`sh $utildir/scxml-to-json.sh $scxmlFile`
		jsonTestFileContents=`cat $testDir/$jsonTestFile`

		(
		cat <<-EndOfFile
		define({
			"testScript" : $jsonTestFileContents,
			"scxmlJson" : $scxmlAsJsonContents
		}) 
		EndOfFile
		) > $projdir/build/test/$testDirBase/$target
	done; 
done
