if [ ! -e node_modules ]; then mkdir node_modules; fi
npm install request underscore nopt node-static github cli-table ..   #install scion as a dependency, and scxml-test-framework's dependencies

#start the server
node node-test-server.js &
#keep the pid (so we can kill it later)
serverpid=$!

sleep 1

#run the client
node scxml-test-framework/lib/test-client.js -v -r console \
  scxml-test-framework/test/w3c-ecma/test150.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test151.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test329.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test525.txml.scxml
  #FIXME issue #29 - re-enable scxml-test-framework/test/actionSend/*.scxml \

status=$?

#kill the server
kill $serverpid

if [ "$status" = '0' ]; then echo SUCCESS; else echo FAILURE; fi;

exit $status
