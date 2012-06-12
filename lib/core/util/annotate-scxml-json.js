
/*
     Copyright 2011-2012 Jacob Beard, INFICON, and other SCION contributors

     Licensed under the Apache License, Version 2.0 (the "License");
     you may not use this file except in compliance with the License.
     You may obtain a copy of the License at

             http://www.apache.org/licenses/LICENSE-2.0

     Unless required by applicable law or agreed to in writing, software
     distributed under the License is distributed on an "AS IS" BASIS,
     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     See the License for the specific language governing permissions and
     limitations under the License.
*/

/*
This file transforms an SCXML document converted to JsonML so that it is easier for a JavaScript-based SCXML interpreter to parse and interpret.
*/

/*
Example SCXML document basic1.scxml stripped of whitespace and converted to JsonML.

[
        "scxml", 
        {
                "id": "root", 
                "profile": "ecmascript", 
                "version": "1.0"
        }, 
        [
                "initial", 
                {
                        "id": "intitial1"
                }, 
                [
                        "transition", 
                        {
                                "target": "a"
                        }
                ]
        ], 
        [
                "state", 
                {
                        "id": "a"
                }, 
                [
                        "transition", 
                        {
                                "event": "t", 
                                "target": "b"
                        }
                ]
        ], 
        [
                "state", 
                {
                        "id": "b"
                }
        ]
]
*/

var stateKinds = require("../scxml/state-kinds-enum");

var STATES_THAT_CAN_BE_CHILDREN = ["state", "parallel", "history", "final", "initial"],
    STATE_TAGS = STATES_THAT_CAN_BE_CHILDREN.concat("scxml");

var states, basicStates, uniqueEvents, transitions, idToStateMap, onFoundStateIdCallbacks, datamodel;

var transformAndSerialize = exports.transformAndSerialize = transformAndSerialize = function(root) {
    return JSON.stringify(transform(root));
};

var transform = exports.transform = function(root) {
    states = [];
    basicStates = [];
    uniqueEvents = {};
    transitions = [];
    idToStateMap = {};
    onFoundStateIdCallbacks = [];
    datamodel = {};

    var rootState = transformStateNode(root, []);

    var tuple = deconstructNode(root), 
        tagName = tuple[0], 
        attributes = tuple[1], 
        children = tuple[2];

    states.forEach(function(state){
        state.ancestors.reverse();
    });

    states.forEach(function(state){
        state.descendants.reverse();
    });

    transitions.filter(function(t){return t.targets;}).forEach(function(transition){
        var source = idToStateMap[transition.source];
        var targets = transition.targets.map(function(target){return idToStateMap[target];});

        if (!source) {
            throw new Error("source missing");
        } else if (!targets.length) {
            throw new Error("target missing");
        }

        transition.lca = getLCA(source, targets[0]);
    });

    return {
        states: states,
        transitions: transitions,
        root: rootState.id,
        events: genEventsEnum(uniqueEvents),
        scripts: genRootScripts(children),
        profile: attributes.profile,
        version: attributes.version,
        datamodel: datamodel
    };
};

function genRootScripts(rootChildren) {
    var toReturn = [];
    rootChildren.forEach(function(child){

        var tuple = deconstructNode(child), 
            tagName = tuple[0], 
            attributes = tuple[1], 
            grandChildren = tuple[2];

        if (tagName === "script") {
            toReturn.push.apply(toReturn,
                grandChildren.filter(
                    function(scriptNode){return typeof scriptNode === "string";}));
        }
    });
    return toReturn;
}

function genEventsEnum(uniqueEvents) {
    var event, eventDocumentOrder, toReturn;
    eventDocumentOrder = 0;
    toReturn = {};
    for (event in uniqueEvents) {
        toReturn[event] = {
            name: event,
            documentOrder: eventDocumentOrder++
        };
    }
    return toReturn;
}

function deconstructNode(node, filterText) {
    var attributes, child, children, n1, tagName;
    tagName = node[0];
    n1 = node[1];
    if (n1 && typeof n1 === "object" && !(Array.isArray(n1) || typeof n1 === "string")) {
        attributes = n1;
        children = node.slice(2);
    } else {
        attributes = {};
        children = node.slice(1);
    }
    if (filterText) {
        children = children.filter(function(child){return typeof child !== "string";});
    }
    return [tagName, attributes, children];
}

var stripStarFromEventNameRe = /^((([^.]+)\.)*([^.]+))(\.\*)?$/;

