import pkg_resources
import json
from StringIO import StringIO
from lxml import etree
from model import *
import code 


def scxmlFileToPythonModel(scxmlFile):
    #fetch xslt
    #transform to json
    #parse json
    #call jsonDocToPythonModel
    normalizeInitialStatesTemplate =    etree.XSLT(etree.parse(pkg_resources.resource_stream("scxml.xsl","normalizeInitialStates.xsl")))
    scxmlToJSONTemplate =           etree.XSLT(etree.parse(pkg_resources.resource_stream("scxml.xsl","scxmlToJSON.xsl")))

    scxmlDoc = etree.parse(scxmlFile)

    intermediateDoc = normalizeInitialStatesTemplate(scxmlDoc)
    #print str(intermediateDoc) 

    jsonStr = str(scxmlToJSONTemplate(intermediateDoc))
    f=open("tmp.json","w")
    f.write(jsonStr)
    f.close() 

    print jsonStr
    jsonDoc = json.load(StringIO(jsonStr))
    return jsonDocToPythonModel(jsonDoc)

def jsonFileToPythonModel(jsonFile):
    jsonDoc = json.load(jsonFile)
    return jsonDocToPythonModel(jsonDoc)

class UnsupportedProfileException(Exception):
    pass

supportedProfiles = ["ecmascript","python"]

parseActionMap = {
    "assign" : lambda a : AssignAction(a["location"],a["expr"]),
    "cancel" : lambda a : CancelAction(a["sendid"]),
    "send" : lambda a : SendAction(a["event"],getDelayInMs(a["delay"]) if "delay" in a else 0,a["id"] if "id" in a else None,a["contentexpr"] if "contentexpr" in a else None),
    "script" : lambda a : ScriptAction(a["script"]),
    "log" : lambda a : LogAction(a["expr"])
}

def parseAction(a):
    return parseActionMap[a["type"]](a)

#TODO: normalize document using XSLT
#right now we assume we're given a nice, normalized document
def jsonDocToPythonModel(json):
    
    mStates = {}

    for state in json["states"]:

        mTransitions = [Transition(t["event"] if "event" in t else None,t["documentOrder"],t["cond"] if "cond" in t else None,t["source"],t["target"],[parseAction(a) for a in t["contents"]]) for t in state["transitions"]]
        mEnterActions = [parseAction(a) for a in state["onentry"]]
        mExitActions = [parseAction(a) for a in state["onexit"]]

        mState = State(state["id"],state["kind"],state["documentOrder"],state["isDeep"] if "isDeep" in state else None)

        mState.transitions = mTransitions
        mState.enterActions = mEnterActions
        mState.exitActions = mExitActions

        mState.children = state["children"]

        

        if "initial" in state:
            mState.initial = state["initial"]
        if "history" in state:
            mState.history = state["history"]
        if "parent" in state:
            mState.parent = state["parent"]

        mStates[state["id"]] = mState

    #second pass to hook up references
    for id,mState in mStates.iteritems():
        if hasattr(mState, "initial") and mState.initial:
            mState.initial = mStates[mState.initial]

        if hasattr(mState, "history") and mState.history:
            mState.history = mStates[mState.history]

        mState.children = [mStates[stateId] for stateId in mState.children]

        if hasattr(mState, "parent") and mState.parent:
            mState.parent = mStates[mState.parent]

        for t in mState.transitions:
            t.source = mStates[t.source]
            t.targets = [mStates[stateId] for stateId in t.targets.split()]

    rootState = mStates[json["root"]]

    model = SCXMLModel(rootState,json["profile"])

    return model

#TODO: move this out
def getDelayInMs(delayString):
    if not delayString:
        return 0 
    else:
        if delayString[-2:] == "ms":
            return float(delayString[:-2])
        elif delayString[-1:] == "s":
            return float(delayString[:-1]) * 1000
        else:
            #assume milliseconds
            return float(delayString)


