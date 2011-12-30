(->
	if typeof process is "undefined"
		argOffset = 0

		#we are running under rhino - arguments are passed in on "arguments"
		args = Array.prototype.slice.call(arguments)

		this.console =
			log : this.print,
			info : this.print,
			error : this.print,
			debug : this.print
		
	else
		#we are running under node
		args = process.argv
		argOffset = 2
		if not this.console.debug
			this.console.debug = this.console.log
		

		fs = require("fs")

		#also, add a synchronous API for reading files
		this.readFile = (fileName) ->
			return fs.readFileSync(fileName,"utf8")
	

	if(args.length >= 3+argOffset)
		preparedArguments = args.slice(3+argOffset)

		basedir = args[1+argOffset]
		mainFunction = args[2+argOffset]

		#bootstrap require.js
		require(
			{
				baseUrl : basedir,
				paths : {
					"tests" : "../tests"
				}
			},
			[mainFunction],
			(fn) ->
				if(!fn)
					console.error("Unable to find module",mainFunction)
					return 1
				else
					return fn.apply(this,preparedArguments)
		)

	

).apply(this,if typeof arguments is "undefined" then [] else arguments)
