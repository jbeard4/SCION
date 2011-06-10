import sys, json
from scxml.event import Event
from scxml.SCXML import SimpleInterpreter
import os
import traceback
import pdb
import time

testCount = 0
testsPassed = []
testsFailed = []
testsErrored = []

modelParserOptions = {
	"dom" : 0,
	"xslt+json" : 1
}

#TODO: we should accept a command-line option to allow this to be configurable. for now, we just set a global variable to allow this to be configurable
modelParser = modelParserOptions["xslt+json"]

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


	f = open(jsonTestFileName)
	test = json.load(f)

	try:

		print "running test",test["name"]

		jsonTestFileDir = os.path.dirname(jsonTestFileName)
		pathToSCXML = os.path.join(jsonTestFileDir,test["scxml"])

		scxmlFile = file(pathToSCXML)
		if modelParser is modelParserOptions["dom"]:
			from scxml.doc2model import scxmlFileToPythonModel
			model = scxmlFileToPythonModel(scxmlFile) 
		elif modelParser is modelParserOptions["xslt+json"]:
			from scxml.json2model import scxmlFileToPythonModel
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
		testsPassed.append(test)
	except SCXMLConfigurationException as inst:
		print inst
		testsFailed.append(test)
	except:
		print "Error:"
		e, m, tb = sys.exc_info()
		print e
		print m
		traceback.print_tb(tb)
		pdb.post_mortem(tb)
		testsErrored.append(test)

print "Summary:"
print "Tests Run:", testCount
print "Tests Passed:", len(testsPassed),[test["name"] for test in testsPassed]
print "Tests Failed:", len(testsFailed),[test["name"] for test in testsFailed]
print "Tests Errored:", len(testsErrored),[test["name"] for test in testsErrored]

sys.exit(len(testsPassed) == testCount)
