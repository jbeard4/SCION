# Copyright (C) 2011 Jacob Beard
# Released under GNU LGPL, read the file 'COPYING' for more information

define
	wrapLine : (p,self=this,appendNewline=true) -> (o) -> p.call self,"#{JSON.stringify o}#{if appendNewline then '\n' else ''}"
	
	#does shallow copy of properites of object from to object to
	merge : (from,to) ->
		for own k,v of from
			to[k] = v
		return to
