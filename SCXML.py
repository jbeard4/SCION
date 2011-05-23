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

#TODO: add support for history

from collections import deque	#this is a non-synchronized queue
import copy
from model import State
from event import Event

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
		
		def compareBasedOnPriority((t1,t2)):
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
	def GEN(self,e):	#TODO: replace this with __call__ operator overloading?
		#pass it straight through	
		self._performBigStep(e)

if __name__ == "__main__":
	import sys
	from doc2model import scxmlFileToPythonModel
	pathToSCXML = sys.argv[1]
	print pathToSCXML 
	scxmlFile = file(pathToSCXML)
	model = scxmlFileToPythonModel(scxmlFile) 
	interpreter = SimpleInterpreter(model) 
	interpreter.start() 
