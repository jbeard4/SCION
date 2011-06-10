from event import Event
from collections import deque	#this is a non-synchronized queue

class SCXMLModel():
	def __init__(self,rootState=None,profile="python"):
		self.root = rootState
		self.profile = profile

	def __str__(self):
		allNodes = [self.root]
		allNodes.extend(self.root.getDescendants())
		allNodeStrings = map(lambda n : str(n),allNodes)
		return "\n".join(allNodeStrings) 

		

class State():
	BASIC = 0
	COMPOSITE = 1
	PARALLEL = 2
	#AND = 3
	HISTORY = 4
	INITIAL = 5
	FINAL = 6

	def __init__(self,name="",kind=BASIC,documentOrder=0,isDeep=False):
		self.name = name
		self.kind = kind
		self.documentOrder = documentOrder

		self.enterActions = []
		self.exitActions = []
		self.transitions = []
		self.parent = None
		#FIXME: maybe subclass COMPOSITE type, as basic will not have these properties?
		self.children = []
		self.initial = None
		self.history = None
		#FIXME: maybe subclass HISTORY type, as this property is likewise not meaningful for other
		self.isDeep = isDeep

	def __str__(self):
		return self.name

	def __repr__(self):
		return "<" + str(self) + ">"

	def getDepth(self):
		count = 0
		state = self.parent
		while state:
			count = count + 1
			state = state.parent

		return count

	def getAncestors(self,root = None):
		ancestors = []

		state = self.parent
		while state is not root:
			ancestors.append(state)
			state = state.parent

		return ancestors

	def getAncestorsOrSelf(self,root=None):
		return [self] + self.getAncestors()

	def getDescendants(self):
		descendants = [] 
		queue = deque(self.children)

		while queue:
			state = queue.popleft()
			descendants.append(state)

			for child in state.children:
				queue.append(child)

		return descendants

	def getDescendantsOrSelf(self):
		return [self] + self.getDescendants()

	def isOrthogonalTo(self,s):
		#Two control states are orthogonal if they are not ancestrally
		#related, and their smallest, mutual parent is a Concurrent-state.
		return not self.isAncestrallyRelatedTo(s) and self.getLCA(s).kind is State.PARALLEL

	def isAncestrallyRelatedTo(self,s):
		#Two control states are ancestrally related if one is child/grandchild of another.
		return self in s.getAncestorsOrSelf() or s in self.getAncestorsOrSelf()

	def getLCA(self,s):
		commonAncestors = filter(lambda a : s in a.getDescendants(),self.getAncestors())
		lca = None
		if commonAncestors:
			lca = commonAncestors[0]

		return lca

class Transition():
	def __init__(self,event=None,documentOrder=0,cond=None,source=None,targets=None,actions=None):
		self.event = event 
		self.documentOrder = documentOrder
		self.cond = cond

		self.source = source 
		self.targets = targets
		self.actions = actions or []

	def __str__(self):
		return self.source.name + " -> " + repr([target.name for target in self.targets])

	def __repr__(self):
		return "<" + str(self) + ">"

	def getLCA(self):
		return self.source.getLCA(self.targets[0])

class Action():
	def __call__(self):
		pass

class SendAction(Action):
	def __init__(self,eventName="",timeout=0,sendid=None,contentExpr=None):
		self.eventName = eventName
		self.timeout = timeout
		self.sendid = sendid
		self.contentexpr = contentExpr

class CancelAction(Action):
	def __init__(self,sendid):
		self.sendid = sendid

class LogAction(Action):
	def __init__(self,expr):
		self.expr = expr

class AssignAction(Action):
	def __init__(self,location="",expr=""):
		self.location = location
		self.expr = expr

class ScriptAction(Action):
	def __init__(self,code=""):
		self.code = code
