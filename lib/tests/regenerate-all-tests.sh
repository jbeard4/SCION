for testCategory in basic parallel+interrupt hierarchy+documentOrder documentOrder parallel hierarchy; do
mkdir $testCategory;
for pathToJson in `find /home/jacob/workspace/scxml-test-framework/test/$testCategory -name '*.json'`; do 
  pathToScxml="${pathToJson%.json}.scxml";
  #d=$(basename $(dirname $pathToJson));
  targetTestFileName=$(basename $pathToJson .json).sc.json;
  targetScriptFileName=$(basename $pathToJson .json).test.json;
  targetTestRelativePath="$testCategory/$targetTestFileName";
  targetScriptRelativePath="$testCategory/$targetScriptFileName";
  echo "$pathToJson -> $targetScriptRelativePath";
  echo "$pathToScxml -> $targetTestRelativePath";
  cp $pathToJson $targetScriptRelativePath;
  node /home/jacob/workspace/SCION/bin/cli.js -c json -i $pathToScxml -o $targetTestRelativePath;
done;
done;

for testCategory in assign error w3c-ecma atom3-basic-tests actionSend data multiple-events-per-transition targetless-transition scxml-prefix-event-name-matching internal-transitions send-internal cond-js more-parallel delayedSend "in" send-data misc script default-initial-state "history" if-else assign-current-small-step script-src send-idlocation foreach; do
mkdir $testCategory;
for pathToJson in `find /home/jacob/workspace/scxml-test-framework/test/$testCategory -name '*.json'`; do 
  pathToScxml="${pathToJson%.json}.scxml";
  #d=$(basename $(dirname $pathToJson));
  targetTestFileName=$(basename $pathToJson .json).sc.js;
  targetScriptFileName=$(basename $pathToJson .json).test.json;
  targetTestRelativePath="$testCategory/$targetTestFileName";
  targetScriptRelativePath="$testCategory/$targetScriptFileName";
  echo "$pathToJson -> $targetScriptRelativePath";
  echo "$pathToScxml -> $targetTestRelativePath";
  cp $pathToJson $targetScriptRelativePath;
  node /home/jacob/workspace/SCION/bin/cli.js -c module -i $pathToScxml -o $targetTestRelativePath;
done;
done;
