# Copyright (C) 2011 Jacob Beard
# Released under GNU LGPL, read the file 'COPYING' for more information

define ->
	class Event
		constructor: (@name="",@data) ->

		toString: -> @name
