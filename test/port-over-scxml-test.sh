testDir=$1
echo transforming tests from $testDir
for i in $1/*.scxml; do echo $i; node ~/workspace/scion/scion-scxml/scxml-to-json.js $i > `basename $i .scxml`.sm.json; done;
for i in $1/*.json; do echo $i; cp $i `basename $i .json`.test.json; done;
