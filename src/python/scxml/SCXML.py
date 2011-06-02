"""
Summary of SC Semantics:
	Concurrency:
		Number of transitions: Multiple

		Order of transitions: Explicitly defined, based on document order (which defines a total order).

	Transition Consistency:
		Small-step consistency: Arena Orthogonal

		Interrupt Transitions and Preemption: Non-preemptive 

	Maximality: Take-Many 

	Memory Protocols: Small-step

	Event Lifelines: Next small-step

	External Event Communication: Asynchronous

	Priority: Source-Child. If that is ambiguous, then document order is used.

Parameterized Parts of the Algorithm: Priority, Transition Consistency

"""

from collections import deque	#this is a non-synchronized queue
import copy
from model import State,SendAction,AssignAction,ScriptAction
from event import Event
import logging
import pdb
import sys

logging.basicConfig(format='%(levelname)s:%(message)s', level=logging.DEBUG)

#built-in evaluators. can be extended or overridden by the dev to support custom evaluators
defaultEvaluatorDict = {
	"python" : ("scxml.evaluators.py","PythonEvaluator"),
	"ecmascript" : ("scxml.evaluators.es","ECMAScriptEvaluator")
}

class SCXMLInterpreter():

	def __init__(self,model,evaluatorDict=defaultEvaluatorDict):
		self.model = model
		self._configuration = set()	#full configuration, or basic configuration? what kind of set implementation?
		self._historyValue = {}
		self._innerEventQueue = deque()
		self._isInFinalState = False
		self._datamodel = {}		#FIXME: should these be global, or declared at the level of the big step, like the eventQueue?
		self._datamodelForNextStep = {}

		#auto-configure the evaluator
		moduleName, className = evaluatorDict[self.model.profile]
		_tmp = __import__(moduleName,globals(),locals(),[className],-1)
		self.evaluator = _tmp.__dict__[className]()

	def start(self):
		#perform big step without events to take all default transitions and reach stable initial state
		logging.info("performing initial big step")
		self._configuration.add(self.model.root.initial)
		self._performBigStep()	

	def getConfiguration(self):
		return set(map(lambda s: s.name,self._configuration))

	def getFullConfiguration(self):
		return set(map(lambda s: s.name,reduce(lambda a,b : a + b, map(lambda s: [s] + s.getAncestors(),self._configuration))))

	def isIn(self,stateName):
		return stateName in self.getFullConfiguration()

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

			logging.info("sorted transitions: "+ str(selectedTransitions))

			basicStatesExited,statesExited = self._getStatesExited(selectedTransitions) 
			basicStatesEntered,statesEntered = self._getStatesEntered(selectedTransitions) 

			logging.info("basicStatesExited " + str(basicStatesExited))
			logging.info("basicStatesEntered " + str(basicStatesEntered))
			logging.info("statesExited " + str(statesExited))
			logging.info("statesEntered " + str(statesEntered))

			eventsToAddToInnerQueue = set()

			#operations will be performed in the order described in Rhapsody paper

			#update history states

			logging.info("executing state exit actions")
			for state in statesExited:
				logging.info("exiting " + str(state))

				#peform exit actions
				for action in state.exitActions:
					self._evaluateAction(action,eventsToAddToInnerQueue)

				#update history
				if state.history:
					if state.history.isDeep:
						f = lambda s0 : s0.kind is State.BASIC and s0 in state.getDescendants()
					else:
						f = lambda s0 : s0.parent is state
					
					self._historyValue[state.history] = filter(f,statesExited)

			# -> Concurrency: Number of transitions: Multiple
			# -> Concurrency: Order of transitions: Explicitly defined
			sortedTransitions = sorted(selectedTransitions,key=lambda t : t.documentOrder)	#implicitly converts unordered set to ordered list

			logging.info("executing transitition actions")
			for transition in sortedTransitions:
				logging.info("transitition " + str(transition))
				for action in transition.actions:
					self._evaluateAction(action,eventsToAddToInnerQueue) 		

			logging.info("executing state enter actions")
			for state in statesEntered:
				logging.info("entering " + str(state))
				for action in state.enterActions:
					self._evaluateAction(action,eventsToAddToInnerQueue)

			#update configuration by removing basic states exited, and adding basic states entered
			logging.info("updating configuration ")
			logging.info("old configuration " + str(self._configuration))

			self._configuration = (self._configuration - basicStatesExited) | basicStatesEntered

			logging.info("new configuration " + str(self._configuration))
			
			#add set of generated events to the innerEventQueue -> Event Lifelines: Next small-step
			if eventsToAddToInnerQueue:
				logging.info("adding triggered events to inner queue " + str(eventsToAddToInnerQueue))

				self._innerEventQueue.append(eventsToAddToInnerQueue)

			#update the datamodel
			logging.info("updating datamodel for next small step :")
			for key in self._datamodelForNextStep:
				logging.info("key " + str(key)) 
				if key in self._datamodel:
					logging.info("old value " + str(self._datamodel[key]))
				else:
					logging.info("old value is None")
				logging.info("new value " + str(self._datamodelForNextStep[key])) 
					
				self._datamodel[key] = self._datamodelForNextStep[key]

			#clear the datamodel for the next small step
			self._datamodelForNextStep = {}

		#if selectedTransitions is empty, we have reached a stable state, and the big-step will stop, otherwise will continue -> Maximality: Take-Many
		return selectedTransitions 	

	def _evaluateAction(self,action,eventsToAddToInnerQueue):
		if isinstance(action,SendAction):
			#TODO: support timeout, data
			eventsToAddToInnerQueue.add(Event(action.eventName))
		elif isinstance(action,AssignAction):
			self._datamodelForNextStep[action.location] = self.evaluator.evaluateExpr(action.expr,
							self._getScriptingInterface())
		elif isinstance(action,ScriptAction):
			self.evaluator.evaluateScript(action.code,self._getScriptingInterface(True))

	def _getStatesExited(self,transitions):
		statesExited = set()
		basicStatesExited = set()

		for transition in transitions:
			lca = transition.getLCA()
			desc = lca.getDescendants()
		
			for state in self._configuration:
				if state in desc:
					basicStatesExited.add(state) 
					statesExited.add(state)
					for anc in state.getAncestors(lca):
						statesExited.add(anc)

		sortedStatesExited = sorted(statesExited,key=lambda s : s.getDepth(),reverse=True) 

		return basicStatesExited,sortedStatesExited  

	def _getStatesEntered(self,transitions):
		statesToRecursivelyAdd = sum([[state for state in transition.targets] for transition in transitions],[])
		print "statesToRecursivelyAdd :" , statesToRecursivelyAdd 
		root = transition.getLCA() 
		statesToEnter = set()
		basicStatesToEnter = set()

		while statesToRecursivelyAdd: 

			for state in statesToRecursivelyAdd:
				self._recursiveAddStatesToEnter(state,statesToEnter,basicStatesToEnter)
			
			statesToRecursivelyAdd = self._getChildrenOfParallelStatesWithoutDescendantsInStatesToEnter(statesToEnter)

		sortedStatesEntered = sorted(statesToEnter,key=lambda s : s.getDepth()) 

		return basicStatesToEnter,sortedStatesEntered   

	def _getChildrenOfParallelStatesWithoutDescendantsInStatesToEnter(self,statesToEnter):
		childrenOfParallelStatesWithoutDescendantsInStatesToEnter = set()

		#get all descendants of states to enter
		descendantsOfStatesToEnter = set()
		for state in statesToEnter:
			for descendant in state.getDescendants():
				descendantsOfStatesToEnter.add(descendant)

		for state in statesToEnter:
			if state.kind is State.PARALLEL:
				for child in state.children:
					if child not in descendantsOfStatesToEnter:
						childrenOfParallelStatesWithoutDescendantsInStatesToEnter.add(child)  

		return childrenOfParallelStatesWithoutDescendantsInStatesToEnter
			

	def _recursiveAddStatesToEnter(self,s,statesToEnter,basicStatesToEnter):
		if s.kind is State.HISTORY:
			if s in self._historyValue:
				for historyState in self._historyValue[s]:
					self._recursiveAddStatesToEnter(historyState,statesToEnter,basicStatesToEnter)
			else:
				statesToEnter.add(s)
				basicStatesToEnter.add(s)
		else:
			statesToEnter.add(s)

			if s.kind is State.PARALLEL:
				for child in s.children:
					if not child.kind is State.HISTORY:		#don't enter history by default
						self._recursiveAddStatesToEnter(child,statesToEnter,basicStatesToEnter)

			elif s.kind is State.COMPOSITE:

				#FIXME: problem: this doesn't check cond of initial state transitions
				#also doesn't check priority of transitions (problem in the SCXML spec?)
				#TODO: come up with test case that shows other is broken
				#what we need to do here: select transitions...
				#for now, make simplifying assumption. later on check cond, then throw into the parameterized choose by priority
				self._recursiveAddStatesToEnter(s.initial,statesToEnter,basicStatesToEnter)

			elif s.kind is State.INITIAL or s.kind is State.BASIC or s.kind is State.FINAL:
				basicStatesToEnter.add(s)
			else:
				pass	#error: bad model - unknown state type

		
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
				if (t.event is None or t.event in eventNames) and (t.cond is None or self.evaluator.evaluateExpr(t.cond,self._getScriptingInterface())):
					print "adding transition t to selected transitions"
					transitions.add(t)

		return transitions 

	def _getScriptingInterface(self,writeData=False):
		#we recreate this each time in order to enforce the semantics of the memory model (next small-step). 
		#this clears all keys (global variables) that were set in the previous small-step
		api = {
			"getData" : lambda name : self._datamodel[name],
			"In" : self.isIn
		}

		def setData(name,value):
			self._datamodelForNextStep[name] = value

		if writeData:
			api["setData"] = setData

		return api

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
		return not self._isArenaOrthogonal(t1,t2) 	
	
	def _isArenaOrthogonal(self,t1,t2):
		return t1.getLCA().isOrthogonalTo(t2.getLCA())
	
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

	def __init__(self,model,evaluatorDict=defaultEvaluatorDict,setTimeout=None):
		self.setTimeout = setTimeout
		SCXMLInterpreter.__init__(self,model,evaluatorDict)
		
	def _evaluateAction(self,action,eventsToAddToInnerQueue):
		if isinstance(action,SendAction) and action.timeout:
			if self.setTimeout:
				self.setTimeout(lambda : self(Event(action.eventName)),action.timeout)
			else:
				raise Exception("setTimeout function not set")
		else:
			SCXMLInterpreter._evaluateAction(self,action,eventsToAddToInnerQueue)

	#External Event Communication: Asynchronous
	def __call__(self,e):	
		#pass it straight through	
		logging.info("received event " + str(e))
		self._performBigStep(e)

