/*jsl:import common.js*/
/*jsl:import tests/tests.registry.js*/
             
//pull in deps from SCION
var scxml = require('core/scxml/SCXML'),
    JsonML = require('external/jsonml/jsonml-dom'),
    annotator = require('core/util/annotate-scxml-json'),
    json2model = require('core/scxml/json2model');

//maps short names to constructors/initializers
var opts = {
    sets : {
        'arraySet' : require("core/scxml/set/ArraySet"),
        'bitVector' : require("core/scxml/set/BitVector"),
        'boolArray' : require("core/scxml/set/BooleanArray"),
        'objectSet' : require("core/scxml/set/ObjectSet")
    },
    selectors : {
        "class" : require("research/optimization/class"),
        "switch" : require("research/optimization/switch"),
        "table" : require("research/optimization/state-table"),
        "default" : require('core/scxml/scxml-dynamic-name-match-transition-selector')
    }
};

function requestTestAndRun(){

    var result = {};

    $.getJSON("/test-please",function(test){

        console.log("Running test",test);

        function finish(){
            $.getJSON("/get-memory",function(memFinish){

                result.memFinish = memFinish;

                //finish by posting results
                $.post("/result",JSON.stringify(result),requestTestAndRun);
            });
        }

        $.getJSON("/get-memory",function(memStart){

            result.memStart = memStart;

            //first get your tests with jquery
            $.get(test.testScxmlUrl,function(doc){
                $.get(test.testScriptUrl,function(jsonTest){

                    //ok, now we need to make SCION available, so we can use its APIs
                    //first parse the document to a model
                    var arr = JsonML.parseDOM(doc);
                    var scxmlJson = arr[1];

                    var annotatedScxmlJson = annotator.transform(scxmlJson);

                    var model = json2model(annotatedScxmlJson,!test.extraModelInfo);    //note the optimization argument here

                    //take the annotated JSON and use it to generate transition selectors and sets
                    
                    //set type is all set up. 
                    //TODO: augment interpreter to pass in the standard info that he needs
                    var set = opts.sets[test.setType]; 

                    //get the generation function. then call it to get the string and eval him to get the constructor, then call the constructor with the transitions.
                    var selectorFn, transitionSelector = opts.selectors[test.transitionSelector]; 
                    if(test.transitionSelector !== 'default'){
                        var s = transitionSelector(model); 
                        var selectorInitializer = eval(s);
                        selectorFn = selectorInitializer(model.transitions,model.events);   //takes transitions,eventMap 
                    }else{
                        selectorFn = transitionSelector;    //no setup necessary
                    }
                    
                    //then we instantiate an interpreter, and pass stuff in as options
                    var interpreter = new scxml.SimpleInterpreter(model,{
                        transitionSelector : selectorFn,
                        TransitionSet : set,
                        StateSet : set,
                        BasicStateSet : set
                    });


                    var startTime = new Date();

                    //then we run through stuff and compare stuff and stuff
                    var initialConfiguration = interpreter.start();
                    /*
                    if(_.difference(initialConfiguration,jsonTest.initialConfiguration).length){
                        var m = "Received " + JSON.stringify(initialConfiguration) + " and expected " + JSON.stringify(jsonTest.initialConfiguration);
                        result.passed = false;
                        result.message = m;

                        console.error(m);
                        finish();
                        return;
                    }
                    */
                    

                    var eventTuple;
                    var eventCount = 0;
                    do{
                        var events = jsonTest.events.slice();
                        /*jsl:ignore*/
                        while(eventTuple = events.shift()){
                        /*jsl:end*/
                            var nextConfiguration = interpreter.gen(eventTuple.event); 
                            /*
                            if(_.difference(nextConfiguration,eventTuple.nextConfiguration).length){
                                m = "Received " + JSON.stringify(nextConfiguration) + " and expected " + JSON.stringify(eventTuple.nextConfiguration);
                                result.passed = false;
                                result.message = m;

                                console.error(m);
                                finish();
                                return;
                            }
                            */
                            eventCount++; 
                        }
                        var endTime = new Date();
                    }while( (endTime - startTime) < 100 )

                    result.passed = true;
                    result.eventCount = eventCount;
                    result.elapsedtime = endTime - startTime;
                    result.eventsPerMs = result.eventCount/result.elapsedtime;
                    console.info("Test passed");
                    finish();

                },"json");
            },"xml");
        });

    });
}

requestTestAndRun();
