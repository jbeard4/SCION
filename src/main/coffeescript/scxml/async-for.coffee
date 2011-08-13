define ->
	step = (list,doCallback,doneCallback,errBack,failBack) ->
		nextStep = -> step list,doCallback,doneCallback,errBack,failBack	#step with args curried
		l = list.shift()
		if not (l is undefined)
			doCallback l,nextStep,errBack,failBack
		else
			doneCallback()
