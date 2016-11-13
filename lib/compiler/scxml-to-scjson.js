//TODO: resolve data/@src and script/@src. either here, or in a separate module.
//TODO: remove nodejs dependencies
//TODO: decide on a friendly, portable interface to this module. streaming is possible, but maybe not very portable.

var sax = require("sax"),
    strict = true, // set to false for html-mode
    parser;

function merge(o1,o2){
    Object.keys(o2).forEach(function(k){
        o1[k] = o2[k];
    });
    return o1;
}

function getNormalizedAttributeName(attr){
  return attr.uri ? '{' + attr.uri + '}' + attr.local : attr.local;
}

function copyNsAttrObj(o){
    var r = {};
    Object.keys(o).forEach(function(k){
        var attr = o[k];
        r[getNormalizedAttributeName(attr)] = attr.value;
    });
    return r;
}

function transform(xmlString){
    parser = sax.parser(strict,{trim : true, xmlns : true});

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
                        $type: node.local
                    },
                    copyNsAttrObj(node.attributes));

        //console.log('action node',node);

        var actionContainer;
        if(Array.isArray(currentJson)){
            //this will be onExit and onEntry
            currentJson.push(action);
        }else if(currentJson.$type === 'scxml' && action.$type === 'script'){
            //top-level script
            currentJson.rootScripts = currentJson.rootScripts || [];
            currentJson.rootScripts.push(action);
        }else{
            //if it's any other action
            currentJson.actions = currentJson.actions || [];
            currentJson.actions.push(action);
        }


        return currentJson = action;
    }

    function createDataJson(node){
        currentJson =
            merge({
                $line : parser.line,
                $column : parser.column,
                $type : 'data'
            },
            copyNsAttrObj(node.attributes));
        return currentJson;
    }

    function createStateJson(node){
        var state = copyNsAttrObj(node.attributes);

        if(state.type){
            state.isDeep = state.type === 'deep' ? true : false;
        }

        //"state" is the default, so you don't need to explicitly write it
        if(node.local !== 'state' && node.local !== 'schema') state.$type = node.local;

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
            currentJson = currentJson.onEntry = currentJson.onEntry || [];
        },
        "onexit":function(node){
            currentJson = currentJson.onExit = currentJson.onExit || [];
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
            if (expressionAttributeCache.expr) {
                currentJson.contentexpr = merge({}, expressionAttributeCache.expr);
            }
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
        } else {
            createActionJson(node);
            jsonStack.push(currentJson);
            merge(currentJson,expressionAttributeCache);
            expressionAttributeCache = {};
        }

    };

    var EXPRESSION_ATTRS = [ 'cond',
                            'array',
                            'location',
                            'namelist',
                            'idlocation'];

    parser.onclosetag = function(tag){
        //console.log("close tag",tag);
        var localName = tag.split(':').pop();
        // if(tagActions[localName]){
            jsonStack.pop();
            currentJson = jsonStack[jsonStack.length - 1];
            //console.log('current json now',currentJson,jsonStack.length);
        // }
    };

    parser.onattribute = function (attr) {
        //if attribute name ends with 'expr' or is one of the other ones enumerated above
        //then cache him and his position
        if( attr.name.match(/^.*expr$/) ||
            EXPRESSION_ATTRS.indexOf(attr.name) > -1){
            expressionAttributeCache[getNormalizedAttributeName(attr)] = createExpression(attr.value);
        }
    };

    parser.onerror = function (e) {
        // an error happened.
        throw e;
    };

    parser.ontext = function (t) {
        //the only text we care about is that inside of <script> and <content>
        if(currentJson && currentJson.$type){
            if(currentJson.$type === 'script'){
                currentJson.content = t;        //I don't think we need a separate expression for this w/ line/col mapping
            }else if(currentJson.$type === 'send'){
                currentJson.content = t;
            }else if(currentJson.$type === 'data'){
                currentJson.content = {
                  $line : currentJson.$line,
                  $column : currentJson.$column,
                  expr : t
                };
            } else {
                currentJson.content = t;
            }
        }
    };

    parser.oncdata = function (t) {
        currentJson.content = t;
    }

    parser.onend = function () {
        //do some scrubbing of root attributes
        delete rootJson.xmlns;
        //delete rootJson.type;     //it can be useful to leave in 'type' === 'scxml'
        delete rootJson.version;

        if(typeof rootJson.datamodel === 'string') delete rootJson.datamodel;       //this would happen if we have, e.g. state.datamodel === 'ecmascript'

        //change the property name of transition event to something nicer
        allTransitions.forEach(function(transition){
            transition.onTransition = transition.actions;
            delete transition.actions;
        });
    };


    parser.write(xmlString).close();

    return rootJson;

}

module.exports = transform;

//for executing diretly under node.js
if(require.main === module){
    //TODO: allow reading from stdin directly
    //TODO: use saxjs's support for streaming API.
    console.log(JSON.stringify(transform(require('fs').readFileSync(process.argv[2],'utf8')),4,4));
}
