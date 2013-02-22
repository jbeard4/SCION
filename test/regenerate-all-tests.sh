scxmlDir=~/workspace/scion/scxml-test-framework/test

for f in *; do
    if [ -d $f ]; then

        echo entering test dir $f...

        cd $f

        testGroup=`basename $f`

        for target in *.sc.json; do
            if [ -f $target ]; then
                testName=`basename $target .sc.json`.scxml
                from=$scxmlDir/$testGroup/$testName

                echo compiling $from to $target...

                node ~/workspace/scion/scion-scxml/scxml-to-scjson.js $from > $target 
            fi;
        done;

        for target in *.sc.js; do
            if [ -f $target ]; then
                testName=`basename $target .sc.js`.scxml
                from=$scxmlDir/$testGroup/$testName

                echo compiling $from to $target...

                node ~/workspace/scion/scion-scxml/scxml-to-scjson.js $from | node ~/workspace/scion/scion-scxml/scjson-to-module.js > $target 
            fi;
        done;

        echo exiting test dir $f...

        cd ..
    fi

done;

echo Regenerating the test registry
bash ./generate-test-registry.sh

echo Now run \"node harness.js\" to run all tests.
