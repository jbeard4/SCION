define ['events'],(events) ->

	class BufferedEventEmitter extends events.EventEmitter

		constructor : (emitter,ev='data',encoding='utf8',delimiter='\n') ->
			emitter.setEncoding encoding

			data = ""

			emitter.on ev,(s) =>
				console.log "received string: #{s}"
				data += s

				lineOrientedData = data.split delimiter
				lines = lineOrientedData[0...-1]
				data = lineOrientedData.pop()

				console.log "lines",lines

				@emit "line",line for line in lines
