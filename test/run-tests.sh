npm install request

#start the server
node test-server.js &
#keep the pid (so we can kill it later)
serverpid=$!

#run the client
node scxml-test-framework/lib/test-client.js scxml-test-framework/test/*/*.scxml
status=$?

#kill the server
kill $serverpid

if [ "$status" = '0' ]; then echo SUCCESS; else echo FAILURE; fi;
