define
	wrapLine : (p,self=this,appendNewline=true) -> (o) -> p.call self,"#{JSON.stringify o}#{if appendNewline then '\n' else ''}"
