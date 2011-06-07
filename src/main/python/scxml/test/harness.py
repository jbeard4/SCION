import sys, json
from scxml.doc2model import scxmlFileToPythonModel
from scxml.event import Event
from scxml.SCXML import SimpleInterpreter
import os
import traceback
import pdb
import time

testCount = 0
testsPassed = 0
testsFailed = 0
testsErrored = 0

class SCXMLConfigurationException(Exception):
	def __init__(self,expected,actual):
		self.expected = expected
		self.actual = actual

	def __str__(self):
		return "Configuration error: expected " + str(self.expected) + ", received " + str(self.actual)

#methods and data structures for managing timeouts in the test script and initiated by the statechart
#FIXME: a list might actually be better... but it's up to the environment to decide how to manage this
timeouts = set()
timeoutCounter = -1
countToTimeoutMap = {}

def setTimeout(callback,timeout):
	global timeouts,timeoutCounter

	timeoutTuple = (time.time(),timeout,callback)

	timeouts.add(timeoutTuple)

	timeoutCounter = timeoutCounter + 1
	countToTimeoutMap[timeoutCounter] = timeoutTuple  

	return timeoutCounter 

def clearTimeout(timeoutId):
	global timeouts
	timeoutTuple = countToTimeoutMap[timeoutId]

	if timeoutTuple in timeouts:
		timeouts.remove(timeoutTuple)
		del countToTimeoutMap[timeoutId]

def checkTimeouts():
	global timeouts 
	now = time.time()
	triggeredTimeouts = set(filter(lambda (start,timeout,callback) : ((now - start) * 1000) >= timeout, timeouts))

	for (start,timeout,callback) in triggeredTimeouts:
		callback()

	timeouts = timeouts - triggeredTimeouts 

for jsonTestFileName in sys.argv[1:]:

	testCount = testCount + 1

	try:

		f = open(jsonTestFileName)
		test = json.load(f)

		print "running test",test["name"]

		jsonTestFileDir = os.path.dirname(jsonTestFileName)
		pathToSCXML = os.path.join(jsonTestFileDir,test["scxml"])

		scxmlFile = file(pathToSCXML)
		model = scxmlFileToPythonModel(scxmlFile) 
		interpreter = SimpleInterpreter(model,setTimeout=setTimeout,clearTimeout=clearTimeout) 

		interpreter.start() 
		initialConfiguration = interpreter.getConfiguration()

		checkTimeouts()

		expectedInitialConfiguration = set(test["initialConfiguration"])

		if expectedInitialConfiguration != initialConfiguration:
			raise SCXMLConfigurationException(expectedInitialConfiguration,initialConfiguration)

		for eventPair in test["events"]:
			timerStart = time.time()
			timeout = eventPair["after"] if "after" in eventPair else 0

			checkTimeouts()
			now = time.time()

			#busy-wait 
			while (now - timerStart) * 1000 < timeout: 
				checkTimeouts()
				now = time.time()
			
			interpreter(Event(eventPair["event"]["name"]))
			nextConfiguration = interpreter.getConfiguration()
			
			expectedNextConfiguration = set(eventPair["nextConfiguration"])
			if expectedNextConfiguration != nextConfiguration:
				raise SCXMLConfigurationException(expectedNextConfiguration,nextConfiguration)

		print test["name"], "...passes"
		testsPassed  = testsPassed + 1
	except SCXMLConfigurationException as inst:
		print inst
		testsFailed = testsFailed + 1
	except:
		print "Error:"
		e, m, tb = sys.exc_info()
		print e
		print m
		traceback.print_tb(tb)
		pdb.post_mortem(tb)
		testsErrored = testsErrored + 1

print "Summary:"
print "Tests Run:", testCount
print "Tests Passed:", testsPassed
print "Tests Failed:", testsFailed
print "Tests Errored:", testsErrored

sys.exit(testsPassed == testCount)
