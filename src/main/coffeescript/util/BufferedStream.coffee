define ['events'],(events) ->

	class BufferedEventEmitter extends events.EventEmitter

		constructor : (emitter,ev='data',encoding='utf8',delimiter='\n') ->
			emitter.setEncoding encoding

			data = ""

			emitter.on ev,(s) =>
				#console.error "received string #{s}"
				data += s

				#console.error "new data #{data}"

				lineOrientedData = data.split delimiter
				lines = lineOrientedData[0...-1]
				data = lineOrientedData.pop()

				#console.error "lines #{JSON.stringify lines}"
				#console.error "updated data #{data}"

				@emit "line",line for line in lines
