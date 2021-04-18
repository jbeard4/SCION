testJsonFiles=`find . -name "*.test.json"`
numFiles=`echo $testJsonFiles | wc -w`

echo "module.exports = [" > tests.js

i=1
for testJsonFile in $testJsonFiles;
do
    testDir=`dirname $testJsonFile`
    scFile=$testDir/`basename $testJsonFile .test.json`.sc.json

    #alternatively, it could just be a regular module, rather than a json object literal
    if [ ! -e $scFile ]
        then scFile=$testDir/`basename $testJsonFile .test.json`.sc.js
    fi;

    echo -n "    { name : '$testJsonFile', test : require('$testJsonFile'), sc : require('$scFile') }" >> tests.js

    #trailing comma
    if [ $i -lt $numFiles ] 
        then echo "," >> tests.js 
    else
        echo "" >> tests.js
    fi

    i=$(( i + 1 ))
done;


echo "];" >> tests.js
