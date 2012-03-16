define ["scxml/event","scxml/SCXML","scxml/json2model","test/basic/basic1","logger"],(Event,scxml,json2model,basicTest,defaultTransitionSelector,ArraySet,m,logger) ->
    ->

        NodeInterpreter = scxml.NodeInterpreter

        model = json2model basicTest.scxmlJson  #initialize model from json
        interpreter = new NodeInterpreter model #instantiate SC

        interpreter.start()
        initialConfiguration = interpreter.getConfiguration()

        logger.info initialConfiguration

        interpreter.gen(new Event("t"))
        nextConfiguration = interpreter.getConfiguration()
        logger.info nextConfiguration

