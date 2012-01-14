npm install scion

mkdir build

#1. Get the SCXML document. Nothing to do for now...

#2. Convert the XML to JsonML using XSLT or DOM, and parse the JSON to an SCXML-JSON document.
scxml-to-json basic1.scxml > build/basic1.scxml.json

#3. Annotate and transform the SCXML-JSON document so that it is in a form more congenial to interpretation, creating an annotated SCXML-JSON document
annotate-scxml-json build/basic1.scxml.json build/basic1.annotated.scxml.json

#note: you could also combine the above steps as follows:
#scxml-to-json basic1.scxml | annotate-scxml-json - build/basic1.annotated.scxml.json

#call into node to do the rest
node test.js
