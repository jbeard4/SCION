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

define ["scxml/json2model","scxml/json2extra-model"],(json2model,json2ExtraModel) ->

    (testJson,callback) ->

        mPath = if testJson.extraModelInfo then "scxml/model" else "scxml/extra-model"

        #console.debug "requiring",mPath,testJson.set.setType,testJson.transitionSelector.selector

        require [mPath,testJson.set.setType,testJson.transitionSelector.selector],(m,setConstructor,transitionSelector) ->

            #console.debug "imported depenedent modules",m.toString(),setConstructor.toString(),transitionSelector.toString()

            #parse scxmlJson model
            model = json2model testJson.scxmlJson

            transitionSelector = transitionSelector model.transitions,model.events

            flattenedTransitionsRE = /\.flattened-transitions$/

            onlySelectFromBasicStates =  testJson.transitionSelector.selectorKey is "class-transition-lookup" or testJson.name.match flattenedTransitionsRE

            #filter basic states the easy way
            basicStates = (state for state in model.states when not (state.basicDocumentOrder is undefined)).sort((s1,s2) -> s1.basicDocumentOrder - s2.basicDocumentOrder)
            
            setPurposes =
                transitions :
                    keyProp : "documentOrder"
                    keyValueMap : model.transitions
                    initializedSetClass : {}
                states :
                    keyProp : "documentOrder"
                    keyValueMap : model.states
                    initializedSetClass : {}
                basicStates :
                    keyProp : "basicDocumentOrder"
                    keyValueMap : basicStates
                    initializedSetClass : {}

            for purpose,info of setPurposes
                info.initializedSetClass =
                    switch testJson.set.setTypeKey
                        when "bitVector"
                            setConstructor info.keyProp,info.keyValueMap
                        when "boolArray"
                            setConstructor info.keyProp,info.keyValueMap.length
                        when "objectSet"
                            setConstructor info.keyProp
                        when "arraySet"
                            setConstructor


            optimizations =
                onlySelectFromBasicStates : onlySelectFromBasicStates
                TransitionSet : setPurposes.transitions.initializedSetClass
                StateSet : setPurposes.states.initializedSetClass
                BasicStateSet : setPurposes.basicStates.initializedSetClass
                transitionSelector : transitionSelector
                model : m

            callback if testJson.extraModelInfo then [m,model,optimizations] else [m,json2ExtraModel(model),optimizations]
