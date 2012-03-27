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

		mainLoop : =>
			while true
				@_checkTimeouts()
