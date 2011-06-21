#!/bin/bash
target=$1

shift

tests="$*"

echo "define([" > $target

totalTests=$#
numTests=0

for testModule in $tests; do
	numTests=$(($numTests+1))

	truncatedTestModule=`echo $testModule | sed -e "s/.*build\///"`
	truncatedTestModuleWithoutExtension=${truncatedTestModule%.*}

	echo -ne "\t'$truncatedTestModuleWithoutExtension'" >> $target

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
