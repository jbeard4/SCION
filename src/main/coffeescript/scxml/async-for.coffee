define ->
	step = (list,doCallback,doneCallback,errBack,failBack) ->
		nextStep = -> step list,doCallback,doneCallback,errBack,failBack	#step with args curried
		l = list.shift()
		console.log "l",l
		if l
			doCallback l,nextStep,errBack,failBack
		else
			doneCallback()
