#set up evaluator

moduleName = "scxml.evaluators"
className = "PythonEvaluator"
_tmp = __import__(moduleName,globals(),locals(),[className],-1)
evaluator = _tmp.__dict__[className]()

print evaluator 
