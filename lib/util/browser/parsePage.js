/*

This module exists to parse the SCXML from an HTML/SVG page once it's loaded.

A statechart is initialized from an XML document as follows:
1. Get the SCXML document.
2. Convert the XML to JsonML using XSLT or DOM, and parse the JSON to
    an SCXML-JSON document.
3. Annotate and transform the SCXML-JSON document so that it is in a
    form more congenial to interpretation, creating an annotated SCXML-JSON
    document
4. Convert the SCXML-JSON document to a statechart object model. This
    step essentially converts id labels to object references, parses JavaScript
    scripts and expressions embedded in the SCXML as js functions, and does some
    validation for correctness. 
5. Use the statechart object model to instantiate an instance of the
    statechart interpreter. Optionally, we can pass to the construct an object to
    be used as the context object (the 'this' object) in script evaluation. Lots of
    other parameters are available.
6. Connect relevant event listeners to the statechart instance.
7. Call the start method on the new intrepreter instance to start
    execution of the statechart.

Also note that steps 1-3 can be done ahead-of-time. The annotated
    SCXML-JSON object can be serialized as JSON and sent across the wire before
    being converted to a statechart object model in step 4. 
*/


var scion = require('../../scion'),
    _ = require('../underscore-wrapper');

module.exports = function(){

    var scxmlElements = document.getElementsByTagName("scxml");

    _(scxmlElements).forEach(function(scxml){
        console.log("scxml",scxml);

        //step 1 - get the scxml document
        var domNodeToHookUp = scxml.parentNode;
        console.log("domNodeToHookUp",domNodeToHookUp);

        //prep scxml document to transform by pulling the scxml node into its own document
        var scxmlns = "http://www.w3.org/2005/07/scxml";
        var scxmlToTransform = document.implementation.createDocument(scxmlns,"scxml",null);
        var newNode = scxmlToTransform.importNode(scxml.cloneNode(true),true);
        scxmlToTransform.replaceChild(newNode,scxmlToTransform.documentElement);
        console.log("newNode",newNode);

        //step 2 - transform scxmlToTransform to JSON
        var scxmlJson = JsonML.parseDOM(scxmlToTransform)[1];
        console.log("scxmlJson",scxmlJson);

        //step 3 - transform the parsed JSON model so it is friendlier to interpretation
        var annotatedScxmlJson = scion.annotator.transform(scxmlJson,true,true,true,true);
        console.log("annotatedScxmlJson",annotatedScxmlJson);

        //step 4 - initialize sc object model
        var model = scion.json2model(annotatedScxmlJson);
        console.log("model",model);
        
        //step 5 - instantiate statechart
        var interpreter = new scion.scxml.BrowserInterpreter(model,{evaluationContext : domNodeToHookUp});
        console.log("interpreter",interpreter);

        //step 6 - connect all relevant event listeners - maybe encoded in DOM?
        //we use DOM to allow this to be set up declaratively
        
        var scionNS ="https://github.com/jbeard4/SCION"

        if(scxml.hasAttributeNS(scionNS,"domEventsToConnect")){
            var eventsString = scxml.getAttributeNS(scionNS,"domEventsToConnect");
            var eventsToConnect = eventsString.split(/\s*,\s*/);

            _(eventsToConnect).forEach(function(eventName){
                domNodeToHookUp.addEventListener(
                    eventName,
                    function(e){
                        e.preventDefault();
                        interpreter.gen({name : eventName,data:e});
                    },
                    false);
            });
        }

        //step 7 - start statechart
        interpreter.start()
    });
};
