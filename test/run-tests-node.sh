if [ ! -e node_modules ]; then mkdir node_modules; fi
cd scxml-test-framework
npm install
cd ..

#start the server
node node-test-server.js &
#keep the pid (so we can kill it later)
serverpid=$!

sleep 1

#run the client
cd scxml-test-framework/
node lib/test-client.js test/*/*.scxml
status=$?
cd ..

#kill the server
kill $serverpid

if [ "$status" = '0' ]; then echo SUCCESS; else echo FAILURE; fi;

exit $status
