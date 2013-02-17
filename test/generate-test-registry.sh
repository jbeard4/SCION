testJsonFiles=`find -name "*.test.json"`
numFiles=`echo $testJsonFiles | wc -w`

echo "module.exports = [" > tests.js

i=1
for testJsonFile in $testJsonFiles;
do
    testDir=`dirname $testJsonFile`
    smFile=$testDir/`basename $testJsonFile .test.json`.sm.json

    #alternatively, it could just be a regular module, rather than a json object literal
    if [ ! -e $smFile ]
        then smFile=$testDir/`basename $testJsonFile .test.json`.sm.js
    fi;

    echo -n "    { name : '$testJsonFile', test : require('$testJsonFile'), sm : require('$smFile') }" >> tests.js

    #trailing comma
    if [ $i -lt $numFiles ] 
        then echo "," >> tests.js 
    else
        echo "" >> tests.js
    fi

    i=$(( i + 1 ))
done;


echo "];" >> tests.js
