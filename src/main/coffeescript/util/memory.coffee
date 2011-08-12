define ['fs'],(fs) ->
	getMemory : (pid) ->
		s = fs.readFileSync("/proc/#{pid}/status",'utf8')
		rssTuple = s.split('\n')[14].split(/\s+/)
		if not (rssTuple[0] is 'VmRSS:')
			#console.error "Received something weird from /proc/#{pid}/status"
			#console.error s
			return 0
		else
			return parseInt rssTuple[1]
