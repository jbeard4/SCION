define ->
	step = (list,doCallback,doneCallback,errback) ->
		nextStep = -> step list,doCallback,doneCallback,errback		#step with args curried
		l = list.shift()
		console.log "l",l
		if l
			try
				doCallback l,nextStep
			catch e
				errback e,nextStep
			
		else
			doneCallback()
