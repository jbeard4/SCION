#   Copyright 2011-2012 Jacob Beard, INFICON, and other SCION contributors
#
#   Licensed under the Apache License, Version 2.0 (the "License");
#   you may not use this file except in compliance with the License.
#   You may obtain a copy of the License at
#
#       http://www.apache.org/licenses/LICENSE-2.0
#
#   Unless required by applicable law or agreed to in writing, software
#   distributed under the License is distributed on an "AS IS" BASIS,
#   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#   See the License for the specific language governing permissions and
#   limitations under the License.

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
