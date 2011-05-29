import sys, json
from scxml.doc2model import scxmlFileToPythonModel
from scxml.event import Event
from scxml.SCXML import SimpleInterpreter
import os
import traceback
import pdb

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
		interpreter = SimpleInterpreter(model) 

		interpreter.start() 
		initialConfiguration = interpreter.getConfiguration()

		expectedInitialConfiguration = set(test["initialConfiguration"])

		if expectedInitialConfiguration != initialConfiguration:
			raise SCXMLConfigurationException(expectedInitialConfiguration,initialConfiguration)

		for eventPair in test["events"]:
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
