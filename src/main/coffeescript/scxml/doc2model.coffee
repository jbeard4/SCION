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

define ["scxml/model","logger"],(model,logger) ->
    #local imports
    SCXMLModel = model.SCXMLModel
    State = model.State
    Transition = model.Transition
    SendAction = model.SendAction
    CancelAction = model.CancelAction
    LogAction = model.LogAction
    AssignAction = model.AssignAction
    ScriptAction = model.ScriptAction

    scxmlNS = "http//www.w3.org/2005/07/scxml"

    stateTagNames = ["initial","parallel","final","history","state"]

    class UnsupportedProfileException extends Error

    supportedProfiles = ["ecmascript"]

    walk = (root,fn) ->
        q = [root]
        count = 0
        while q.length
            do ->
                u = q.shift()
                fn u,count
                count = count + 1

                for childNode in u.childNodes when childNode.setAttribute
                    q.push childNode

    attr = (node,attrName) -> String(node.getAttributeNS(null,attrName))

    id = (elt) -> attr(elt,"id")

    scxmlDocToPythonModel = (doc) ->
        
        #normalize root id
        root = doc.documentElement

        if attr(root,"name") and not attr(root,"id")
            root.setAttributeNS(null,"id",attr(root,"name"))

        profile = attr(root,"profile") or "python"
        if String(profile) not in supportedProfiles
            throw new UnsupportedProfileException("Profile not supported")

        #because doc.getElementById cannot be trusted, we keep track of id-to-element mapping ourself
        idToNodeMap = {}

        initializeIdToNodeMap = (elt) ->
            eltId = id(elt)
            if eltId then idToNodeMap[eltId] = elt

        walk root,initializeIdToNodeMap

        #normalize initial attributes
        normalizeInitialAttributes = (elt) ->
            if attr(elt,"initial")
                newInitial = doc.createElementNS scxmlNS,"initial"
                newTransition = doc.createElementNS scxmlNS,"transition"
                newTransition.setAttributeNS null,"target",attr(elt,"initial")
                newInitial.appendChild newTransition
                elt.appendChild newInitial

        logger.trace "normalizing initial attributes..."
        walk root,normalizeInitialAttributes
        logger.trace "done"

        localNameToPreviousCount = {}

        generateNewId = (idToNodeMap,element) ->
            name = element.localName
            count = localNameToPreviousCount[name] or -1

            count++

            newId = name + count

            logger.trace "newId",newId
            while newId of idToNodeMap
                count++
                newId = name + count
                logger.trace "newId",newId

            localNameToPreviousCount[name] = count

            return newId



        normalizeIds = (elt) ->
            if not id(elt)
                newId = generateNewId idToNodeMap,elt
                logger.trace "setting new id ",newId," for elt ",elt.node
                elt.setAttributeNS null,"id",newId
            #update idToNodeMap on the fly
            idToNodeMap[id(elt)] = elt


        logger.trace "normalizing node ids..."
        walk root,normalizeIds
        logger.trace "done"

        #logger.trace "normalized doc"
        #logger.trace xml.serializeToString doc.doc

        eltIdToObj = {}
            
        generateNodeToObjMap = (elt,order) ->
            eltId = id(elt)

            switch elt.localName
                when "state"
                    if (childNode for childNode in elt.childNodes when childNode.setAttribute and childNode.localName in stateTagNames).length
                        eltIdToObj[eltId] = new State(eltId,State.COMPOSITE,order)
                    else
                        eltIdToObj[eltId] = new State(eltId,State.BASIC,order)
                when "scxml"
                    eltIdToObj[eltId] = new State(eltId,State.COMPOSITE,order)
                when "initial"
                    eltIdToObj[eltId] = new State(eltId,State.INITIAL,order)
                when "parallel"
                    eltIdToObj[eltId] = new State(eltId,State.PARALLEL,order)
                when "final"
                    eltIdToObj[eltId] = new State(eltId,State.FINAL,order)
                when "history"
                    isDeep = attr(elt,"type") == "deep"

                    eltIdToObj[eltId] = new State(eltId,State.HISTORY,order,isDeep)
                when "transition"
                    event = attr(elt,"event") or null
                    cond = attr(elt,"cond") or null
                    
                    eltIdToObj[eltId] = new Transition(eltId,event,order,cond)
                when "send"
                    delay = getDelayInMs(elt)
                    sendid = attr(elt,"id") or null
                    contentExpr = attr(elt,"contentexpr") or null #TODO put contentexpr into its own namespace?
                    eltIdToObj[eltId] = new SendAction(attr(elt,"event"),delay,sendid,contentExpr)
                when "log"
                    eltIdToObj[eltId] = new LogAction(attr(elt,"expr"))
                when "cancel"
                    eltIdToObj[eltId] = new CancelAction(attr(elt,"sendid"))
                when "assign"
                    eltIdToObj[eltId] = new AssignAction(attr(elt,"location"),attr(elt,"expr"))
                when "script"
                    eltIdToObj[eltId] = new ScriptAction(elt.textContent)

        logger.trace "generating nodeToObjMap..."
        walk root,generateNodeToObjMap
        logger.trace "done..."

        #second pass
        #print "constructing model - starting second pass"
        for own eltId,obj of eltIdToObj

            elt = idToNodeMap[eltId]

            if obj instanceof State
                #link to parent
                p = elt.parentNode
                if p and not ( p is elt.ownerDocument ) and eltIdToObj[id(p)]
                    parentObj = eltIdToObj[id(p)]
                    #print "make",parentObj,"parent of",obj
                    obj.parent = parentObj

                for childNode in elt.childNodes when childNode.setAttribute
                    #transition children
                    #may fall into the next case, for initial state
                    if childNode.localName in stateTagNames
                        childObj = eltIdToObj[id(childNode)]
                        #print "make",childObj,"child of",obj 
                        obj.children.push(childObj)

                    switch childNode.localName
                        when "initial"
                            obj.initial = eltIdToObj[id(childNode)]
                        when "history"
                            obj.history = eltIdToObj[id(childNode)]
                        #entry and exit actions
                        when "onentry"
                            for actionNode in childNode.childNodes when actionNode.setAttribute
                                obj.enterActions.push(eltIdToObj[id(actionNode)])
                        when "onexit"
                            for actionNode in childNode.childNodes when actionNode.setAttribute
                                obj.exitActions.push(eltIdToObj[id(actionNode)])

            else if obj instanceof Transition
                #hook up transition actions
                for childNode in elt.childNodes when childNode.setAttribute
                    childObj = eltIdToObj[id(childNode)]
                    obj.actions.push(childObj)

                #hook up transition source
                obj.source = eltIdToObj[ id(elt.parentNode) ]

                obj.source.transitions.push(obj)

                #hook up transition target
                obj.targets = (eltIdToObj[targetId] for targetId in attr(elt,"target").split(" "))

        #print "constructing model - finished second pass"
            
        #hook up the initial state
        rootState = eltIdToObj[id(root)]
        #logger.trace "rootState",rootState

        #instantiate and return the model
        model = new SCXMLModel rootState,profile

        return model

    getDelayInMs = (sendElt) ->
        delayString = attr(sendElt,"delay")

        if not delayString
            return 0
        else
            if delayString[-2..] == "ms"
                return parseFloat(delayString[..-3])
            else if delayString[-1..] == "s"
                return parseFloat(delayString[..-2]) * 1000
            else
                #assume milliseconds
                return parseFloat(delayString)

    return scxmlDocToPythonModel    #expose the API

