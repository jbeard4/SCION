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

define ->
    transitionToVarLabel : (transition) -> "$#{transition.id}"

    genOuterInitializerStr : (scxmlJson,innerFnStr) ->
        toReturn =  """
                function(transitions,eventMap){
                    var 
                """

        for i in [0...scxmlJson.transitions.length]
            toReturn += "#{@transitionToVarLabel scxmlJson.transitions[i]} = transitions[#{i}]#{if i < (scxmlJson.transitions.length-1) then ',' else ''}"

        toReturn += ";\n"
                
        toReturn += """
                    #{innerFnStr}
                };
                """

    transitionFilterString :    """
                    //filter transitions based on condition
                    var toReturn = [];
                    for(var i=0; i < transitions.length; i++){
                        var transition = transitions[i];
                        if(!transition.cond || evaluator(transition)){
                            toReturn.push(transition);
                        }
                    }
                    return toReturn;
                    """

    arrayToIdentifierListString : (transitions) ->
        toReturn = "["

        #you get the idea here. these strings will show up as identifiers in the generated code
        #the identifiers get set up in the outer context (from genOuterInitializerStr), and captured via closure in the inner context
        for i in [0...transitions.length]
            transitionLabel = transitions[i]
            toReturn += transitionLabel
            if i < transitions.length - 1
                toReturn += ","

        toReturn += "]"

