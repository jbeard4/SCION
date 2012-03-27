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

#this module exists to provde a restricted environment for evaluating ecmascript
#code in a js module. we want to restrict the API as much as possible. 
#Unforuntately, it would still be be possible for the evaling code to set
#variables in the global scope, and do various evil things with that. Ideally,
#we would run a sandboxed interpreter, as is done in the python implementation.
#We could possible change the API to use a with statement, which would be more 
#concise, but might negatively affect performance.

#coffeescript does not have a "with" keyword, so we escape it and use javascript
define -> `function(code,getData,setData,In,_events,datamodel){ with(datamodel){ return eval(code); }}`

