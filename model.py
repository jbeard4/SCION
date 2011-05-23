from event import Event

class SCXMLModel():
	def __init__(self,initialState=None):
		self.initial = initialState

class State():
	BASIC = 0
	COMPOSITE = 1
	PARALLEL = 2
	AND = 3
	HISTORY = 4
	INITIAL = 5
	FINAL = 6

	def __init__(self,name="",enterActions=[],exitActions=[],transitions=[],parent=None,children=[],kind=BASIC,documentOrder=0):
		self.name = name
		self.enterAction = enterAction 
		self.exitAction = exitAction
		self.transitions = transitions
		self.parent = parent
		self.kind = kind
		self.children = children
		self.documentOrder = documentOrder

	def getAncestors(self):
		ancestors = []

		state = self
		while state:
			ancestors.append(state)
			state = state.parent

		return ancestors

	def getDescendants(self):
		descendants = [self]

		for child in self.children:
			descendants.concat(child.getDescendants())

		return descendants 
		
	def isOrthogonalTo(self,s):
		#Two control states are orthogonal if they are not ancestrally
		#related, and their smallest, mutual parent is a Concurrent-state.
		return not self.isAncestrallyRelatedTo(s) and self.getLCA(s).kind is State.AND

	def isAncestrallyRelatedTo(self,s):
		#Two control states are ancestrally related if one is child/grandchild of another.
		return self in s.getAncestors() or s in self.getAncestors()

	def getLCA(self,s):
		commonAncestors = filter(lambda a : s in a.getDescendants(),self.getAncestors())
		lca = None
		if commonAncestors:
			lca = commonAncestors[0]

		return lca

class Transition():
	def __init__(self,eventName="",source=None,target=None,actions=[],documentOrder=0):
		self.eventName = eventName 
		self.source = source 
		self.target = target
		self.actions = actions
		self.documentOrder = documentOrder

	def getLCA(self):
		return self.source.getLCA(self.target)

class Action():
	def __call__(self):
		pass

class SendAction(Action):
	def __init__(self,eventName="",timeout=0):
		self.eventName = eventName
		self.timeout = timeout

	def __call__(self,datamodel,eventList):
		eventList.add(Event(self.eventName))

class AssignAction(Action):
	def __init__(self,location="",expr=""):
		self.location = location
		self.expr = expr

	def __call__(self,datamodel,eventList):				#TODO: replace datamodel with scripting context
		#Memory Protocols: Small-step
		datamodel[self.location] = eval(self.expr)	#TODO: eval js code using spidermonkey bindings

class ScriptAction(Action):
	def __init__(self,code=""):
		self.code = code

	def __call__(self,datamodel,eventList):				#TODO: replace datamodel with scripting context
		eval(self.code)					#TODO: eval js using spidermonkey bindings

