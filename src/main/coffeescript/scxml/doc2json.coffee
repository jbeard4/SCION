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

#it would be nice if this could auto-configure itself. oh well...
define ["text!xslt/normalizeInitialStates.xsl","text!xslt/scxmlToJSON.xsl","lib/json2"],(normalizeInitialStatesText,scxmlToJSONText) ->
    (scxmlDoc,xml,xsl) ->
        normalizeInitialStatesDoc = xml.parseFromString normalizeInitialStatesText
        scxmlToJSONDoc = xml.parseFromString scxmlToJSONText
        normalizedDoc = xsl(scxmlDoc,normalizeInitialStatesDoc,{},"xml")
        jsonText = xsl(normalizedDoc,scxmlToJSONDoc,{},"text")
        JSON.parse jsonText
