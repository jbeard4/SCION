import sys, json
from scxml.doc2model import scxmlFileToPythonModel
from scxml.event import Event
from scxml.SCXML import SimpleInterpreter
import os

testCount = 0
testsPassed = 0
testsFailed = 0
testsErrored = 0

for jsonTestFileName in sys.argv[1:]:

	testCount = testCount + 1

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

	assert set(test["initialConfiguration"]) == initialConfiguration 

	for eventPair in test["events"]:
		interpreter(Event(eventPair["event"]["name"]))
		nextConfiguration = interpreter.getConfiguration()
		
		assert set(eventPair["nextConfiguration"]) == nextConfiguration

	print test["name"], "...passes"
	testsPassed  = testsPassed + 1

print "Summary:"
print "Tests Run:", testCount
print "Tests Passed:", testsPassed
print "Tests Failed:", testsFailed
print "Tests Errored:", testsErrored

sys.exit(testsPassed == testCount)
