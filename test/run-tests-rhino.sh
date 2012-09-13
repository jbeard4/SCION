#!/bin/bash

#start the server
#assume rhino version 1.7R3
rhino -debug -modules ../lib -main rhino-test-server.js &

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
