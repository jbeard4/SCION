if [ ! -e node_modules ]; then mkdir node_modules; fi
npm install request underscore nopt node-static github cli-table ..   #install scion as a dependency, and scxml-test-framework's dependencies

#start the server
node node-test-server.js &
#keep the pid (so we can kill it later)
serverpid=$!

sleep 1

#run the client
node scxml-test-framework/lib/test-client.js -v -r console \
  scxml-test-framework/test/assign-current-small-step/*.scxml \
  scxml-test-framework/test/atom3-basic-tests/*.scxml \
  scxml-test-framework/test/basic/*.scxml \
  scxml-test-framework/test/cond-js/*.scxml \
  scxml-test-framework/test/default-initial-state/*.scxml \
  scxml-test-framework/test/delayedSend/*.scxml \
  scxml-test-framework/test/documentOrder/*.scxml \
  scxml-test-framework/test/foreach/*.scxml \
  scxml-test-framework/test/hierarchy/*.scxml \
  scxml-test-framework/test/hierarchy+documentOrder/*.scxml \
  scxml-test-framework/test/history/*.scxml \
  scxml-test-framework/test/if-else/*.scxml \
  scxml-test-framework/test/in/*.scxml \
  scxml-test-framework/test/internal-transitions/*.scxml \
  scxml-test-framework/test/more-parallel/*.scxml \
  scxml-test-framework/test/multiple-events-per-transition/*.scxml \
  scxml-test-framework/test/parallel/*.scxml \
  scxml-test-framework/test/parallel+interrupt/*.scxml \
  scxml-test-framework/test/script/*.scxml \
  scxml-test-framework/test/script-src/*.scxml \
  scxml-test-framework/test/scxml-prefix-event-name-matching/*.scxml \
  scxml-test-framework/test/send-data/*.scxml \
  scxml-test-framework/test/send-internal/*.scxml \
  scxml-test-framework/test/targetless-transition/*.scxml \
  scxml-test-framework/test/w3c-ecma/test150.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test151.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test198.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test199.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test200.txml.scxml \
  scxml-test-framework/test/w3c-ecma-modified/test200-1.txml.scxml \
  scxml-test-framework/test/w3c-ecma-modified/test200-2.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test201.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test309.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test312.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test313.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test314.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test321.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test322.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test323.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test324.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test325.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test326.txml.scxml \
  scxml-test-framework/test/w3c-ecma-modified/test329-1.txml.scxml \
  scxml-test-framework/test/w3c-ecma-modified/test329-2.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test525.txml.scxml
  #FIXME issue #29 - re-enable scxml-test-framework/test/actionSend/*.scxml \

status=$?

#kill the server
kill $serverpid

if [ "$status" = '0' ]; then echo SUCCESS; else echo FAILURE; fi;

exit $status
