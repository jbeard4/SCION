from lxml import etree
from model import *

stateTagNames = set(["initial","parallel","final","history","state"])

def scxmlFileToPythonModel(scxmlFile):
	return scxmlDocToPythonModel(etree.parse(scxmlFile))

def scxmlDocToPythonModel(tree):
	
	#TODO: parse document into tree
	nodeToObj = {}
	idToNode = {}	#because etree doesn't give us getElementById

	order = 0
	walkAll = tree.getiterator()
	for elt in walkAll:
		id = elt.get("id")
		if id:
			idToNode[id] = elt

		if elt.tag == "state":
			p = elt.getparent()
			if p and p.tag == "parallel":
				nodeToObj[elt] = State(name=id,kind=State.AND,documentOrder=order)
			elif some(lambda n : n.tag in stateTagNames, list(elt)):
				nodeToObj[elt] = State(name=id,kind=State.COMPOSITE,documentOrder=order)
			else:
				nodeToObj[elt] = State(name=id,kind=State.BASIC,documentOrder=order)
		elif elt.tag == "initial":
			nodeToObj[elt] = State(name=id,kind=State.INITIAL,documentOrder=order)	
		elif elt.tag == "parallel":
			nodeToObj[elt] = State(name=id,kind=State.PARALLEL,documentOrder=order)
		elif elt.tag == "final":
			nodeToObj[elt] = State(name=id,kind=State.FINAL,documentOrder=order)	
		elif elt.tag == "history":
			nodeToObj[elt] = State(name=id,kind=State.HISTORY,documentOrder=order)
		elif elt.tag == "transition":
			nodeToObj[elt] = Transition(eventName=elt.get("event"),documentOrder=order)
		elif elt.tag == "send":
			nodeToObj[elt] = SendAction(elt.get("event"))
		elif elt.tag == "assign":
			nodeToObj[elt] = AssignAction(elt.get("location"),elt.get("expr"))
		elif elt.tag == "script":
			nodeToObj[elt] = ScriptAction(elt.text)
		else:
			pass

		order = order + 1

	#second pass
	for elt,obj in nodeToObj.iteritems():
		if isinstance(obj,State):
			#link to parent
			p = elt.getparent()
			if p and p in nodeToObj:
				obj.parent = p

			for childNode in elt:
				#transition children
				if childNode in nodeToObj:
					childObj = nodeToObj[childNode]
					obj.children.append(childObj)
				#entry and exit actions
				elif childNode.tag == "onentry":
					for actionNode in childNode:
						if actionNode in nodeToObj:
							elt.entryActions.append(nodeToObj[actionNode])
				elif childNode.tag == "onexit":
					for actionNode in childNode:
						if actionNode in nodeToObj:
							elt.exitActions.append(nodeToObj[actionNode])
				else:
					pass #unknown tag
		elif isinstance(obj,Transition):
			#hook up transition actions
			for childNode in elt:
				if childNode in nodeToObj:
					childObj = nodeToObj[childNode]
					obj.actions.append(childObj)

			#hook up transition source
			obj.source = nodeToObj[ elt.getparent() ]

			#hook up transition target
			obj.target = nodeToObj[idToNode[elt.get("target")]]
		else:
			pass	#no post-processing needed on other elements
		
	#hook up the initial state
	rootNode = tree.getroot()
	initialNode = filter(lambda n : n.tag == "initial", list(rootNode))[0]
	
	#instantiate and return the model
	return SCXMLModel(initialNode) 
