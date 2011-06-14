#!/bin/bash
#this script packages tests into a form that can be easily consumed by spartan shell environments running RequireJS
dn=`dirname $0`
abspath=`cd $dn; pwd`
basedir=`dirname $abspath`
projdir=`cd $dn/../../../../; pwd`
utildir=`cd $dn/../util/; pwd`

target=$projdir/build/spartanLoaderForAllTests.js

echo "define([" > $target

tests=`find $projdir/build/test/ -name "*.js"`

totalTests=`echo "$tests" | wc -l`
numTests=0

for testModule in $tests; do
	numTests=$(($numTests+1))

	testFileBase=`basename $testModule`; 
	testFileWithoutExtension=${testFileBase%.*}

	testDir=`dirname $testModule`;
	testDirBase=`basename $testDir`;

	echo -ne "\t'test/$testDirBase/$testFileWithoutExtension'" >> $target

	if [ $numTests -ne $totalTests ]; then
		echo , >> $target
	fi;
done;	

(
cat <<-EndOfFile
],function(){
	return Array.prototype.slice.call(arguments);
}); 
EndOfFile
) >> $target
