//the goal of this test script is not to test the detailed semantics of SCION (this is what scxml-test-framework is for),
//but instead is to provide test coverage of the unified API exposed by rhino, node and browser versions of SCION
//assume we have an http fileserver running in this directory on port 8888, and can require scion

var scion = require('scion');


//basic0 test
var s = 
'<?xml version="1.0" encoding="UTF-8"?>\n' + 
'<scxml \n' + 
'	xmlns="http://www.w3.org/2005/07/scxml"\n' + 
'	version="1.0"\n' + 
'	profile="ecmascript"\n' + 
'	id="root"\n' + 
'	initial="a">\n' + 
'	<state id="a"/>\n' + 
'</scxml>';

var tests = [
    function(){
        scion.pathToModel('./scxml-test-framework/test/basic/basic0.scxml',function(err,model){
            go(model);
        });
    },
    function(){
        scion.urlToModel('http://localhost:8888/scxml-test-framework/test/basic/basic0.scxml',function(err,model){
            go(model);
        });
    },
    function(){
        scion.documentStringToModel(s,function(err,model){
            go(model);
        });
    }
];

function go(model){
    var scxml = new scion.SCXML(model);
    var conf = scxml.start(); 
    if(!( conf && conf[0] === 'a' )) throw new Error('assertion failed');
}

tests.forEach(function(fn){fn();});
