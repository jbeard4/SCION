if [ ! -e node_modules ]; then mkdir node_modules; fi
npm install request underscore ..   #install scion and stuff

#start the server
node node-test-server.js &
#keep the pid (so we can kill it later)
serverpid=$!

sleep 1

#run the client
node scxml-test-framework/lib/test-client.js scxml-test-framework/test/*/*.scxml
status=$?

#kill the server
kill $serverpid

if [ "$status" = '0' ]; then echo SUCCESS; else echo FAILURE; fi;

exit $status
