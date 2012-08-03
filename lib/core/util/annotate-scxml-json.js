
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
This module transforms an SCXML document to a proprietary JSON-based intermediate representation.
*/


var codeGen = require('./code-gen'),
    dom = require('../util/dom'),
    constants = require('../constants');

var stateKinds = require("../scxml/state-kinds-enum");

var STATES_THAT_CAN_BE_CHILDREN = ["state", "parallel", "history", "final", "initial"],
    STATE_TAGS = STATES_THAT_CAN_BE_CHILDREN.concat("scxml");


var states, basicStates, uniqueEvents, transitions, idToStateMap, onFoundStateIdCallbacks, datamodel, document;

var transformAndSerialize = exports.transformAndSerialize = transformAndSerialize = function(root) {
    return JSON.stringify(transform(root));
};

var transform = exports.transform = function(doc) {

    document = doc;

    var root = document.documentElement;

    states = [];
    basicStates = [];
    uniqueEvents = {};
    transitions = [];
    idToStateMap = {};
    onFoundStateIdCallbacks = [];
    datamodel = {};

    var rootState = transformStateNode(root, []);

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
        scripts: genRootScripts(root),
        profile: dom.getAttribute(root,"profile"),
        version: dom.getAttribute(root,"version"),
        datamodel: datamodel
    };
};

function genRootScripts(root) {
    return dom.filter(root,function(c){return dom.localName(c) === "script";}).map(function(c){return c.textContent;});
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


var stripStarFromEventNameRe = /^((([^.]+)\.)*([^.]+))(\.\*)?$/;

function transformTransitionNode (transitionNode, parentState) {

    //wildcard "*" event will show up on transition.events, but will not show up in uniqueEvents
    //default transitions (those without events) will have events set to undefined (rather than empty array)
    if (transitionNode.hasAttribute('event')) {
        var events;

        var event = dom.getAttribute(transitionNode,'event');
        if (event === "*") {
            events = [event];
        } else {
            events = event.trim().split(/\s+/).map(function(event){
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
        cond: dom.getAttribute(transitionNode,"cond"),
        events: events,
        targets: transitionNode.hasAttribute("target") ? dom.getAttribute(transitionNode,"target").trim().split(/\s+/) : null
    };

    if(dom.getElementChildren(transitionNode).length) transition.actions = codeGen.gen.parentToFnBody(transitionNode);

    transitions.push(transition);

    //set up LCA later
    
    return transition;
}

function transformDatamodel(node, ancestors) {
    dom.filter(node,function(child){return dom.localName(child) === 'data';}).forEach(function(child){
        if (child.hasAttribute("id")) {
            datamodel[dom.getAttribute(child,"id")] = child.hasAttribute("expr") ? dom.getAttribute(child,"expr") : null;
        }
    });
}

function transformStateNode(node, ancestors) {
    var id = node.hasAttribute("id") ? dom.getAttribute(node,"id") :  genId(dom.localName(node));
    var kind; 

    switch (dom.localName(node)) {
        case "state":
            if( dom.filter(node,function(child){return STATE_TAGS.indexOf(dom.localName(child)) > -1;}).length){
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
        state.isDeep = dom.getAttribute(node,"type") === "deep" ? true : false;
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
    var onExitChildren,
        onEntryChildren;
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

    //process all sub-elements
    dom.getElementChildren(node).forEach(function(child){

        //var tuple = util.deconstructNode(child, true), childTagName = tuple[0], childAttributes = tuple[1], childChildren = tuple[2];
        switch (dom.localName(child)) {
            case "transition":
                transitionChildren.push(transformTransitionNode(child, state));
                break;
            case "onentry":
                onEntryChildren = codeGen.gen.parentToFnBody(child);
                break;
            case "onexit":
                onExitChildren = codeGen.gen.parentToFnBody(child);
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
                if(STATES_THAT_CAN_BE_CHILDREN.indexOf(dom.localName(child)) > -1){
                    var transformedStateNode = transformStateNode(child, nextAncestors);
                    //this is used to set default initial state, if initial state is not specified
                    if (firstStateChild === null) firstStateChild = transformedStateNode;
                    stateChildren.push(transformedStateNode);
                }
                break;
        }

    });

    if (!processedInitial && dom.localName(node) !== "parallel") {
        var hasInitialAttribute = node.hasAttribute("initial");

        //create a fake initial state and process him
        function generateFakeInitialState(targetId) {
            var initial = document.createElementNS(constants.SCXML_NS,"initial");
            var transition = document.createElementNS(constants.SCXML_NS,"transition");
            transition.setAttribute("target",targetId); 
            initial.appendChild(transition);

            return processInitialState(initial);
        }

        if (hasInitialAttribute) {
            generateFakeInitialState(dom.getAttribute(node,"initial"));
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

//epic one-liner
//this script can be called as a main script to convert an xml file to annotated scxml.
//TODO: get google closure to compile this out as dead code in the browser build
if(require.main === module) console.log(JSON.stringify(transform((new (require('xmldom').DOMParser)).parseFromString(require('fs').readFileSync(process.argv[2],'utf8'))),4,4));
