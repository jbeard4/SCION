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

echo $tests

totalTests=`echo "$tests" | wc -l`
numTests=0

echo $totalTests

for testModule in $tests; do
	numTests=$(($numTests+1))

	echo $numTests

	testFileBase=`basename $testModule`; 
	testFileWithoutExtension=${testFileBase%.*}

	testDir=`dirname $testModule`;
	testDirBase=`basename $testDir`;

	echo -n -e "\t'test/$testDirBase/$testFileWithoutExtension'" >> $target

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
