from scxml.evaluators.interface import IEvaluator

import spidermonkey

class ECMAScriptEvaluator(IEvaluator):

	def __init__(self):
		self.rt = spidermonkey.Runtime()

	def evaluateExpr(self,expr,api):
		cx = self.rt.new_context(api)
		v = cx.execute(expr)
		return v

	def evaluateScript(self,script,api):
		cx = self.rt.new_context(api)
		cx.execute(script)
