var xml2jsonml = require('xml2jsonml'),
    scion = require('scion');

//1 - 2. get the xml file and convert it to jsonml
xml2jsonml.parseFile('basic1.scxml',function(err,scxmlJson){

    if(err){
        throw err;
    }

    //3. annotate jsonml
    var annotatedScxmlJson = scion.annotator.transform(scxmlJson,true,true,true,true);

    //4. Convert the SCXML-JSON document to a statechart object model. This step essentially converts id labels to object references, parses JavaScript scripts and expressions embedded in the SCXML as js functions, and does some validation for correctness. 
    var model = scion.json2model(annotatedScxmlJson); 
    console.log("model",model);

    //5. Use the statechart object model to instantiate an instance of the statechart interpreter. Optionally, we can pass to the construct an object to be used as the context object (the 'this' object) in script evaluation. Lots of other parameters are available.
    var interpreter = new scion.scxml.NodeInterpreter(model);
    console.log("interpreter",interpreter);

    //6. We would connect relevant event listeners to the statechart instance here.

    //7. Call the start method on the new intrepreter instance to start execution of the statechart.
    interpreter.start();

    //let's test it by printing current state
    console.log("initial configuration",interpreter.getConfiguration());

    //send an event, inspect new configuration
    console.log("sending event t");
    interpreter.gen({name : "t"});

    console.log("next configuration",interpreter.getConfiguration());
    
});

