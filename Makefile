js = $(shell find lib/ -name "*.js")


scion-browser.js : $(js) 
	node lib/browser/build/stitch.js 

scion-browser-min.js : scion-browser.js
	uglifyjs scion-browser.js > scion-browser-min.js

clean : 
	rm scion-browser.js scion-browser-min.js

.PHONY : clean
