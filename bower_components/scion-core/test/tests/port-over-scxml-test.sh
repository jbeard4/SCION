#TODO: parameterize this so that it will dump out either a pure JSON document or a js module.
testDir=$1
echo transforming tests from $testDir
for i in $1/*.scxml; do 
    echo "node ~/workspace/scion/scion-scxml/scxml-to-scjson.js $i | node ~/workspace/scion/scion-scxml/scjson-to-module.js > `basename $i .scxml`.sc.js;"
    node ~/workspace/scion/scion-scxml/scxml-to-scjson.js $i | node ~/workspace/scion/scion-scxml/scjson-to-module.js > `basename $i .scxml`.sc.js; 
done;
for i in $1/*.json; do echo $i; cp $i `basename $i .json`.test.json; done;
