#!/bin/bash
target=$1

shift

tests="$*"

echo "define([" > $target

totalTests=$#
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
