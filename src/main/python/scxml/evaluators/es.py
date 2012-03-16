#   Copyright 2011-2012 Jacob Beard, INFICON, and other SCION contributors
#
#   Licensed under the Apache License, Version 2.0 (the "License");
#   you may not use this file except in compliance with the License.
#   You may obtain a copy of the License at
#
#       http://www.apache.org/licenses/LICENSE-2.0
#
#   Unless required by applicable law or agreed to in writing, software
#   distributed under the License is distributed on an "AS IS" BASIS,
#   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#   See the License for the specific language governing permissions and
#   limitations under the License.

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
