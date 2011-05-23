"""
Summary of SC Semantics:
	Concurrency:
		Number of transitions: Multiple

		Order of transitions: Explicitly defined, based on document order (which defines a total order).

	Transition Consistency:
		Small-step consistency: Source/Destination Orthogonal

		Interrupt Transitions and Preemption: Non-preemptive 

	Maximality: Take-Many 

	Memory Protocols: Small-step

	Event Lifelines: Next small-step

	External Event Communication: Asynchronous

	Priority: Source-Child. If that is ambiguous, then document order is used.

Parameterized Parts of the Algorithm: Priority, Transition Consistency

"""

from Queue import Queue		#this is a synchronized Queue. needed in the thread-safe implementation
from collections import deque	#this is a non-synchronized queue
import thread
import time
import copy

class SCXMLModel():
	def __init__(self,initialState=None):
		self.initial = initialState

class Event():
	def __init__(self,name="",data=None):
		self.name = name
		self.data = data
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

from lxml import etree

stateTagNames = set(["initial","parallel","final","history","state"])

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

class SCXMLInterpreter():

	def __init__(self,model):
		self.model = model
		self._configuration = set()	#full configuration, or basic configuration? what kind of set implementation?
		self._innerEventQueue = deque()
		self._isInFinalState = False
		self._datamodel = {}

	def start(self):
		#perform big step without events to take all default transitions and reach stable initial state
		self._configuration.append(self.model.initial)
		self._performBigStep()	

	def getConfiguration(self):
		return copy.copy(self._configuration)

	def _performBigStep(self,e=None):

		if e:
			self._innerEventQueue.append(set(e))

		keepGoing = True

		while keepGoing:
			eventSet = None

			if self._innerEventQueue:
				eventSet = self._innerEventQueue.popleft()
			else:
				eventSet = set()

			keepGoing = self._performSmallStep(eventSet)

		if every(lambda s : s.kind is State.FINAL, self._configuration):
			self._isInFinalState = True

	def _performSmallStep(self,eventSet):

		selectedTransitions = self._selectTransitions(eventSet);

		# -> Concurrency: Order of transitions: Explicitly defined
		sortedTransitions = sort(selectedTransitions,lambda t : t.documentOrder)	#implicitly converts unordered set to ordered list

		statesExited = self._getStatesExited(sortedTransitions) 
		basicStatesExited  = filter(lambda s : s.source,sortedTransitions)
		statesEntered = self._getStatesEntered(sortedTransitions) 
		basicStatesEntered  = filter(lambda s : s.target,sortedTransitions).reverse()

		eventsToAddToInnerQueue = set()

		#operations will be performed in the order described in Rhapsody paper

		#TODO: pass to actions whatever local variables will be needed
		for state in statesExited:
			state.exitAction(self._datamodel,eventsToAddToInnerQueue)

		# -> Concurrency: Number of transitions: Multiple
		for transition in sortedTransitions:
			for action in transition.actions:
				action(self._datamodel,eventsToAddToInnerQueue) 		

		for state in statesEntered:
			state.enterAction(self._datamodel,eventsToAddToInnerQueue)

		#update configuration by removing basic states exited, and adding basic states entered
		self._configuration = (self._configuration - basicStatesExited) | basicStatesEntered

		#add set of generated events to the innerEventQueue -> Event Lifelines: Next small-step
		self._innerEventQueue.append(eventsToAddToInnerQueue)

		#if selectedTransitions is empty, we have reached a stable state, and the big-step will stop, otherwise will continue -> Maximality: Take-Many
		return selectedTransitions 	

	def _getStatesExited(self,transitions):
		statesExited = []
		for transition in transitions:
			lca = transition.getLCA()
			
			state = lca.transition
			while not state is lca:
				statesExited.append(state)
				state = state.parent

		return statesExited


	def _getStatesEntered(self,transitions):
		statesEntered = []

		for transition in transitions:
			lca = transition.getLCA()
			
			while not state is lca:
				statesEntered.append(state)
				state = state.parent

		return statesExited.reverse()
		
	def _selectTransitions(eventSet):
		allTransitions = self._getAllActivatedTransitions(self._configuration,eventSet);
		consistentTransitions = self._makeTransitionsConsistent(allTransitions);
		return consistentTransitions; 

	def _getAllActivatedTransitions(self,configuration,eventSet):
		"""
		for all states in the configuration and their parents, select transitions
		if cond had side effects, then the order in which these are executed would matter
		otherwise, should not matter.
		if cond has side effects, though, merely querying could change things. 
		so, basically, cond should not have side effects... that would make this less general
		"""

		transitions = set();

		statesAndParents = set();

		#get full configuration, unordered
		#this means we may select transitions from parents before children
		for basicState in configuration:
			statesAndParents.add(basicState)

			for ancestor in basicState.getAncestors():
				statesAndParents.add(ancestor)


		eventNames = map(lambda e : e.name,eventSet)
		
		for state in statesAndParents:
			transitions.concat( filter(lambda t : (not t.eventName or t.eventName in eventNames) and t.cond(),state.transitions))
	

	def _makeTransitionsConsistent(self,transitions):
		conflictingTransitions = self._getTransitionsInConflict(transitions)
		consistentTransitions = self._selectTransitionsBasedOnPriority(conflictingTransitions)
		return consistentTransitions 
			
	def _getTransitionsInConflict(self,transitions):

		transitionsInConflict = set() 	#set of tuples

		#better to use iterators, because not sure how to encode "order doesn't matter" to list comprehension
		for i in range(0,transitions.length):
			for j in range(i,transitions.length):
				if not i == j:		
					t1 = transitions[i]
					t2 = transitions[j]
					
					if self._conflicts(t1,t2):
						 transitionsInConflict.add((t1,t2))

		return transitionsInConflict
	

	#this would be parameterizable
	# -> Transition Consistency: Small-step consistency: Source/Destination Orthogonal
	# -> Interrupt Transitions and Preemption: Non-preemptive 
	def _conflicts(self,t1,t2):
		#here we put the conflict logic...
		#decide on one of these... arena orthogonal, or the other.
		return not self._isSourceDestinationOrthogonal(t1,t2) 	
	

	def _isSourceDestinationOrthogonal(self,t1,t2):
		return t1.source.isOrthogonalTo(t2.source) and t1.dest.isOrthogonalTo(t2.dest) and t1.source.isOrthogonalTo(t2.dest) and t1.dest.isOrthogonalTo(t2.source)
	
	# -> Priority: Source-Child 
	#this would also be parameterizable
	def _selectTransitionsBasedOnPriority(self,transitionsInConflict):
		
		def _compareBasedOnPriority(self,(t1,t2)):
			if t1.depth < t2.depth:
				return t1
			elif t2.depth < t1.depth:
				return t2
			else:
				if t1.documentOrder < t2.documentOrder:
					return t1
				else:
					return t2

		return map(compareBasedOnPriority,transitionsInConflict)	#FIXME: eliminate dups?



