# Copyright (C) 2011 Jacob Beard
# Released under GNU LGPL, read the file 'COPYING' for more information

#it would be nice if this could auto-configure itself. oh well...
define ["text!xslt/normalizeInitialStates.xsl","text!xslt/scxmlToJSON.xsl","lib/json2"],(normalizeInitialStatesText,scxmlToJSONText) ->
	(scxmlDoc,xml,xsl) ->
		normalizeInitialStatesDoc = xml.parseFromString normalizeInitialStatesText
		scxmlToJSONDoc = xml.parseFromString scxmlToJSONText
		normalizedDoc = xsl(scxmlDoc,normalizeInitialStatesDoc,{},"xml")
		jsonText = xsl(normalizedDoc,scxmlToJSONDoc,{},"text")
		JSON.parse jsonText
