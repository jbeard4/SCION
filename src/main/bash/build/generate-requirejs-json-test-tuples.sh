#!/bin/bash
cat <<-EndOfFile
define({
	"scxmlJson" : `cat $1`,
	"testScript" : `cat $2`,
	"name" : "$3",
	"group" : "$4"
}) 
EndOfFile
