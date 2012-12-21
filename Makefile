js = $(shell find lib/ -name "*.js")

dist/scion.js : $(js) 
	mkdir -p dist && node lib/browser/build/stitch.js dist/scion.js

dist/scion-min.js : dist/scion.js
	uglifyjs dist/scion.js > dist/scion-min.js

clean : 
	rm -rf dist

.PHONY : clean
