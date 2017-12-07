//TODO: resolve data/@src and script/@src. either here, or in a separate module.
//TODO: remove nodejs dependencies
//TODO: decide on a friendly, portable interface to this module. streaming is possible, but maybe not very portable.

var sax = require("@jbeard/sax"),
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
    parser = sax.parser(strict,{trim : false, xmlns : true});

    var rootJson,
        currentJson,
        expressionAttributeCache,      //we cache them because in sax-js attributes get processed before the nodes they're attached to,
                                            //and this is the only way we can capture their row/col numbers.
                                            //so when we finally find one, it gets popped off the stack.
        jsonStack = [],
        allTransitions = [],                 //we keep a reference to these so we can clean up the onTransition property later
        traversingInContentTagStack = [],
        cachedContentTagStartPosition,
        attributeValueLineColumnCache = {},
        attributeValueEndLineColumnCache = {},
        idCount = {},
        cachedBeginCloseTagPosition,
        cachedOpenWakaPosition;

    function createInvokeJson(node){
        var invoke = merge(
                    {
                        $line : cachedOpenWakaPosition.line,
                        $column : cachedOpenWakaPosition.column,
                        $type: node.local
                    },
                    copyNsAttrObj(node.attributes));

        //FIXME: for now, assume that document is valid, and currentJson is a state.
        //TODO: maybe verify that we are in a state
        currentJson.invokes = currentJson.invokes || [];
        currentJson.invokes.push(invoke);

        return currentJson = invoke;
    }

    function createActionJson(node){
        var action = merge(
                    {
                        $line : cachedOpenWakaPosition.line,
                        $column : cachedOpenWakaPosition.column,
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
                $line : cachedOpenWakaPosition.line,
                $column : cachedOpenWakaPosition.column,
                $type : 'data'
            },
            copyNsAttrObj(node.attributes));
        return currentJson;
    }

    //TODO: avoid duplicate code
    function generateId(type){
        if(idCount[type] === undefined) idCount[type] = 0;

        var count = idCount[type]++;
        return '$generated-' + type + '-' + count; 
    }


    function createStateJson(node, isRoot){
        var state = copyNsAttrObj(node.attributes);

        if(state.initial){ 
          state.initial = state.initial.trim().split(/\s+/);
          if(state.initial.length === 1) state.initial = state.initial[0];
        }

        if(state.type){
            state.isDeep = state.type === 'deep' ? true : false;
        }

        //"state" is the default, so you don't need to explicitly write it
        if(node.local !== 'schema') state.$type = node.local;

        if(!state.id){
          state.id = generateId(state.$type);
        }

        if(currentJson){
            if(isRoot){
              currentJson.rootState = state;
              delete currentJson.rootState.datamodel;   //delete "datamodel" attribute on scxml root element
            }else {
              if(!currentJson.states){
                  currentJson.states = [];
              }
              currentJson.states.push(state);
            }
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

    function createExpression(attrName, attrValue){
        var posStart = attributeValueLineColumnCache[attrName],
            posEnd = attributeValueEndLineColumnCache[attrName];
        return {
            $line : posStart.line,
            $column : posStart.column,
            expr : attrValue,
            $closeLine : posEnd.line,
            $closeColumn : posEnd.column
        };
    }

    var tagActions = {
        "scxml": function(node){
            if(!rootJson){
              return rootJson = createStateJson(node, true);
            } else if(currentJson.$type === 'content'){
              return createStateJson(node, true);
            } else {
              throw new Error('Unexpected scxml open tag');
            }
        },
        "initial": createStateJson,
        "history":createStateJson,
        "state":createStateJson,
        "parallel":createStateJson,
        "final":createStateJson,

        //transitions/action containers
        "transition" : createTransitionJson,

        "onentry":function(node){
            currentJson.onEntry = currentJson.onEntry || [];
            let block = [];
            currentJson.onEntry.push(block);
            currentJson = block;
        },
        "onexit":function(node){
            currentJson.onExit = currentJson.onExit || [];
            let block = [];
            currentJson.onExit.push(block);
            currentJson = block;
        },

        //actions
        "foreach" : createActionJson,
        "raise" : createActionJson,
        "log": createActionJson,
        "assign": function(node){
          traversingInContentTagStack.push(node);
          cachedContentTagStartPosition = {
            line : parser.line,
            column : parser.column,
            position : parser.position
          };
          createActionJson.apply(this, arguments);
        },
        "script":createActionJson,
        "cancel":createActionJson,
        "send":createActionJson,

        //children of send/invoke
        "param": function(node){
          currentJson.params = currentJson.params || [];
          var attr = copyNsAttrObj(node.attributes);
          currentJson.params.push(attr);
          currentJson = attr;
        },
        "content":function(node){
          //on invoke
          if(currentJson.$type === 'invoke'){
            currentJson.content = {
              $line : parser.line,
              $column : parser.column,
              $type : 'content'
            };
            currentJson = currentJson.content;
          }else{
            traversingInContentTagStack.push(node);
            cachedContentTagStartPosition = {
              line : parser.line,
              column : parser.column,
              position : parser.position
            }
          };
        },

        //these are treated a bit special - TODO: normalize/decide on a representation
        "if" : createActionJson,
        "elseif" : createActionJson,
        "else" : createActionJson,

        //data
        "datamodel":function(node){
          //console.log('datamodel currentJson',currentJson);
          var datamodel = merge(
            {
                $line : cachedOpenWakaPosition.line,
                $column : cachedOpenWakaPosition.column,
                $type: node.local,
                declarations : []
            },
            copyNsAttrObj(node.attributes));

          currentJson.datamodel = datamodel;
          currentJson = datamodel; 
        },
        "data":function(node){
          //console.log('data currentJson',currentJson);
          traversingInContentTagStack.push(node);
          cachedContentTagStartPosition = {
            line : parser.line,
            column : parser.column,
            position : parser.position
          };
          currentJson.declarations.push(createDataJson(node));
        },

        "invoke": createInvokeJson,
        "finalize": function(node){
          return currentJson = currentJson.finalize = node;
        },
        "donedata" : function(node){
          return currentJson = currentJson.donedata = {};
        }
    };

    expressionAttributeCache = {};  //TODO: put in onstart or something like that

    parser.onopentag = function (node) {
        //console.log("open tag",node.local, parser.line, parser.column, parser.position);

        if(traversingInContentTagStack.length){ 
          traversingInContentTagStack.push(node);
          return;
        }

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
        //console.log('currentJson',currentJson,'jsonStack',jsonStack);
    };

    var EXPRESSION_ATTRS = [ 'cond',
                            'array',
                            'location',
                            'namelist',
                            'idlocation'];


    parser.onopentagstart = function(tagName){
      //console.log('onopentagstart',tagName,parser.line,parser.column);
    };

    parser.onopenwaka = function(){
      //console.log('onopenwaka',parser.line,parser.column);
      cachedOpenWakaPosition = { line :  parser.line, column : parser.column };
    };

    parser.onbeginclosetag = parser.onopentagslash = function(){
     cachedBeginCloseTagPosition = { line :  parser.line, column : parser.column };
    };

    parser.onclosetag = function(tag){
        //console.log("close tag",tag);
        var localName = tag.split(':').pop();

        //console.log('currentJson', currentJson);
        currentJson.$closeLine = cachedBeginCloseTagPosition.line;
        currentJson.$closeColumn = cachedBeginCloseTagPosition.column;

        if(traversingInContentTagStack.length){
          var lastTag = traversingInContentTagStack.pop();
          if(lastTag.local !== tag){
            throw new Error(`Mismatched start and end tags: start ${lastTag.local}, end ${tag}`);
          }
          if(!traversingInContentTagStack.length){    //we reached the bottom. capture the content string based on parser position
            let re = new RegExp(`</${tag}\\s*>`, 'g')
            let content = xmlString.substring(cachedContentTagStartPosition.position, parser.position);
            let match, lastMatch;
            while (match = re.exec(content)) {
              lastMatch = match;
            }
            if(lastMatch){
              content = content.slice(0, lastMatch.index); 
              if(!currentJson) throw new Error('No currentJson for tag ${tag}');
              else
              currentJson.content = {
                $line : cachedContentTagStartPosition.line,
                $column : cachedContentTagStartPosition.column,
                content : content
              }
              //FIXME: make sure that we have an accurate start position.
              cachedContentTagStartPosition = null;
            }
          }
        } 

        if(!traversingInContentTagStack.length){    
          jsonStack.pop();
          currentJson = jsonStack[jsonStack.length - 1];
          attributeValueLineColumnCache = {};
          //console.log('currentJson',currentJson,'jsonStack',jsonStack);
        }
    };

    //parser.onattributenameend = function(attrName){
    //  console.log('onattributenameend', attrName, parser.line, parser.column);
    //}

    parser.onattributevaluestart = function () {
      if(traversingInContentTagStack.length) return;
      //console.log('onattributevaluestart', parser.attribName, parser.line, parser.column);
      attributeValueLineColumnCache[parser.attribName] = { line :  parser.line, column : parser.column };
    }

    parser.onattributevalueend = function(){
      //console.log('onattributevalueend', parser.attribName, parser.attribValue, parser.line, parser.column);
      attributeValueEndLineColumnCache[parser.attribName] = { line :  parser.line, column : parser.column };
    }

    parser.onattribute = function (attr) {
        if(traversingInContentTagStack.length) return;

        //console.log('onattribute ',attr, parser.line, parser.column, parser.position);
        //if attribute name ends with 'expr' or is one of the other ones enumerated above
        //then cache him and his position
        if( attr.name.match(/^.*expr$/) ||
            EXPRESSION_ATTRS.indexOf(attr.name) > -1){
            expressionAttributeCache[getNormalizedAttributeName(attr)] = createExpression(attr.name, attr.value);
        }
    };

    parser.onerror = function (e) {
        // an error happened.
        throw e;
    };

    parser.ontext = function (t) {
        if(traversingInContentTagStack.length) return;
        //console.log(t, traversingInContentTag, currentJson);
        //the only text we care about is that inside of <script> and <content>
        if(currentJson && currentJson.$type){
            if(currentJson.$type === 'script'){
                currentJson.content = t;        //I don't think we need a separate expression for this w/ line/col mapping
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
