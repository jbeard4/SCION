var scion = require('../lib/scion');

//require test cases
var basic0Model = require('./basic/basic0.scxml.json'),
    basic0Script = require('./basic/basic0.json');

var sc = new scion.Statechart(basic0Model);

sc.start();

var conf1 = sc.getConfiguration();

console.log('initial configuration',conf1); 

//cool
var conf2 = sc.getConfiguration();

console.log('next configuration',conf2); 
