var scion = require('../../..');
var tests = require('scion-core-test-framework')(scion.Statechart,{ 
  // these tests are known to fail for legacy SCION semantics
  testsToIgnore : [
    './parallel+interrupt/test21.test.json(serialization)(async)',
    './parallel+interrupt/test7.test.json(serialization)(async)',
    './w3c-ecma/test403c.txml.test.json(serialization)(async)',
    './more-parallel/test6.test.json(serialization)(async)',
    './more-parallel/test2.test.json(serialization)(async)',
    './more-parallel/test10.test.json(serialization)(async)',
    './more-parallel/test10.test.json(serialization)(async)',
    './more-parallel/test3.test.json(serialization)(async)',
    './parallel+interrupt/test21.test.json(serialization)',
    './parallel+interrupt/test7.test.json(serialization)',
    './w3c-ecma/test403c.txml.test.json(serialization)',
    './more-parallel/test6.test.json(serialization)',
    './more-parallel/test2.test.json(serialization)',
    './more-parallel/test10.test.json(serialization)',
    './more-parallel/test10.test.json(serialization)',
    './more-parallel/test3.test.json(serialization)',
    './parallel+interrupt/test21.test.json(async)',
    './parallel+interrupt/test7.test.json(async)',
    './w3c-ecma/test403c.txml.test.json(async)',
    './more-parallel/test6.test.json(async)',
    './more-parallel/test2.test.json(async)',
    './more-parallel/test10.test.json(async)',
    './more-parallel/test10.test.json(async)',
    './more-parallel/test3.test.json(async)',
    './parallel+interrupt/test21.test.json',
    './parallel+interrupt/test7.test.json',
    './w3c-ecma/test403c.txml.test.json',
    './more-parallel/test6.test.json',
    './more-parallel/test2.test.json',
    './more-parallel/test10.test.json',
    './more-parallel/test10.test.json',
    './more-parallel/test3.test.json'
  ]});

Object.keys(tests).forEach(function(key){
  exports[key] = tests[key];
}); 
