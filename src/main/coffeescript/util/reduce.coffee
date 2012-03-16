#adapted from https:#developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/Reduce
define ->
    (arr,fun,initial) ->
        if arr.reduce
            if initial then arr.reduce(fun,initial) else arr.reduce(fun)
        else
            len = arr.length
            if typeof fun isnt "function"
                throw new TypeError()

            # no value to return if no initial value and an empty array
            if len is 0 and arguments.length is 2
                throw new TypeError()

            i = 0
            if arguments.length >= 3
                rv = arguments[2]
            
            else
                while true
                    if arr[i]
                        rv = arr[i++]
                        break

                    # if array contains no values, no initial value to return
                    if ++i >= len
                        throw new TypeError()
                
            while i < len
                if i in arr
                    rv = fun.call(undefined, rv, arr[i], i, arr)
                i++

            return rv
