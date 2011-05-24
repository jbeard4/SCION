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
import logging
import pdb

logging.basicConfig(format='%(levelname)s:%(message)s', level=logging.DEBUG)

class SCXMLInterpreter():

	def __init__(self,model):
		self.model = model
		self._configuration = set()	#full configuration, or basic configuration? what kind of set implementation?
		self._innerEventQueue = deque()
		self._isInFinalState = False
		self._datamodel = {}

	def start(self):
		#perform big step without events to take all default transitions and reach stable initial state
		logging.info("performing initial big step")
		self._configuration.add(self.model.initial)
		self._performBigStep()	

	def getConfiguration(self):
		return set(map(lambda s: s.name,self._configuration))

	def _performBigStep(self,e=None):

		if e: 
			self._innerEventQueue.append(set([e]))

		keepGoing = True

		while keepGoing:
			eventSet = None

			if self._innerEventQueue:
				eventSet = self._innerEventQueue.popleft()
			else:
				eventSet = set()

			keepGoing = self._performSmallStep(eventSet)

		if not filter(lambda s : not s.kind is State.FINAL, self._configuration):
			self._isInFinalState = True

	def _performSmallStep(self,eventSet):

		logging.info("selecting transitions with eventSet: " + str(eventSet))

		selectedTransitions = self._selectTransitions(eventSet)

		logging.info("selected transitions: " + str(selectedTransitions))

		if selectedTransitions:
			# -> Concurrency: Order of transitions: Explicitly defined
			sortedTransitions = sorted(selectedTransitions,lambda t : t.documentOrder)	#implicitly converts unordered set to ordered list

			logging.info("sorted transitions: "+ str(sortedTransitions))

			statesExited = self._getStatesExited(sortedTransitions) 
			basicStatesExited  = set(map(lambda s : s.source,sortedTransitions))
			statesEntered = self._getStatesEntered(sortedTransitions) 
			basicStatesEntered  = set(map(lambda s : s.target,sortedTransitions))

			logging.info("basicStatesExited " + str(basicStatesExited))
			logging.info("basicStatesEntered " + str(basicStatesEntered))
			logging.info("statesExited " + str(statesExited))
			logging.info("statesEntered " + str(statesEntered))

			eventsToAddToInnerQueue = set()

			#operations will be performed in the order described in Rhapsody paper

			logging.info("executing state exit actions")
			for state in statesExited:
				logging.info("exiting " + str(state))
				for action in state.exitActions:
					action(self._datamodel,eventsToAddToInnerQueue)

			# -> Concurrency: Number of transitions: Multiple
			logging.info("executing transitition actions")
			for transition in sortedTransitions:
				logging.info("transitition " + str(transition))
				for action in transition.actions:
					action(self._datamodel,eventsToAddToInnerQueue) 		

			logging.info("executing state enter actions")
			for state in statesEntered:
				logging.info("entering " + str(state))
				for action in state.enterActions:
					action(self._datamodel,eventsToAddToInnerQueue)

			#update configuration by removing basic states exited, and adding basic states entered
			logging.info("updating configuration ")
			logging.info("old configuration " + str(self._configuration))

			self._configuration = (self._configuration - basicStatesExited) | basicStatesEntered

			logging.info("new configuration " + str(self._configuration))
			
			#add set of generated events to the innerEventQueue -> Event Lifelines: Next small-step
			if eventsToAddToInnerQueue:
				logging.info("adding triggered events to inner queue " + str(eventsToAddToInnerQueue))

				self._innerEventQueue.append(eventsToAddToInnerQueue)

		#if selectedTransitions is empty, we have reached a stable state, and the big-step will stop, otherwise will continue -> Maximality: Take-Many
		return selectedTransitions 	

	def _getStatesExited(self,transitions):
		statesExited = []
		for transition in transitions:
			lca = transition.getLCA()
			
			state = transition.source
			while not state is lca:
				statesExited.append(state)
				state = state.parent

		return statesExited


	def _getStatesEntered(self,transitions):
		statesEntered = []

		for transition in transitions:
			lca = transition.getLCA()
			
			state = transition.target
			while not state is lca:
				statesEntered.append(state)
				state = state.parent

		statesEntered.reverse()
		return statesEntered
		
	def _selectTransitions(self,eventSet):
		allTransitions = self._getAllActivatedTransitions(self._configuration,eventSet);
		print "allTransitions",allTransitions 
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

		print eventNames
		
		#pdb.set_trace()
		for state in statesAndParents:
			print state
			for t in state.transitions:
				print t,t.event
				if (t.event is None or t.event in eventNames) and t.cond():
					print "adding transition t to selected transitions"
					transitions.add(t)

		return transitions 
	

	def _makeTransitionsConsistent(self,transitions):
		consistentTransitions = set()

		(transitionsNotInConflict, transitionsPairsInConflict) = self._getTransitionsInConflict(transitions)
		consistentTransitions = consistentTransitions | transitionsNotInConflict 

		while transitionsPairsInConflict:

			transitions = self._selectTransitionsBasedOnPriority(transitionsPairsInConflict)

			(transitionsNotInConflict, transitionsPairsInConflict) = self._getTransitionsInConflict(transitions)

			consistentTransitions = consistentTransitions | transitionsNotInConflict 

			print "transitionsNotInConflict",transitionsNotInConflict
			print "transitionsPairsInConflict",transitionsPairsInConflict
			
		return consistentTransitions 
			
	def _getTransitionsInConflict(self,transitions):

		allTransitionsInConflict = set() 	#set of tuples
		transitionsPairsInConflict = set() 	#set of tuples

		#better to use iterators, because not sure how to encode "order doesn't matter" to list comprehension
		transitionList = list(transitions)
		print "transitions",transitionList

		for i in range(0,len(transitionList)):
			for j in range(i,len(transitionList)):
				if not i == j:		
					t1 = transitionList[i]
					t2 = transitionList[j]
					
					if self._conflicts(t1,t2):
						allTransitionsInConflict.add(t1)
						allTransitionsInConflict.add(t2)
						transitionsPairsInConflict.add((t1,t2))

		transitionsNotInConflict = transitions - allTransitionsInConflict

		return transitionsNotInConflict, transitionsPairsInConflict
	

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
			if t1.source.getDepth() < t2.source.getDepth():
				return t2
			elif t2.source.getDepth() < t1.source.getDepth():
				return t1
			else:
				if t1.documentOrder < t2.documentOrder:
					return t1
				else:
					return t2

		return set(map(compareBasedOnPriority,transitionsInConflict))	#FIXME: eliminate dups?


class SimpleInterpreter(SCXMLInterpreter):

	#External Event Communication: Asynchronous
	def __call__(self,e):	
		#pass it straight through	
		logging.info("received event " + str(e))
		self._performBigStep(e)

