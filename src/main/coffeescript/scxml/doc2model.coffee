define ["scxml/model","util/xml/rhino","lib/json2"],(model,xml) ->
	#local imports
	SCXMLModel = model.SCXMLModel
	State = model.State
	Transition = model.Transition
	SendAction = model.SendAction
	CancelAction = model.CancelAction
	LogAction = model.LogAction
	AssignAction = model.AssignAction
	ScriptAction = model.ScriptAction

	scxmlNS = "http//www.w3.org/2005/07/scxml"

	stateTagNames = ["initial","parallel","final","history","state"]

	class UnsupportedProfileException extends Error

	supportedProfiles = ["ecmascript"]

	generateNewId = (doc,element) ->
		name = element.localName
		count = 0

		newId = name + count
		elt = doc.getElementById(newId)

		console.log "newId",newId
		while elt
			count++
			newId = name + count
			console.log "newId",newId
			elt = doc.getElementById(newId)

		return newId

	walk = (root,fn) ->
		q = [root]
		count = 0
		while q.length
			do ->
				u = q.shift()
				fn u,count
				count = count + 1
				
				for child in u.childNodes
					q.push child

	attr = (node,attrName) -> String(node.getAttributeNS(null,attrName))

	#right now we assume we're given a nice, normalized document
	scxmlDocToPythonModel = (doc) ->
		
		#normalize root id
		root = doc.documentElement

		if attr(root,"name") and not attr(root,"id")
			root.set("id",attr(root,"name"))

		profile = attr(root,"profile") or "python"
		if String(profile) not in supportedProfiles
			throw new UnsupportedProfileException("Profile not supported")

		#normalize initial attributes
		normalizeInitialAttributes = (elt) ->
			if attr(elt,"initial")
				newInitial = doc.createElementNS scxmlNS,"initial"
				newTransition = doc.createElementNS scxmlNS,"transition"
				newTransition.setAttributeNS null,"target",attr(elt,"initial")
				newInitial.appendChild newTransition
				elt.appendChild newInitial

		console.log "normalizing initial attributes..."
		walk root,normalizeInitialAttributes
		console.log "done"

		normalizeIds = (elt) ->
			if not attr(elt,"id")
				newId = generateNewId doc,elt
				console.log "setting new id ",newId," for elt ",elt.node
				elt.setAttributeNS null,"id",newId

		console.log "normalizing node ids..."
		walk root,normalizeIds
		console.log "done"

		console.log "normalized doc"
		console.log xml.serializeToString doc.doc

		id = (elt) -> attr(elt,"id")

		eltIdToObj = {}
			
		generateNodeToObjMap = (elt,order) ->
			eltId = id(elt)

			switch elt.localName
				when "state"
					if (childNode for childNode in elt.childNodes when childNode.localName in stateTagNames).length
						eltIdToObj[eltId] = new State(eltId,State.COMPOSITE,order)
					else
						eltIdToObj[eltId] = new State(eltId,State.BASIC,order)
				when "scxml"
					eltIdToObj[eltId] = new State(eltId,State.COMPOSITE,order)
				when "initial"
					eltIdToObj[eltId] = new State(eltId,State.INITIAL,order)
				when "parallel"
					eltIdToObj[eltId] = new State(eltId,State.PARALLEL,order)
				when "final"
					eltIdToObj[eltId] = new State(eltId,State.FINAL,order)
				when "history"
					isDeep = attr(elt,"type") == "deep"

					eltIdToObj[eltId] = new State(eltId,State.HISTORY,order,isDeep)
				when "transition"
					event = attr(elt,"event") or null
					cond = attr(elt,"cond") or null
					
					eltIdToObj[eltId] = new Transition(eltId,event,order,cond)
				when "send"
					delay = getDelayInMs(elt)
					sendid = attr(elt,"sendid") or null
					contentExpr = attr(elt,"contentexpr") or null #TODO put contentexpr into its own namespace?
					eltIdToObj[eltId] = new SendAction(attr(elt,"event"),delay,sendid,contentExpr)
				when "log"
					eltIdToObj[eltId] = new LogAction(attr(elt,"expr"))
				when "cancel"
					eltIdToObj[eltId] = new CancelAction(attr(elt,"sendid"))
				when "assign"
					eltIdToObj[eltId] = new AssignAction(attr(elt,"location"),attr(elt,"expr"))
				when "script"
					eltIdToObj[eltId] = new ScriptAction(elt.textContent)

		console.log "generating nodeToObjMap..."
		walk root,generateNodeToObjMap
		console.log "done..."

		#second pass
		#print "constructing model - starting second pass"
		for own eltId,obj of eltIdToObj

			elt = doc.getElementById(eltId)

			if obj instanceof State
				#link to parent
				p = elt.parentNode
				if p and eltIdToObj[id(p)]
					parentObj = eltIdToObj[id(p)]
					#print "make",parentObj,"parent of",obj
					obj.parent = parentObj

				for childNode in elt.childNodes
					#transition children
					#may fall into the next case, for initial state
					if childNode.localName in stateTagNames
						childObj = eltIdToObj[id(childNode)]
						#print "make",childObj,"child of",obj 
						obj.children.push(childObj)

					switch childNode.localName
						when "initial"
							obj.initial = eltIdToObj[id(childNode)]
						when "history"
							obj.history = eltIdToObj[id(childNode)]
						#entry and exit actions
						when "onentry"
							for actionNode in childNode.childNodes
								obj.enterActions.push(eltIdToObj[id(actionNode)])
						when "onexit"
							for actionNode in childNode.childNodes
								obj.exitActions.push(eltIdToObj[id(actionNode)])

			else if obj instanceof Transition
				#hook up transition actions
				for childNode in elt.childNodes
					childObj = eltIdToObj[id(childNode)]
					obj.actions.push(childObj)

				#hook up transition source
				obj.source = eltIdToObj[ id(elt.parentNode) ]

				obj.source.transitions.push(obj)

				#hook up transition target
				obj.targets = (eltIdToObj[targetId] for targetId in attr(elt,"target").split(" "))

		#print "constructing model - finished second pass"
			
		#hook up the initial state
		rootState = eltIdToObj[id(root)]
		#console.log "rootState",rootState

		#instantiate and return the model
		model = new SCXMLModel rootState,profile

		return model

	getDelayInMs = (sendElt) ->
		delayString = attr(sendElt,"delay")

		if not delayString
			return 0
		else
			if delayString[-2..] == "ms"
				return parseFloat(delayString[..-3])
			else if delayString[-1..] == "s"
				return parseFloat(delayString[..-2]) * 1000
			else
				#assume milliseconds
				return parseFloat(delayString)

	return scxmlDocToPythonModel	#expose the API

