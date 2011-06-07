from Queue import Queue		#this is a synchronized Queue. needed in the thread-safe implementation
import thread
import time
import SCXMLInterpreter from SCXML

class ThreadsafeInterpreter(SCXMLInterpreter):

	def __init__(self):
		self._externalEventQueue = Queue();

		SCXMLInterpreter.__init__(self)

	#External Event Communication: Asynchronous
	def __call__(self,e):
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