function transformTransitionNode (transitionNode, parentState) {

    var tuple = deconstructNode(transitionNode, true), 
        tagName = tuple[0], 
        attributes = tuple[1], 
        children = tuple[2];

    //wildcard "*" event will show up on transition.events, but will not show up in uniqueEvents
    //default transitions (those without events) will have events set to undefined (rather than empty array)
    if (attributes.event) {
        var events;

        if (attributes.event === "*") {
            events = [attributes.event];
        } else {
            events = attributes.event.trim().split(/\s+/).map(function(event){
                var m = event.match(stripStarFromEventNameRe);
                if (m) {
                    var normalizedEvent = m[1];
                    if (!(m && normalizedEvent)) {
                        throw new Error("Unable to parse event: " + event);
                    }else{
                        return normalizedEvent;
                    } 
                }
            });
        }

        events.
            filter(function(event){return event !== "*";}).
            forEach(function(event){uniqueEvents[event] = true;});

        if(events.indexOf(undefined) > -1){
            throw new Error("Error parsing event attribute attributes.event");
        }
    }

    var transition = {
        documentOrder: transitions.length,
        id: transitions.length,
        source: parentState.id,
        cond: attributes.cond,
        events: events,
        actions: children.map(function(child){return transformActionNode(child);}),
        targets: attributes && attributes.target && attributes.target.trim().split(/\s+/)
    };
    transitions.push(transition);

    //set up LCA later
    
    return transition;
}

function processParam(param) {
    var tuple = deconstructNode(param), 
        tagName = tuple[0], 
        attributes = tuple[1], 
        children = tuple[2];
    return {
        name: attributes.name,
        expr: attributes.expr,
        location: attributes.location
    };
}

function transformActionNode(node) {
    var tuple = deconstructNode(node), tagName = tuple[0], attributes = tuple[1], children = tuple[2];

    switch (tagName) {
        case "if":
            return {
                "type": "if",
                "cond": attributes.cond,
                "actions": children.map(function(child){return transformActionNode(child);})
            };
        case "elseif":
            return {
                "type": "elseif",
                "cond": attributes.cond,
                "actions": children.map(function(child){return transformActionNode(child);})
            };
        case "else":
            return {
                "type": "else",
                "actions": children.map(function(child){return transformActionNode(child);})
            };
        case "log":
            return {
                "type": "log",
                "expr": attributes.expr,
                "label": attributes.label
            };
        case "script":
            return {
                "type": "script",
                "script": children.join("\n")
            };
        case "send":
            return {
                "type": "send",
                "sendType": attributes.type,
                "delay": attributes.delay,
                "id": attributes.id,
                "event": attributes.event,
                "target": attributes.target,
                "idlocation": attributes.idlocation,
                //data
                "namelist": attributes && attributes.namelist && attributes.namelist.trim().split(/ +/),
                "params": children.filter(function(child){return child[0] === 'param';}).map(function(child){return processParam(child);}),
                "content": children.filter(function(child){return child[0] === 'content';}).map(function(child){return deconstructNode(child)[2][0];})[0],
                //exprs
                "contentexpr": attributes.contentexpr, 
                "eventexpr": attributes.eventexpr,
                "targetexpr": attributes.targetexpr,
                "typeexpr": attributes.typeexpr,
                "delayexpr": attributes.delayexpr
            };
        case "cancel":
            return {
                "type": "cancel",
                "sendid": attributes.sendid
            };
        case "assign":
            return {
                "type": "assign",
                "location": attributes.location,
                "expr": attributes.expr
            };
        case "raise":
            return {
                "type": "raise",
                "event": attributes.event
            };
        case "invoke":
            throw new Error("Element " + tagName + " not yet supported");
            return null;
        case "finalize":
            throw new Error("Element " + tagName + " not yet supported");
            return null;
        default : 
            return null;
    }
}

function transformDatamodel(node, ancestors) {
    var tuple = deconstructNode(node, true), tagName = tuple[0], attributes = tuple[1], children = tuple[2];

    children.filter(function(child){return child[0] === 'data';}).forEach(function(child){
        var tuple = deconstructNode(child, true), childTagName = tuple[0], childAttributes = tuple[1], childChildren = tuple[2];
        if (childAttributes.id) {
            datamodel[childAttributes.id] = childAttributes.expr || null;
        }
    });
}

