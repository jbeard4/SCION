#this class attempts provide simple emulation of the browser's setTimeout mechanism
define ->
	class SimpleEnv
		constructor : (@timeouts=[],@timeoutCounter=-1,@countToTimeoutMap={}) ->

		setTimeout : (callback,timeout) =>

			timeoutTuple = [new Date,timeout,callback]

			@timeouts.push(timeoutTuple)

			@timeoutCounter = @timeoutCounter + 1
			@countToTimeoutMap[@timeoutCounter] = timeoutTuple

			return @timeoutCounter

		clearTimeout : (timeoutId) =>
			timeoutTuple = @countToTimeoutMap[timeoutId]

			if timeoutTuple in @timeouts
				@timeouts = (timeout for timeout in @timeouts when not (timeout is timeoutTuple))
				delete @countToTimeoutMap[timeoutId]

		_checkTimeouts : ->
			now = new Date
			triggeredTimeouts  = (timeout for timeout in @timeouts when (now - timeout[0]) >= timeout[1])

			for [start,timeout,callback] in triggeredTimeouts
				callback()

			@timeouts = (timeout for timeout in @timeouts when timeout not in triggeredTimeouts)

		mainLoop : ->
			while true
				@_checkTimeouts()
