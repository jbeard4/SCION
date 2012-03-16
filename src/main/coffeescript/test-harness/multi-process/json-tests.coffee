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

define ["tests/loaders/spartan-loader-for-all-tests", "tests/loaders/class-transition-lookup-optimization-array-loader", "tests/loaders/switch-transition-lookup-optimization-array-loader", "tests/loaders/table-transition-lookup-optimization-array-loader",'util/utils'],(testTuples,classTransitionOpts,switchTransitionOpts,tableTransitionOpts,utils) ->


    testName = (test) -> "(#{test.name}/#{test.group}[#{test.transitionSelector.selectorKey};#{test.set.setTypeKey};#{test.extraModelInfo}])"

    #set up optimizations
    #TODO: when we have other optimizations, this is where their initialization will also go
    #we filter delayedSend tests as well, as they can be tricky to test in a distributed context
    jsonTests = []
    for i in [0...testTuples.length] when testTuples[i].group isnt "delayedSend"

        transitionSelectors =
            "default-transition-lookup" : "scxml/default-transition-selector"
            "class-transition-lookup" : classTransitionOpts[i]
            "switch-transition-lookup" : switchTransitionOpts[i]
            "table-transition-lookup" : tableTransitionOpts[i]

        setTypes =
            bitVector : "util/set/BitVector"
            boolArray : "util/set/BooleanArray"
            objectSet : "util/set/ObjectSet"
            arraySet : "util/set/ArraySet"

        
        extraModelInfo = [false]

        for selectorKey,selector of transitionSelectors
            for setTypeKey,setTypeVal of setTypes
                for info in extraModelInfo
                    test =
                        utils.merge testTuples[i],
                            transitionSelector :
                                selectorKey : selectorKey
                                selector : selector
                            set :
                                setTypeKey : setTypeKey
                                setType : setTypeVal
                            extraModelInfo : info

                    test.id = testName test

                    jsonTests.push test
                    
    return jsonTests
