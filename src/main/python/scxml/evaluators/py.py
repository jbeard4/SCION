# Copyright (C) 2011 Jacob Beard
# Released under GNU LGPL, read the file 'COPYING' for more information

import code #TODO: explore best ways to import this conditionally (only need it when model received has "python" profile)

from scxml.evaluators.interface import IEvaluator

class PythonEvaluator(IEvaluator):

	def evaluateExpr(self,expr,api):
		interpreter = code.InteractiveInterpreter(api)
		expr = "_ = " + expr
		interpreter.runsource(expr)
		result = api["_"] 
		return result

	def evaluateScript(self,script,api):
		interpreter = code.InteractiveInterpreter(api)
		interpreter.runsource(script)


