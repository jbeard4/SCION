#npm install -g scion coffee-script
mkdir -p build

#2. Convert the XML to JsonML using XSLT or DOM, and parse the JSON to an SCXML-JSON document.
#3. Annotate and transform the SCXML-JSON document so that it is in a form more congenial to interpretation, creating an annotated SCXML-JSON document
filename=`basename $1`
scxml-to-json $1 > build/$filename.json 
NODE_NO_READLINE=1 node repl.js build/$filename.json