function transformStateNode(node, ancestors) {
    var tuple = deconstructNode(node, true), tagName = tuple[0], attributes = tuple[1], children = tuple[2];
    var id = (attributes && attributes.id) || genId(tagName);
    var kind; 

    switch (tagName) {
        case "state":
            if( children.filter(function(child){return STATE_TAGS.indexOf(child[0]) > -1;}).length){
                kind = stateKinds.COMPOSITE;
            } else {
                kind = stateKinds.BASIC;
            }
            break;
        case "scxml":
            kind = stateKinds.COMPOSITE;
            break;
        case "initial":
            kind = stateKinds.INITIAL;
            break;
        case "parallel":
            kind = stateKinds.PARALLEL;
            break;
        case "final":
            kind = stateKinds.FINAL;
            break;
        case "history":
            kind = stateKinds.HISTORY;
            break;
        default : break;
    }
    var state = {
        id: id,
        kind: kind,
        descendants: []
    };
    idToStateMap[id] = state;
    if (ancestors.length) state.parent = ancestors[ancestors.length - 1];
    if (kind === stateKinds.HISTORY) {
        state.isDeep = attributes.type === "deep" ? true : false;
    }
    state.documentOrder = states.length;
    states.push(state);
    if (kind === stateKinds.BASIC || kind === stateKinds.INITIAL || kind === stateKinds.HISTORY) {
        state.basicDocumentOrder = basicStates.length;
        basicStates.push(state);
    }
    state.depth = ancestors.length;
    state.ancestors = ancestors.slice();

    //walk back up ancestors and add this state to lists of descendants
    ancestors.forEach(function(anc){
        idToStateMap[anc].descendants.push(state.id);
    });

    //need to do some work on his children
    var onExitChildren = [];
    var onEntryChildren = [];
    var transitionChildren = [];
    var stateChildren = [];

    var nextAncestors = ancestors.concat(state.id);

    var processedInitial = false;
    var firstStateChild = null;

    var processInitialState = function(initialState) {
        var child = transformStateNode(initialState, nextAncestors);
        state.initial = child.id;
        stateChildren.push(child);
        return processedInitial = true;
    };

    children.filter(function(child){return Array.isArray(child);}).forEach(function(child){

        var tuple = deconstructNode(child, true), childTagName = tuple[0], childAttributes = tuple[1], childChildren = tuple[2];
        switch (childTagName) {
            case "transition":
                transitionChildren.push(transformTransitionNode(child, state));
                break;
            case "onentry":
                childChildren.forEach(function(actionNode){
                    onEntryChildren.push(transformActionNode(actionNode));
                });
                break;
            case "onexit":
                childChildren.forEach(function(actionNode){
                    onExitChildren.push(transformActionNode(actionNode));
                });
                break;
            case "initial":
                if (!processedInitial) {
                    processInitialState(child);
                } else {
                    throw new Error("Encountered duplicate initial states in state " + state.id);
                }
                break;
            case "history":
                var c = transformStateNode(child, nextAncestors);
                state.history = c.id;
                stateChildren.push(c);
                break;
            case "datamodel":
                transformDatamodel(child, nextAncestors);
                break;
            default:
                if(STATES_THAT_CAN_BE_CHILDREN.indexOf(childTagName) > -1){
                    var transformedStateNode = transformStateNode(child, nextAncestors);
                    //this is used to set default initial state, if initial state is not specified
                    if (firstStateChild === null) firstStateChild = transformedStateNode;
                    stateChildren.push(transformedStateNode);
                }
                break;
        }

    });

    if (!processedInitial && tagName !== "parallel") {
        var hasInitialAttribute = attributes && attributes.initial; 

        //create a fake initial state and process him
        function generateFakeInitialState(targetId) {
            var fakeInitialState;
            fakeInitialState = [
                "initial", [
                    "transition", {
                        target: targetId
                    }
                ]
            ];
            return processInitialState(fakeInitialState);
        }

        if (hasInitialAttribute) {
            generateFakeInitialState(attributes.initial);
        } else {
            if (firstStateChild) generateFakeInitialState(firstStateChild.id);
        }
    }

    state.onexit = onExitChildren;
    state.onentry = onEntryChildren;
    state.transitions = transitionChildren.map(function(transition){return transition.documentOrder;});
    state.children = stateChildren.map(function(child){return child.id;});

    return state;
}

var idRoot = "$generated";

var idCounter = {};

function genId(tagName) {
    idCounter[tagName] = idCounter[tagName] || 0;
    return "" + idRoot + "-" + tagName + "-" + (idCounter[tagName]++);
}

function getLCA(s1, s2) {
    var a, anc, commonAncestors, _i, _len, _ref, _ref2;
    commonAncestors = [];
    s1.ancestors.forEach(function(a){
        anc = idToStateMap[a];
        if(anc.descendants.indexOf(s2.id) > -1){
            commonAncestors.push(a);
        }
    });
    if(!commonAncestors.length) throw new Error("Could not find LCA for states.");
    return commonAncestors[0];
}

if (require.main === module) {
    var inFile = process.argv[2];
    var outFile = process.argv[3];
    function go(jsonStr) {
        var fs, s, scxmlJson;
        scxmlJson = JSON.parse(jsonStr);
        s = transformAndSerialize(scxmlJson, true, true, true, true);
        if (outFile === "-") {
            return process.stdout.write(s);
        } else {
            fs = require('fs');
            return fs.writeFileSync(outFile, s, 'utf-8');
        }
    }
    if (!inFile || inFile === "-") {
        process.stdin.resume();
        process.stdin.setEncoding("utf-8");
        var json = "";
        process.stdin.on("data", function(data) {
            return json += data;
        });
        process.stdin.on("end", function() {
            return go(json);
        });
    } else {
        var fs = require('fs');
        var str = fs.readFileSync(inFile, 'utf-8');
        go(str);
    }
}
