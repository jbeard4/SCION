define
	wrapLine : (p,self=this,appendNewline=true) -> (o) -> p.call self,"#{JSON.stringify o}#{if appendNewline then '\n' else ''}"
	
	#does shallow copy of properites of object from to object to
	merge : (from,to) ->
		for own k,v of from
			to[k] = v
		return to
