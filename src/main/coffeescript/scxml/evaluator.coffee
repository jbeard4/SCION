# Copyright (C) 2011 Jacob Beard
# Released under GNU LGPL, read the file 'COPYING' for more information

#this module exists to provde a restricted environment for evaluating ecmascript
#code in a js module. we want to restrict the API as much as possible. 
#Unforuntately, it would still be be possible for the evaling code to set
#variables in the global scope, and do various evil things with that. Ideally,
#we would run a sandboxed interpreter, as is done in the python implementation.
#We could possible change the API to use a with statement, which would be more 
#concise, but might negatively affect performance.

#coffeescript does not have a "with" keyword, so we escape it and use javascript
define -> `function(code,getData,setData,In,_events,datamodel){ with(datamodel){ return eval(code); }}`

