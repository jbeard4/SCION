# Copyright (C) 2011 Jacob Beard
# Released under GNU LGPL, read the file 'COPYING' for more information

define ['child_process'],(child_process) ->
	spawn = child_process.spawn

	resetEvent = "grave"

	clientProcesses = []

	defaultDisplayNum = ":1"

	sshEventPipeCache = {}

	runSshCmd = (commandOpt) ->
		console.error "issuing command:"
		console.error "ssh",commandOpt
		p = spawn "ssh",commandOpt

		p.stdout.setEncoding 'utf8'
		p.stderr.setEncoding 'utf8'

		p.stdout.on "data",(str) ->
			console.error "from command ssh #{commandOpt} : #{str}"
			
		p.stderr.on "data",(str) ->
			console.error "from command ssh #{commandOpt} : #{str}"

		return p

	sendCommandThroughCachedPipe = (o,address,projectSrcDir,displayNum) ->
		sshEventPipe =
			(sshEventPipeCache[address] ?=
				runSshCmd [address,"DISPLAY=#{displayNum}","coffee","#{projectSrcDir}/src/main/coffeescript/scxml/test/multi-process-browser/send-events.coffee"])

		sshEventPipe.stdin.write ((JSON.stringify o) + '\n')	#write the newline character, because the buffer is line-oriented


	sendEventsToBrowser : (address,events,projectSrcDir,displayNum=defaultDisplayNum) -> sendCommandThroughCachedPipe {method:"send-events",events:events},address,projectSrcDir,displayNum

	sendResetEventToClient : (address,projectSrcDir,displayNum=defaultDisplayNum) -> sendCommandThroughCachedPipe {method:"reset"},address,projectSrcDir,displayNum

	startClient : (forwardX11,address,serverUrl,xserver,windowManager,browser,displayNum=defaultDisplayNum) ->
		sshOpts = if forwardX11 then ['-X','-Y','-C'] else []
		commandOpts = [
			sshOpts.concat [address,xserver,displayNum]
			[address,"DISPLAY=#{displayNum}",windowManager]
			[address,"DISPLAY=#{displayNum}",browser,serverUrl]
		]

		p0 = runSshCmd commandOpts[0]
		setTimeout ( ->
			p1 = runSshCmd commandOpts[1]
			setTimeout ( ->
				p2 = runSshCmd commandOpts[2]
				clientProcesses.push p0,p1,p2
			),1000
		),1000

	killClientProcesses : ->
		p.kill() while p = clientProcesses.pop()
		pipe.stdin.end() for address,pipe of sshEventPipeCache

