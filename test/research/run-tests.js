/*jsl:import common.js*/
/*jsl:import tests/tests.registry.js*/
             

//TODO: registry of tests to run
//then, run through all combinations

//instantiate, initialize, run test script, verify results
//TODO: look into yabble, so we don't have to build each time? otherwise, just build each time. simple build :P
//also, get the xsl flattening thing
//we will need more control than what the current API offers, so make sure to build in provisions for that...
//we should use async.js. will be good for handling the async stuff. a basic async for loop.
//should create a registry with urls to all the tests. registry should be a list of tuples, [scxml,json]

//i feel like i should be able to get this going tomorrow without too much trouble.

//and then we build up a big flat data structure of results. dump it in the page, or send it to the server. 

//so first we build up our big "test descriptor" array, containing urls to test scxml, test script, and optimization profile.

var testDescriptors = [];

tests.forEach(function(test){ 
    transitionSelectors.forEach(function(transitionSelector){
        setTypes.forEach(function(setType){
            extraModelInfo.forEach(function(modelInfo){ 
                flattened.forEach(function(flat){
                    testDescriptors.push({
                        testScxmlUrl : test,
                        testScriptUrl : test.split(".")[0] + ".json",
                        transitionSelector : transitionSelector,
                        setType : setType,
                        extraModelInfo : extraModelInfo,
                        flattened : flat
                    });
                }); 
            });
        }); 
    });
});

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

//ok, now that we have our test descriptor
async.forEachSeries(testDescriptors,function(test,cb){
    //now the fun part. we have to initialize these things.
    console.log("Running test",test);

    function finish(){
        $.getJSON("/get-memory",function(memFinish){
            test.result.memFinish = memFinish;

            //save results to server
            $.post("/result",test,function(){
                cb();
            })
        });
    }

    $.getJSON("/get-memory",function(memStart){

        test.result = {memStart : memStart};

        //first get your tests with jquery
        //TODO: we should maybe get the flattened one if flattened?
        var root = test.flattened ? "tests/flattened" : "tests";
        $.get( root + test.testScxmlUrl,function(doc){
            $.get(root + test.testScriptUrl,function(jsonTest){

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

                var passed = true;

                //then we run through stuff and compare stuff and stuff
                var initialConfiguration = interpreter.start();
                if(_.difference(initialConfiguration,jsonTest.initialConfiguration).length){
                    var m = "Received " + JSON.stringify(initialConfiguration) + " and expected " + JSON.stringify(jsonTest.initialConfiguration);
                    test.result.passed = false;
                    test.result.message = m;

                    console.error(m);
                    finish();
                    return;
                }
                

                //TODO: run for a while and collect stats
                var eventTuple;
                var events = jsonTest.events.slice();
                /*jsl:ignore*/
                while(eventTuple = events.shift()){
                /*jsl:end*/
                    var nextConfiguration = interpreter.gen(eventTuple.event); 
                    if(_.difference(nextConfiguration,eventTuple.nextConfiguration).length){
                        m = "Received " + JSON.stringify(nextConfiguration) + " and expected " + JSON.stringify(eventTuple.nextConfiguration);
                        test.result.passed = false;
                        test.result.message = m;

                        console.error(m);
                        finish();
                        return;
                    }
                }

                test.result.passed = true;
                console.info("Test passed");
                finish();

            },"json");
        },"xml");
    });
},function(){
    //everything complete. post results to server, or something
    /*
    $.post("/",testDescriptors,function(r){
        console.log(r);
    });
    */
    console.log("All done!");
    results = testDescriptors; 
    var failed = testDescriptors.filter(function(test){return !test.result;}).length;
    console.log(failed ? "FAILURE" : "SUCCESS" );
    
    $.post("/done");
});
