"""
The SimpleInterpreter class is only safe to be used in a single-threaded
environment. It is still possible to send events with delays in such
environments, but the environment is responsible for monitoring when events
must be sent to statechart, probably by checking the timers in its mainloop.
This is an example of a minimal environment that performs this function.
Assumes timeouts are specified in milliseconds.
Another example can be found in the python test harness. 
"""

import time

timeouts = set()

def setTimeout(callback,timeout):
    timeouts.add((time.time(),timeout,callback))

while True:
    #see if any timeouts have been triggered
    now = time.time()
    triggeredTimeouts = set(filter(lambda (start,timeout,callback) : ((now - start) * 1000) >= timeout, timeouts))

    for (start,timeout,callback) in triggeredTimeouts:
        callback()

    timeouts = timeouts - triggeredTimeouts 

