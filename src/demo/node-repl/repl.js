var repl = require('repl'),
	fs = require('fs'),
	scion = require('scion');

var annotatedScxmlJsonStr = fs.readFileSync(process.argv[2],'utf8');

try{
	var annotatedScxmlJson = JSON.parse(annotatedScxmlJsonStr);
}catch(e){
	console.error(e);
	process.exit(1);
}

//4. Convert the SCXML-JSON document to a statechart object model. This step essentially converts id labels to object references, parses JavaScript scripts and expressions embedded in the SCXML as js functions, and does some validation for correctness. 
var model = scion.json2model(annotatedScxmlJson);
console.log("model",model)

//5. Use the statechart object model to instantiate an instance of the statechart interpreter. Optionally, we can pass to the construct an object to be used as the context object (the 'this' object) in script evaluation. Lots of other parameters are available.
var interpreter = new scion.NodeInterpreter(model);
console.log("interpreter",interpreter);

//7. Call the start method on the new intrepreter instance to start execution of the statechart.
interpreter.start();

//let's test it by printing current state
console.log("initial configuration",interpreter.getConfiguration());

var parseRE = /\((.*)\n\)/;

function processEvent(cmd,dontKnow,alsoDontKnow,callback){
	var e = cmd.match(parseRE)[1];
	interpreter.gen(new scion.Event(e));
	conf = interpreter.getConfiguration();
	callback(null,conf.iter());
}
	
//start 
repl.start('#',process.stdin,processEvent);
