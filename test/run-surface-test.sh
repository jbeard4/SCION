#this is to run the surface test - a test which is not supposed to test statechart semantics, but
#instead should test the standard interface exposed by node, rhino and browser scion modules.

python -m SimpleHTTPServer 8888 &
pid=$!

#run node test
node surface-test.js

#run browser test
java -cp ~/Downloads/rhino1_7R3/js.jar org.mozilla.javascript.tools.shell.Main -debug -modules ../lib -main surface-test.js

#open your browser of choice
gnome-open http://localhost:8888/surface-test.html
