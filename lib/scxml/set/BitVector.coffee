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

#this code based on a snippet found here: http://acc6.its.brooklyn.cuny.edu/~gurwitz/core5/nav2tool.html
decimalToBinary = (x) ->
    answer=[]
    x2 = x
    log2 = 0
    while(x2 >= 2)
        x2 = x2/2
        log2 = log2+1
     
    for l2 in [log2..0]
        power=Math.pow(2,l2)
        if ( x >= power)
            answer.push 1
            x = x-power
        else answer.push 0

    answer.join("")

defaultKeyProp="basicDocumentOrder"
defaultKeyValueMap=[]

class BitVectorSet
    constructor: (l=[],@keyProp=BitVectorSet.defaultKeyProp,@keyValueMap=BitVectorSet.defaultKeyValueMap) ->
        #TODO: deal with overflow, aggregate multiple ints
        #based on the length of the keyValueMap
        @o = 0

        #console.log "creating new BitVectorSet from list",l

        for x in l
            @add x

    hash:(x) ->
        Math.pow 2,x[@keyProp]

    add: (x) ->
        #console.log "x.id : #{x.id}"
        #console.log "keyValueMap : #{v.id for v in @keyValueMap}"
        #console.log "keyprop : #{@keyProp}"
        #console.log "x[keyprop] : #{x[@keyProp]}"
        #console.log "adding #{decimalToBinary @hash x} (#{@hash x})"
        #console.log "now: #{v.id for v in @iter()}"

        @o |= @hash x

    remove: (x) ->
        @o &= ~(@hash x)

    union: (l) ->
        if l instanceof BitVectorSet
            t = l.o
        else
            t = 0

            l = if l.iter then l.iter() else l

            for i in l
                t |= @hash i
        

        @o |= t

        return @

    difference: (l) ->
        if l instanceof BitVectorSet
            t = l.o
        else
            t = 0

            l = if l.iter then l.iter() else l

            for i in l
                t |= @hash i

        @o &= ~t

        return @

    contains: (x) -> @o & @hash x

    iter: ->
        toReturn = []
        t1 = @o
        i = 0
        while t1
            if t1 & 1
                if not @keyValueMap[i]
                    throw new Error("undefined value in keyvaluemap")
                toReturn.push @keyValueMap[i]

            t1 = t1 >>> 1
            i++

        return toReturn

    isEmpty : -> !!!@o

    equals : (s2) -> s2.o == @o

    toString : -> "Set(" + decimalToBinary(@o) + ")"


module.exports = BitVectorSet
