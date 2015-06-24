spec=spec.js
testJsonFiles=`find ../../scxml-test-framework/test -name "*.json" | sed -e "s:../..:/base:"`
numFiles=`echo $testJsonFiles | wc -w`

echo "[" > $spec

i=1
for testJsonFile in $testJsonFiles;
do
    testDir=`dirname $testJsonFile`
    scFile=$testDir/`basename $testJsonFile .json`.scxml

    testName=`echo $testJsonFile | sed -e "s:/test/scxml-test-framework/test/::" | sed -e "s:.json::"`

    echo -n "    { name : '$testName', test : '$testJsonFile', scxml : '$scFile' }" >> $spec

    #trailing comma
    if [ $i -lt $numFiles ] 
        then echo "," >> $spec 
    else
        echo "" >> $spec
    fi

    i=$(( i + 1 ))
done;


cat << EOF >> $spec
].forEach(function(test){
    var tmp = test.name.split('/'), testGroup = tmp[0], testName = tmp[1];

    module(testGroup);
    asyncTest(testName,function(){
        $.getJSON(test.test,function(testScript){
            scxml.urlToModel(test.scxml,function(err,model){
                if(err) throw err;

                var sc = new scxml.scion.Statechart(model);
                var actualInitialConf = sc.start();

                console.log('initial configuration',actualInitialConf);

                deepEqual(actualInitialConf.sort(),testScript.initialConfiguration.sort(),'initial configuration');

                async.forEachSeries(testScript.events,function(nextEvent,cb){

                    function ns(){
                        console.log('sending event',nextEvent.event);

                        var actualNextConf = sc.gen(nextEvent.event);

                        console.log('next configuration',actualNextConf);

                        deepEqual(actualNextConf.sort(),nextEvent.nextConfiguration.sort(),'next configuration after sending event ' + JSON.stringify(nextEvent));

                        cb();
                    }

                    if(nextEvent.after){
                        console.log('Test harness waiting',nextEvent.after,'ms before sending next event');
                        setTimeout(ns,nextEvent.after);
                    }else{
                        ns();
                    }
                },start);

            });
        });
    });
});
EOF
