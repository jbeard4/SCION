#!/bin/bash
# Copyright (C) 2011 Jacob Beard
# Released under GNU LGPL, read the file 'COPYING' for more information


cat <<-EndOfFile
define({
	"scxmlJson" : `cat $1`,
	"testScript" : `cat $2`,
	"name" : "$3",
	"group" : "$4"
}) 
EndOfFile
