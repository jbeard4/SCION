require ["scxml/SCXML","scxml/json2model","scxml/json2extra-model"],(scxml,json2model,json2ExtraModel) ->
	this.console =
		log : -> print JSON.stringify {method:"log",args:Array.prototype.slice.call(arguments)}
		debug : -> print JSON.stringify {method:"debug",args:Array.prototype.slice.call(arguments)}

	readyForTest = -> print "ready to receive test"

	#readyToReceiveEvents = -> print "ready to receive events"


	readyForTest()

	data = readline()

	console.log "received test",data

	o = JSON.parse data

	testJson = o.test

	mPath = if testJson.extraModelInfo then "scxml/model" else "scxml/extra-model"

	console.log "requiring",mPath,testJson.set.setType,testJson.transitionSelector.selector

	require [mPath,testJson.set.setType,testJson.transitionSelector.selector],(m,set,transitionSelector) ->

		console.log "imported depenedent modules"

		try

			init = ->
				#parse scxmlJson model
				model = json2model testJson.scxmlJson

				transitionSelector = transitionSelector model.transitions,model.events

				flattenedTransitionsRE = /\.flattened-transitions$/

				onlySelectFromBasicStates =  testJson.transitionSelector.selectorKey is "class-transition-lookup" or testJson.name.match flattenedTransitionsRE

				#filter basic states the easy way
				basicStates = (state for state in model.states when not (state.basicDocumentOrder is undefined)).sort((s1,s2) -> s1.basicDocumentOrder - s2.basicDocumentOrder)
				
				setPurposes =
					transitions :
						keyProp : "documentOrder"
						keyValueMap : model.transitions
						initializedSetClass : {}
					states :
						keyProp : "documentOrder"
						keyValueMap : model.states
						initializedSetClass : {}
					basicStates :
						keyProp : "basicDocumentOrder"
						keyValueMap : basicStates
						initializedSetClass : {}

				for purpose,info of setPurposes
					info.initializedSetClass =
						switch set
							when "bitVector"
								set info.keyProp,info.keyValueMap
							when "boolArray"
								set info.keyProp,info.keyValueMap.length
							when "objectSet"
								set info.keyProp
							when "arraySet"
								set


				optimizations =
					onlySelectFromBasicStates : onlySelectFromBasicStates
					TransitionSet : setPurposes.transitions.initializedSetClass
					StateSet : setPurposes.states.initializedSetClass
					BasicStateSet : setPurposes.basicStates.initializedSetClass

				return if testJson.extraModelInfo then [m,model,optimizations] else [m,json2ExtraModel(model),optimizations]

			printConfiguration = (configuration) -> print JSON.stringify {method : "getConfiguration", configuration : configuration}

			setTimeout = (event,timeout) -> print JSON.stringify {method : "setTimeout", event : event, timeout : timeout}

			clearTimeout = (id) -> print JSON.stringify {method : "clearTimeout", sendid : id}

			mainLoop = ->
				while chunk = readline()
					console.log "received chunk",chunk
					o = JSON.parse chunk
					interpreter[o.method](o.event)

			[m,model,optimizations] = init()
			console.log "data structures initialized"

			interpreter = new scxml.SimpleInterpreter model,setTimeout,clearTimeout,optimizations
			console.log "interpreter instantiated"

			interpreter.start()
			console.log "interpreter started"

			printConfiguration interpreter.getConfiguration()

			console.log "starting mainloop"
			mainLoop()

		catch e
			console.log "error",e.message
