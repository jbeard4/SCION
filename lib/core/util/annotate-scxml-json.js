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


"use strict";

var codeGen = require('./code-gen'),
    constants = require('../constants'),
    pm = require('../../platform');

var stateKinds = require("../scxml/state-kinds-enum");

var STATES_THAT_CAN_BE_CHILDREN = ["state", "parallel", "history", "final", "initial"],
    STATE_TAGS = STATES_THAT_CAN_BE_CHILDREN.concat("scxml");


var states, basicStates, uniqueEvents, transitions, idToStateMap, onFoundStateIdCallbacks, datamodel, doc;

var transformAndSerialize = exports.transformAndSerialize = transformAndSerialize = function(root) {
    return JSON.stringify(transform(root));
};

var transform = exports.transform = function(scxmlDoc) {

    doc = scxmlDoc;

    var root = doc.documentElement;

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
        var targets = transition.targets.map(function(target){
            var state = idToStateMap[target];
            if(!state) throw new Error("Transition targets state id '" + target + "' but state does not exist.");
            return state;
        });

        transition.lcca = getLCCA(source, targets[0]);
    });
    
    transitions.forEach(function(transition){
        transition.scope = getScope(transition);
    });

    return {
        states: states,
        transitions: transitions,
        root: rootState.id,
        events: genEventsEnum(uniqueEvents),
        scripts: genRootScripts(root),
        profile: pm.platform.dom.getAttribute(root,"profile"),
        version: pm.platform.dom.getAttribute(root,"version"),
        datamodel: datamodel
    };
};

function genRootScripts(root) {
    return pm.platform.dom.getChildren(root).filter(function(c){return pm.platform.dom.localName(c) === "script";}).map(function(c){return pm.platform.dom.textContent(c);});
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
    if (pm.platform.dom.hasAttribute(transitionNode,'event')) {
        var events;

        var event = pm.platform.dom.getAttribute(transitionNode,'event');
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
        internal : pm.platform.dom.getAttribute(transitionNode,"type") === 'internal',
        documentOrder: transitions.length,
        id: transitions.length,
        source: parentState.id,
        cond: pm.platform.dom.getAttribute(transitionNode,"cond"),
        events: events,
        targets: pm.platform.dom.hasAttribute(transitionNode,"target") ? pm.platform.dom.getAttribute(transitionNode,"target").trim().split(/\s+/) : null
    };

    if(pm.platform.dom.getElementChildren(transitionNode).length) transition.actions = codeGen.gen.parentToFnBody(transitionNode);

    transitions.push(transition);

    //set up LCCA later
    
    return transition;
}

function transformDatamodel(node, ancestors) {
    pm.platform.dom.getChildren(node).filter(function(child){return pm.platform.dom.localName(child) === 'data';}).forEach(function(child){
        if (pm.platform.dom.hasAttribute(child,"id")) {

            var datamodelObject;

            var id = pm.platform.dom.getAttribute(child,"id");

            if(pm.platform.dom.hasAttribute(child,"expr")){ 
                datamodelObject = {
                    content : pm.platform.dom.getAttribute(child,"expr"),
                    type : 'expr'
                };
            }else{
                var hasType = pm.platform.dom.hasAttribute(child,'type');


                //fetch the first text node to get the text content
                if(hasType){
                    var type = pm.platform.dom.getAttribute(child,'type');

                    var textContent = type === 'xml' ? 
                                        pm.platform.dom.serializeToString(child) : 
                                        pm.platform.dom.textContent(child);

                    datamodelObject = {
                        content : textContent,
                        type : type 
                    };
                }else{
                    textContent = pm.platform.dom.textContent(child);
                    datamodelObject = textContent.length ? 
                                        {
                                            content : textContent,
                                            type : 'text' 
                                        } : null;
                }
            }

            datamodel[id] = datamodelObject;
        }
    });
}

function transformStateNode(node, ancestors) {
    var id = pm.platform.dom.hasAttribute(node,"id") ? pm.platform.dom.getAttribute(node,"id") :  genId(pm.platform.dom.localName(node));
    var kind; 

    switch (pm.platform.dom.localName(node)) {
        case "state":
            if( pm.platform.dom.getChildren(node).filter(function(child){return STATE_TAGS.indexOf(pm.platform.dom.localName(child)) > -1;}).length){
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
        state.isDeep = pm.platform.dom.getAttribute(node,"type") === "deep" ? true : false;
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
    pm.platform.dom.getElementChildren(node).forEach(function(child){

        //var tuple = util.deconstructNode(child, true), childTagName = tuple[0], childAttributes = tuple[1], childChildren = tuple[2];
        switch (pm.platform.dom.localName(child)) {
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
                if(STATES_THAT_CAN_BE_CHILDREN.indexOf(pm.platform.dom.localName(child)) > -1){
                    var transformedStateNode = transformStateNode(child, nextAncestors);
                    //this is used to set default initial state, if initial state is not specified
                    if (firstStateChild === null) firstStateChild = transformedStateNode;
                    stateChildren.push(transformedStateNode);
                }
                break;
        }

    });

    if (!processedInitial && pm.platform.dom.localName(node) !== "parallel") {
        var hasInitialAttribute = pm.platform.dom.hasAttribute(node,"initial");

        //create a fake initial state and process him
        var generateFakeInitialState = function(targetId) {
            var initial = pm.platform.dom.createElementNS(doc,constants.SCXML_NS,"initial");
            var transition = pm.platform.dom.createElementNS(doc,constants.SCXML_NS,"transition");
            pm.platform.dom.setAttribute(transition,"target",targetId); 
            pm.platform.dom.appendChild(initial,transition);

            return processInitialState(initial);
        };

        if (hasInitialAttribute) {
            generateFakeInitialState(pm.platform.dom.getAttribute(node,"initial"));
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

function getLCCA(s1, s2) {
    var a, anc, commonCompoundAncestors;
    commonCompoundAncestors = [];
    s1.ancestors.forEach(function(a){
        anc = idToStateMap[a];
        if(anc.kind === stateKinds.COMPOSITE && 
            anc.descendants.indexOf(s2.id) > -1){
            commonCompoundAncestors.push(a);
        }
    });
    if(!commonCompoundAncestors.length) throw new Error("Could not find LCCA for states.");
    return commonCompoundAncestors[0];
}

function getScope(transition){
    //Transition scope is normally the least common compound ancestor (lcca).
    //Internal transitions have a scope equal to the source state.

    var source = idToStateMap[transition.source];

    var transitionIsReallyInternal = 
            transition.internal &&
                source.parent &&    //root state won't have parent
                    transition.targets && //does it target its descendants
                        transition.targets.map(function(targetId){return idToStateMap[targetId];}).every(
                        function(target){ return source.descendants.map(function(id){return idToStateMap[id];}).indexOf(target) > -1;});

    if(!transition.targets){
        return transition.source; 
    }else if(transitionIsReallyInternal){
        return transition.source; 
    }else{
        return transition.lcca;
    }
}

//epic one-liner
//this script can be called as a main script to convert an xml file to annotated scxml.
//TODO: get google closure to compile this out as dead code in the browser build
if(require.main === module) console.log(JSON.stringify(transform((new (require('xmldom').DOMParser)).parseFromString(require('fs').readFileSync(process.argv[2],'utf8'))),4,4));
