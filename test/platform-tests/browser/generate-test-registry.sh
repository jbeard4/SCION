testJsonFiles=`find ../../scxml-test-framework/test -name "*.json" | sed -e "s:../..:/test:"`
numFiles=`echo $testJsonFiles | wc -w`

echo "var TEST_REGISTRY = [" > tests.js

i=1
for testJsonFile in $testJsonFiles;
do
    testDir=`dirname $testJsonFile`
    scFile=$testDir/`basename $testJsonFile .json`.scxml

    testName=`echo $testJsonFile | sed -e "s:/test/scxml-test-framework/test/::" | sed -e "s:.json::"`

    echo -n "    { name : '$testName', test : '$testJsonFile', scxml : '$scFile' }" >> tests.js

    #trailing comma
    if [ $i -lt $numFiles ] 
        then echo "," >> tests.js 
    else
        echo "" >> tests.js
    fi

    i=$(( i + 1 ))
done;


echo "];" >> tests.js