class SimpleInterpreter(SCXMLInterpreter):

	#External Event Communication: Asynchronous
	def GEN(self,e):
		#pass it straight through	
		self._performBigStep(e)
	

class ThreadsafeInterpreter(SCXMLInterpreter):

	def __init__(self):
		self._externalEventQueue = Queue();

		SCXMLInterpreter.__init__(self)

	#External Event Communication: Asynchronous
	def GEN(self,e):
		#put it into a blocking queue. send event in when the queue unblocks
		self._externalEventQueue.put(e)

	def start(self):
		self._mainEventLoop()
		SCXMLInterpreter.start(self)

class PollingThreadsafeInterpreter(ThreadsafeInterpreter):

	def __init__(self):
		self._isProcessingEvent = False;

		ThreadsafeInterpreter.__init__(self)

	def _mainEventLoop(self):
		if not self._isInFinalState:
			if not self._externalEventQueue.empty() and not self._isProcessingEvent:
				e = self._externalEventQueue.get(False)

				self._isProcessingEvent = true
				self._performBigStep(e)
				self._isProcessingEvent = false

			#poll
			thread.start_new_thread(lambda:(time.sleep(10),self._mainEventLoop()),())


class QueuedThreadsafeInterpreter(ThreadsafeInterpreter):

	def _mainEventLoop(self):
		while not self._isInFinalState:
			e = self._externalEventQueue.get(True)	#True means he will block until he receives an event
			self._performBigStep(e)

			

