from lxml import etree
from model import *

scxmlNS = "http://www.w3.org/2005/07/scxml"

#short for qualify
def q(tag):
	return "{" + scxmlNS + "}" + tag

stateTagNames = map(q,["initial","parallel","final","history","state"])

#TODO: not quite done. still need a set to lookup qualified tag names (in) as well as shorthand other stuff...

def scxmlFileToPythonModel(scxmlFile):
	return scxmlDocToPythonModel(etree.parse(scxmlFile))

#TODO: normalize document using XSLT
#right now we assume we're given a nice, normalized document
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

		if elt.tag == q("state"):
			p = elt.getparent()
			if p is not None and p.tag == q("parallel"):
				nodeToObj[elt] = State(id,State.AND,order)
			elif filter(lambda n : n.tag in stateTagNames, list(elt)):
				nodeToObj[elt] = State(id,State.COMPOSITE,order)
			else:
				nodeToObj[elt] = State(id,State.BASIC,order)
		elif elt.tag == q("scxml"):
			nodeToObj[elt] = State(id,State.COMPOSITE,order)	
		elif elt.tag == q("initial"):
			nodeToObj[elt] = State(id,State.INITIAL,order)	
		elif elt.tag == q("parallel"):
			nodeToObj[elt] = State(id,State.PARALLEL,order)
		elif elt.tag == q("final"):
			nodeToObj[elt] = State(id,State.FINAL,order)	
		elif elt.tag == q("history"):
			nodeToObj[elt] = State(id,State.HISTORY,order)
		elif elt.tag == q("transition"):
			event = elt.get("event")
			if not event:
				event = None
			nodeToObj[elt] = Transition(event,order)
		elif elt.tag == q("send"):
			nodeToObj[elt] = SendAction(elt.get("event"))
		elif elt.tag == q("assign"):
			nodeToObj[elt] = AssignAction(elt.get("location"),elt.get("expr"))
		elif elt.tag == q("script"):
			nodeToObj[elt] = ScriptAction(elt.text)
		else:
			pass

		order = order + 1

	#second pass
	#print "constructing model - starting second pass"
	for elt,obj in nodeToObj.iteritems():
		if isinstance(obj,State):
			#link to parent
			p = elt.getparent()
			if p is not None and p in nodeToObj:
				parentObj = nodeToObj[p]
				#print "make",parentObj,"parent of",obj
				obj.parent = parentObj 

			for childNode in elt:
				#transition children
				if childNode.tag in stateTagNames:
					childObj = nodeToObj[childNode]
					#print "make",childObj,"child of",obj 
					obj.children.append(childObj)
				#entry and exit actions
				elif childNode.tag == q("onentry"):
					for actionNode in childNode:
						if actionNode in nodeToObj:
							elt.entryActions.append(nodeToObj[actionNode])
				elif childNode.tag == q("onexit"):
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

			obj.source.transitions.append(obj)

			#hook up transition target
			obj.target = nodeToObj[idToNode[elt.get("target")]]
		else:
			pass	#no post-processing needed on other elements

	#print "constructing model - finished second pass"
		
	#hook up the initial state
	rootNode = tree.getroot()
	rootState = nodeToObj[rootNode]
	initialNode = filter(lambda n : n.tag == q("initial"), list(rootNode))[0]
	initialState = nodeToObj[initialNode] 

	#instantiate and return the model
	model = SCXMLModel(initialState,rootState) 

	return model
