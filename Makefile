js = $(shell find lib/ -name "*.js")

dist/scxml.js : $(js)
	babel --presets es2015 -s --out-dir dist/es5/ lib/
	browserify -d -s scxml dist/es5/runtime/facade.js -o dist/scxml.js

dist/scxml.min.js :	dist/scxml.js
	uglifyjs -o dist/scxml.min.js dist/scxml.js

build : dist/scxml.js dist/scxml.min.js 

get-deps : 
	npm install

clean :
	rm -rf dist/*

.PHONY : clean get-deps build 
