# Copyright (C) 2011 Jacob Beard
# Released under GNU LGPL, read the file 'COPYING' for more information

define ->
	step = (list,doCallback,doneCallback,errBack,failBack) ->
		nextStep = -> step list,doCallback,doneCallback,errBack,failBack	#step with args curried
		l = list.shift()
		if not (l is undefined)
			doCallback l,nextStep,errBack,failBack
		else
			doneCallback()
