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
  scxml-test-framework/test/w3c-ecma/test144.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test147.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test148.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test149.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test150.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test151.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test153.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test155.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test158.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test159.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test172.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test173.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test174.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test175.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test176.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test183.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test185.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test186.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test194.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test199.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test200.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test201.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test205.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test278.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test279.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test287.txml.scxml \
  scxml-test-framework/test/w3c-ecma-modified/test301.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test302.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test304.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test309.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test310.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test312.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test313.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test314.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test318.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test319.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test321.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test322.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test323.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test324.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test325.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test326.txml.scxml \
  scxml-test-framework/test/w3c-ecma-modified/test329-1.txml.scxml \
  scxml-test-framework/test/w3c-ecma-modified/test329-2.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test332.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test333.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test335.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test337.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test339.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test342.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test346.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test355.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test375.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test376.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test377.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test378.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test387.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test396.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test399.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test403a.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test403b.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test404.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test405.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test407.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test436.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test444.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test445.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test448.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test449.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test451.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test487.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test505.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test525.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test550.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test551.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test552.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test558.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test560.txml.scxml \
  scxml-test-framework/test/w3c-ecma/test569.txml.scxml \
  scxml-test-framework/test/misc/*.scxml
  #FIXME w3c-ecma-modified/test301 should kill the process not raise error.
  #FIXME issue #29 - re-enable scxml-test-framework/test/actionSend/*.scxml \

status=$?

#kill the server
kill $serverpid

if [ "$status" = '0' ]; then echo SUCCESS; else echo FAILURE; fi;

exit $status
