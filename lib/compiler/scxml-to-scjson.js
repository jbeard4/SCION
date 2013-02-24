var fs = require('fs');

var sax = require("sax"),
    strict = true, // set to false for html-mode
    parser = sax.parser(strict,{trim : true, xmlns : true});

function merge(o1,o2){
    Object.keys(o2).forEach(function(k){
        o1[k] = o2[k]; 
    });
    return o1;
}

function copyNsAttrObj(o){
    var r = {};
    Object.keys(o).forEach(function(k){
        r[o[k].local] = o[k].value; 
    });
    return r;
}

function transform(){
    var rootJson, 
        currentJson, 
        expressionAttributeCache,      //we cache them because in sax-js attributes get processed before the nodes they're attached to,
                                            //and this is the only way we can capture their row/col numbers.
                                            //so when we finally find one, it gets popped off the stack. 
        jsonStack = [],
        allTransitions = [];                 //we keep a reference to these so we can clean up the onTransition property later


    function createActionJson(node){
        var action = merge(
                    {
                        $line : parser.line,
                        $column : parser.column,
                        type:node.local
                    },
                    copyNsAttrObj(node.attributes));

        //console.log('action node',node);

        var actionContainer;
        if(Array.isArray(currentJson)){
            //this will be onExit and onEntry
            actionContainer = currentJson;
        }else{
            //if it's any other action
            actionContainer = currentJson.actions = currentJson.actions || [];
        }

        actionContainer.push(action);

        return currentJson = action;
    }

    function createDataJson(node){
        return merge({
                    $line : parser.line,
                    $column : parser.column
                },
                copyNsAttrObj(node.attributes));
    }

    function createStateJson(node){
        var state = copyNsAttrObj(node.attributes);

        if(state.type){
            state.isDeep = state.type === 'deep' ? true : false;
        }

        //"state" is the default, so you don't need to explicitly write it
        if(node.local !== 'state' && node.local !== 'schema') state.type = node.local;

        if(currentJson){ 
            if(!currentJson.states){
                currentJson.states = [];
            }

            currentJson.states.push(state);
        }

        return currentJson = state;
    }

    function createTransitionJson(node){

        var transition = copyNsAttrObj(node.attributes);

        //target can either be a string, an array (for multiple targets, e.g. targeting, or undefined
        if(transition.target){
            //console.log('transition',transition);
            transition.target = transition.target.trim().split(/\s+/);
            if(transition.target.length === 1){
                transition.target = transition.target[0];
            }
        }

        if(currentJson){ 
            if(!currentJson.transitions){
                currentJson.transitions = [];
            }

            currentJson.transitions.push(transition);
        }

        allTransitions.push(transition);

        return currentJson = transition;
    }

    function createExpression(value){
        return {
            $line : parser.line,
            $column : parser.column,
            expr : value
        };
    }

    var tagActions = {
        "scxml": function(node){
            return rootJson = createStateJson(node);
        },
        "initial": createStateJson,
        "history":createStateJson,
        "state":createStateJson,
        "parallel":createStateJson,
        "final":createStateJson,

        //transitions/action containers
        "transition" : createTransitionJson,

        "onentry":function(node){
            currentJson = currentJson.onEntry = [];
        },
        "onexit":function(node){
            currentJson = currentJson.onExit = [];
        },

        //actions
        "foreach" : createActionJson,
        "raise" : createActionJson,
        "log": createActionJson,
        "assign": createActionJson,
        "validate":createActionJson,
        "script":createActionJson,
        "cancel":createActionJson,
        //TODO: deal with namelist
        //TODO: decide how to deal with location expressions, as opposed to regular expressions
        "send":createActionJson,

        //children of send
        "param": function(node){
            //TODO: figure out how to deal with param and param/@expr and param/@location
            currentJson.params = currentJson.params || [];
            var attr = copyNsAttrObj(node.attributes);
            currentJson.params.push(attr);
            currentJson = attr;
        },
        "content":function(){
            //skip. this gets taken care of later on
        },

        //these are treated a bit special - TODO: normalize/decide on a representation
        "if" : createActionJson,
        "elseif" : createActionJson,
        "else" : createActionJson,

        //data
        "datamodel":function(node){
            //console.log('datamodel currentJson',currentJson);
            currentJson = currentJson.datamodel = [];
        },
        "data":function(node){
            //console.log('data currentJson',currentJson);
            currentJson.push(createDataJson(node));
        }

        //TODO: these
        //"invoke":,
        //"finalize":,
        //"donedata":
    };

    expressionAttributeCache = {};  //TODO: put in onstart or something like that

    parser.onopentag = function (node) {
        //console.log("open tag",node.local);

        if(tagActions[node.local]){
            tagActions[node.local](node);

            jsonStack.push(currentJson);
            //console.log('current json now',currentJson,jsonStack.length); 

            //merge in the current expression attribute cache
            merge(currentJson,expressionAttributeCache);

            expressionAttributeCache = {};  //clear the expression attribute cache
        }

    };

    var EXPRESSION_ATTRS = [ 'cond',
                            'array',
                            'location',
                            'namelist'];

    parser.onclosetag = function(tag){
        //console.log("close tag",tag);
        jsonStack.pop();
        currentJson = jsonStack[jsonStack.length - 1];
        //console.log('current json now',currentJson,jsonStack.length); 
    };

    parser.onattribute = function (attr) {
        //if attribute name ends with 'expr' or is one of the other ones enumerated above
        //then cache him and his position
        if( attr.name.match(/^.*expr$/) ||
            EXPRESSION_ATTRS.indexOf(attr.name) > -1){
            expressionAttributeCache[attr.name] = createExpression(attr.value);
        }
    };

    parser.onerror = function (e) {
        // an error happened.
        throw e;
    };

    parser.ontext = function (t) {
        //the only text we care about is that inside of <script> and <content>
        if(currentJson && currentJson.type){
            if(currentJson.type === 'script'){
                currentJson.content = t;        //I don't think we need a separate expression for this w/ line/col mapping
            }else if(currentJson.type === 'send'){
                currentJson.content = t;
            }
        }
    };

    parser.onend = function () {
        //do some scrubbing of root attributes
        delete rootJson.xmlns;
        delete rootJson.type;
        delete rootJson.version;

        if(typeof rootJson.datamodel === 'string') delete rootJson.datamodel;       //this would happen if we have, e.g. state.datamodel === 'ecmascript'

        //change the property name of transition event to something nicer
        allTransitions.forEach(function(transition){
            transition.onTransition = transition.actions;
            delete transition.actions;
        });
    };


    //TODO: figure out what is the best way to acutally read from this mofo... stream, string, file, or what.
    parser.write(fs.readFileSync(process.argv[2],'utf8')).close();

    return rootJson;

    //TODO: sort out normalization of initial states as well
}


/*
// stream usage
// takes the same options as the parser
var saxStream = require("sax").createStream(strict, options)
saxStream.on("error", function (e) {
    // unhandled errors will throw, since this is a proper node
    // event emitter.
    console.error("error!", e)
    // clear the error
    this._parser.error = null
    this._parser.resume()
})
saxStream.on("opentag", function (node) {
    // same object as above
})
// pipe is supported, and it's readable/writable
// same chunks coming in also go out.
fs.createReadStream("file.xml")
    .pipe(saxStream)
    .pipe(fs.createReadStream("file-copy.xml"))
*/

console.log(JSON.stringify(transform(),4,4));

/*
 * we want the data model to be versatile. So, state.onentry, state.onexit, transition.onTransition, and all other <action.onTransition should either be
 * a string, representing a function
 * an actual function
 * an array containing either of the above
 * an object containing "$line" and "$column" properties
 */
