# Copyright (C) 2011 Jacob Beard
# Released under GNU LGPL, read the file 'COPYING' for more information

define ->
	if ((typeof readline) is 'undefined') and not ((typeof Packages) is 'undefined')
		do ->
			#closure around stdin
			stdin = new Packages.java.io.BufferedReader(
					new Packages.java.io.InputStreamReader(Packages.java.lang.System.in))

			-> if (s = stdin.readLine()) is null then quit(true) else String(s)
	else
		#every other interpreters we test should have a readline function on the global object
		this.readline
