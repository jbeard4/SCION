#!/bin/bash

#start the server
java -cp ~/Downloads/rhino1_7R3/js.jar org.mozilla.javascript.tools.shell.Main -debug -modules ../lib -main rhino-test-server.js &

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
