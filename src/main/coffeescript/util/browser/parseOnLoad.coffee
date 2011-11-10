#returns a function that should be called on load
define ["scxml/SCXML","util/annotate-scxml-json","scxml/json2model","scxml/event","lib/JsonML_DOM"], ({BrowserInterpreter : BrowserInterpreter},jsonAnnotator,json2model,Event,JsonML) -> ->

	"""
	A statechart is initialized from an XML document as follows:
	1. Get the SCXML document.
	2. Convert the XML to JsonML using XSLT or DOM, and parse the JSON to
		an SCXML-JSON document.
	3. Annotate and transform the SCXML-JSON document so that it is in a
		form more congenial to interpretation, creating an annotated SCXML-JSON
		document
	4. Convert the SCXML-JSON document to a statechart object model. This
		step essentially converts id labels to object references, parses JavaScript
		scripts and expressions embedded in the SCXML as js functions, and does some
		validation for correctness. 
	5. Use the statechart object model to instantiate an instance of the
		statechart interpreter. Optionally, we can pass to the construct an object to
		be used as the context object (the 'this' object) in script evaluation. Lots of
		other parameters are available.
	6. Connect relevant event listeners to the statechart instance.
	7. Call the start method on the new intrepreter instance to start
		execution of the statechart.

	Also note that steps 1-3 can be done ahead-of-time. The annotated
		SCXML-JSON object can be serialized as JSON and sent across the wire before
		being converted to a statechart object model in step 4. 
	"""
	scxmlElements = document.getElementsByTagName "scxml"

	for scxml in scxmlElements
		console.log "scxml",scxml

		#step 1 - get the scxml document
		domNodeToHookUp = scxml.parentNode
		console.log "domNodeToHookUp",domNodeToHookUp

		#prep scxml document to transform by pulling the scxml node into its own document
		scxmlns = "http://www.w3.org/2005/07/scxml"
		scxmlToTransform = document.implementation.createDocument scxmlns,"scxml",null
		newNode = scxmlToTransform.importNode scxml.cloneNode(true),true
		scxmlToTransform.replaceChild newNode,scxmlToTransform.documentElement
		console.log "newNode",newNode

		#step 2 - transform scxmlToTransform to JSON
		[emptyTag, scxmlJson] = JsonML.parseDOM scxmlToTransform
		console.log "scxmlJson",scxmlJson

		#step 3 - transform the parsed JSON model so it is friendlier to interpretation
		annotatedScxmlJson = jsonAnnotator scxmlJson
		console.log "annotatedScxmlJson",annotatedScxmlJson

		#step 4 - initialize sc object model
		model = json2model annotatedScxmlJson
		console.log "model",model
		
		#step 5 - instantiate statechart
		interpreter = new BrowserInterpreter model,{evaluationContext : domNodeToHookUp}
		console.log "interpreter",interpreter

		#step 6 - connect all relevant event listeners - maybe encoded in DOM?
		#TODO: allow setting this up declaratively using DOM
		for eventName in ["mousedown","mouseup","mousemove"]
			do (eventName) ->
				domNodeToHookUp.addEventListener(
					eventName,
					((e) ->
						e.preventDefault()
						interpreter.gen(new Event(eventName,e))),
					false)

		#step 7 - start statechart
		interpreter.start()
