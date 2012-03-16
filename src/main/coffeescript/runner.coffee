#This module exists to serve as a generic frontend to run other AMD modules.
#This allows all other modules to be written generically - able to accept
#string arguments from the command line, as well as to be imported by other amd
#modules. I do not believe this woul dbe possible if the alternative strategy
#were used, where each AMD module to be executed on the command line was
#declared using require() rather than define().
require ['env!env/args','logger'],(args,logger) ->
    args = args[1..]    #slice off the first arg, which is the name of this file

    #TODO: maybe flip these so that basedir is optional? or check if basedir option is specified?
    basedir = args[0]
    mainFunction = args[1]

    moduleArguments = args[2..]

    #bootstrap require.js
    require(
        {
            baseUrl : basedir,
            paths : {
                "tests" : "../tests"    #for running tests
            }
        },
        [mainFunction],
        (fn) ->
            if typeof fn isnt "function"
                logger.error("Unable to find module " + mainFunction)
                return 1
            else
                return fn.apply(this,moduleArguments)
    )
