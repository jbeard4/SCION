import sys
import pdb

sys.path.append("src/python/")

from scxml.doc2model import scxmlFileToPythonModel
from scxml.event import Event
from scxml.SCXML import SimpleInterpreter

try: 
	pathToSCXML = sys.argv[1]
	print pathToSCXML 
	scxmlFile = file(pathToSCXML)
	model = scxmlFileToPythonModel(scxmlFile) 
	interpreter = SimpleInterpreter(model) 
	interpreter.start() 
except:
	e, m, tb = sys.exc_info()
	print e
	print m
	print tb
	pdb.post_mortem(tb)
