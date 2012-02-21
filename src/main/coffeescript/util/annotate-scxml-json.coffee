###
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
###

###
This file transforms an SCXML document converted to JsonML so that it is easier for a JavaScript-based SCXML interpreter to parse and interpret.
###

###
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
###


#constants

define ["scxml/state-kinds-enum"],(stateKinds) ->

	STATES_THAT_CAN_BE_CHILDREN = ["state", "parallel", "history", "final", "initial"]
	STATE_TAGS = STATES_THAT_CAN_BE_CHILDREN.concat "scxml"

	#TODO: read from stdin, file, or allow transorm via API

	#variable declarations outside of scope of transform
	states = basicStates = uniqueEvents = transitions = idToStateMap = onFoundStateIdCallbacks = datamodel = undefined

	transformAndSerialize = (root,genDepth,genAncestors,genDescendants,genLCA) ->
		JSON.stringify transform(root,genDepth,genAncestors,genDescendants,genLCA)

	#we expect depth to actually only be at most 100, so we can use regular recursion
	transform = (root,genDepth,genAncestors,genDescendants,genLCA) ->
		#initialize variables we want to track
		states = []
		basicStates = []
		uniqueEvents = {}
		transitions = []
		idToStateMap = {}
		onFoundStateIdCallbacks = []
		datamodel = {}

		rootState = transformStateNode root,[],genDepth,genAncestors,genDescendants,genLCA

		[tagName,attributes,children] = deconstructNode root

		#reverse ancestors (needs to be in reverse document order)
		if genAncestors or genLCA then state.ancestors.reverse() for state in states

		#reverse descendants (needs to be in reverse document order)
		if genDescendants or genLCA then state.descendants.reverse() for state in states

		#generate LCAs on transitions
		if genLCA
			for transition in transitions when transition.targets
				source = idToStateMap[transition.source]
				targets = (idToStateMap[target] for target in transition.targets)
				if not source
					#console.debug transition
					new Error "source missing"
				else if not targets.length
					#console.debug transition
					new Error "target missing"
				
				transition.lca = getLCA(source,targets[0])

		states : states
		transitions : transitions
		root : rootState.id
		events : genEventsEnum uniqueEvents
		scripts : genRootScripts children
		profile : attributes.profile
		version : attributes.version
		datamodel : datamodel

	genRootScripts = (rootChildren) ->
		toReturn = []
		for child in rootChildren
			[tagName,attributes,grandChildren] = deconstructNode child
			if tagName is "script"
				for scriptNode in grandChildren when typeof scriptNode is "string"
					toReturn.push scriptNode

		return toReturn
			

	genEventsEnum = (uniqueEvents) ->
		eventDocumentOrder = 0
		toReturn = {}

		for event of uniqueEvents
			toReturn[event] =
				name : event
				documentOrder : eventDocumentOrder++

		return toReturn

	deconstructNode = (node,filterText) ->
		tagName = node[0]

		n1 = node[1]
		if n1 and typeof n1 is "object" and not (isArray n1 or typeof n1 is "string")
			#process his attributes? do we care?
			attributes = n1
			children = node[2..]
		else
			attributes = {}
			children = node[1..]

		if filterText
			children = (child for child in children when typeof child isnt "string")

		return [tagName,attributes,children]

	stripStarFromEventNameRe = /^([a-zA-Z0-9.]+)(\.\*)?$/

	transformTransitionNode = (transitionNode,parentState,genDepth,genAncestors,genDescendants,genLCA) ->
		[tagName,attributes,children] = deconstructNode transitionNode,true
		
		#transform event attribute
		#TODO: split up space-delimited events
		#if attributes.event [all,attributes.event] = attributes.event.match stripStar
			
		if attributes.event and attributes.event isnt "*" then uniqueEvents[attributes.event] = true	#track unique events

		transition =
			documentOrder : transitions.length
			id : transitions.length
			source : parentState.id
			cond : attributes.cond
			event : attributes.event
			actions : (transformActionNode child for child in children)
			targets : attributes?.target?.trim().split(/\s+/)	#this will either be a list, or undefined

		transitions.push transition

		#set up LCA later
		
		return transition

	processParam = (param) ->
		[tagName,attributes,children] = deconstructNode param
		{ name : attributes.name, expr : attributes.expr, location: attributes.location }
		

	transformActionNode  = (node) ->
		[tagName,attributes,children] = deconstructNode node

		switch tagName
			when "if"
				"type" : "if"
				"cond" : attributes.cond
				"actions" : (transformActionNode child for child in children)

			when "elseif"
				"type" : "elseif"
				"cond" : attributes.cond
				"actions" : (transformActionNode child for child in children)

			when "else"
				"type" : "else"
				"actions" : (transformActionNode child for child in children)

			when "log"
				"type" : "log"
				"expr" : attributes.expr
				"label" : attributes.label

			when "script"
				"type" : "script",
				"script" : children.join "\n"

			when "send"
				"type" : "send",
				"sendType" : attributes.type
				"delay" : attributes.delay
				"id" : attributes.id
				"event" : attributes.event
				"target" : attributes.target
				"idlocation" : attributes.idlocation
				#data
				"namelist" : attributes?.namelist?.trim().split(new RegExp " +")
				"params" : (processParam child for child in children when child[0] is "param")
				"content" : (deconstructNode(child)[2][0] for child in children when child[0] is "content")[0]
				#exprs
				"eventexpr" : attributes.eventexpr
				"targetexpr" : attributes.targetexpr
				"typeexpr" : attributes.typeexpr
				"delayexpr" : attributes.delayexpr

			when "cancel"
				"type" : "cancel",
				"sendid" : attributes.sendid

			when "assign"
				"type" : "assign",
				"location" : attributes.location
				"expr" : attributes.expr

			when "raise"
				"type" : "raise"
				"event" : attributes.event

			when "invoke"
				#TODO
				throw new Error("Element #{tagName} not yet supported")
			when "finalize"
				#TODO
				throw new Error("Element #{tagName} not yet supported")

	transformDatamodel = (node,ancestors,genDepth,genAncestors,genDescendants,genLCA) ->
		[tagName,attributes,children] = deconstructNode node,true
		
		for child in children when child[0] is "data"
			[childTagName,childAttributes,childChildren] = deconstructNode child,true
			if childAttributes.id
				datamodel[childAttributes.id] = childAttributes.expr or null
		
	transformStateNode = (node,ancestors,genDepth,genAncestors,genDescendants,genLCA) ->
		[tagName,attributes,children] = deconstructNode node,true

		#generate id if necessary
		id = attributes?.id or genId tagName

		#console.warn "Processing #{tagName} node with id '#{id}'"
		#console.warn "ancestors",ancestors

		kind = switch tagName
			when "state"
				if (child for child in children when child[0] in STATE_TAGS).length then stateKinds.COMPOSITE
				else stateKinds.BASIC
			when "scxml" then stateKinds.COMPOSITE
			when "initial" then stateKinds.INITIAL
			when "parallel" then stateKinds.PARALLEL
			when "final" then stateKinds.FINAL
			when "history" then stateKinds.HISTORY

		#stub out the state
		state =
			id : id
			kind : kind
			descendants : []	#descendants gets populated later

		idToStateMap[id] = state

		if ancestors.length
			state.parent = ancestors[ancestors.length - 1]

		if kind is stateKinds.HISTORY
			state.isDeep = if attributes.type is "deep" then true else false

		state.documentOrder = states.length
		states.push state

		if kind is stateKinds.BASIC or kind is stateKinds.INITIAL or kind is stateKinds.HISTORY
			state.basicDocumentOrder = basicStates.length
			basicStates.push state

		#special stuff
		if genDepth
			state.depth = ancestors.length

		if genAncestors or genLCA
			state.ancestors = ancestors.slice()

		if genDescendants or genLCA
			#walk back up ancestors and add this state to lists of descendants
			(idToStateMap[anc].descendants.push state.id for anc in ancestors)

		#need to do some work on his children
		onExitChildren = []
		onEntryChildren = []
		transitionChildren = []
		stateChildren = []

		nextAncestors = ancestors.concat state.id	#we are copying ancestors twice. may be more efficient way?

		processedInitial = false
		firstStateChild = null

		processInitialState = (initialState) ->
			child = transformStateNode initialState,nextAncestors,genDepth,genAncestors,genDescendants,genLCA
			state.initial =  child.id
			stateChildren.push child
			processedInitial = true


		for child in children when isArray child	#they should all be tuples. too bad this is expensive.
			[childTagName,childAttributes,childChildren] = deconstructNode child,true
			switch childTagName
				#apply recursively
				when "transition"
					transitionChildren.push transformTransitionNode child,state
				when "onentry"
					(onEntryChildren.push transformActionNode actionNode for actionNode in childChildren)
				when "onexit"
					(onExitChildren.push transformActionNode actionNode for actionNode in childChildren)
				when "initial"
					if not processedInitial
						processInitialState child
					else
						throw new Error("Encountered duplicate initial states in state #{state.id}")
				when "history"
					child = transformStateNode child,nextAncestors,genDepth,genAncestors,genDescendants,genLCA
					state.history = child.id
					stateChildren.push child
				when "datamodel"
					transformDatamodel child,nextAncestors,genDepth,genAncestors,genDescendants,genLCA
				else
					if childTagName in STATES_THAT_CAN_BE_CHILDREN	#another filter
						transformedStateNode = transformStateNode child,nextAncestors,genDepth,genAncestors,genDescendants,genLCA
						if firstStateChild is null
							#this is used to set default initial state, if initial state is not specified
							firstStateChild = transformedStateNode

						stateChildren.push transformedStateNode

		#console.error state.id,firstStateChild,processedInitial

		#handle initial
		#FIXME: handle initial state for parallel states
		if not processedInitial and tagName isnt "parallel"
			hasInitialAttribute = attributes?.initial

			generateFakeInitialState = (targetId) ->
				#console.log "generating fake initial node"
				#create a fake initial state and process him
				fakeInitialState = [
					"initial",
					[
						"transition",
						{
							target : targetId
						}
					]
				]

				processInitialState fakeInitialState

			if hasInitialAttribute
				generateFakeInitialState attributes.initial
			else
				if firstStateChild	#if this exists, he is composite
					generateFakeInitialState firstStateChild.id


		#set up these properties
		state.onexit = onExitChildren
		state.onentry = onEntryChildren
		state.transitions = (transition.documentOrder for transition in transitionChildren)
		state.children = (child.id for child in stateChildren)

		#lazy-initialize transitions that need it
		#if onFoundStateIdCallbacks[id] then (cb() for cb in onFoundStateIdCallbacks[id])

		#return the state object. depending on specified optinos, some of these properties may be undefined, which is fine
		return state
			
		
	#http://stackoverflow.com/questions/4775722/javascript-check-if-object-is-array
	isArray = (o) -> Object.prototype.toString.call(o) is '[object Array]'

	#TODO: make this safer
	idRoot = "$generated"
	idCounter = {}
	genId = (tagName) ->
		idCounter[tagName] ?= 0
		"#{idRoot}-#{tagName}-#{idCounter[tagName]++}"

	#inspect = require('util').inspect

	getLCA = (s1,s2) ->
		#FIXME: ancestors will be complete at this point, but will descendants?
		#yah, i think descandants may not be complete, but it will be complete enough
		#lots of string comparison... expensive
		#console.debug "getLCA"
		#console.debug "s1",s1
		#console.debug "s2",s2
		###
		process.stdout.setEncoding 'utf-8'
		process.stdout.write "\ngetLCA\n"
		process.stdout.write "\ns1\n"
		process.stdout.write inspect(s1)
		process.stdout.write "\ns2\n"
		process.stdout.write inspect(s2)
		###

		commonAncestors = []
		for a in s1.ancestors
			anc = idToStateMap[a]
			#console.debug "anc",anc
			if s2.id in anc.descendants
				commonAncestors.push a

		if not commonAncestors.length
			throw new Error("Could not find LCA for states.")
		return commonAncestors[0]

	#FIXME: work on this API
	return (inFileOrObject,outFile) ->
		if typeof inFileOrObject is "object" and isArray inFileOrObject
			return transform inFileOrObject
		else
			go = (jsonStr) ->
				scxmlJson = JSON.parse jsonStr

				s = transformAndSerialize scxmlJson,true,true,true,true

				if outFile is "-"
					process.stdout.write s
				else
					fs = require 'fs'
					fs.writeFileSync outFile,s,'utf-8'

			if not inFileOrObject or inFileOrObject is "-"
				process.stdin.resume()
				process.stdin.setEncoding "utf-8"

				#read from stdin
				json = ""
				process.stdin.on "data",(data) -> json += data
				process.stdin.on "end", -> go json

			else
				fs = require 'fs'
				str = fs.readFileSync inFileOrObject,'utf-8'
				go str
