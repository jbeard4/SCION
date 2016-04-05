js = $(shell find lib/ -name "*.js")

all : dist/scxml.js dist/scxml.min.js

dist/scxml.js : $(js)
	browserify -u optimist -o dist/scxml.js -s scxml -e lib/runtime/platform-bootstrap/node/index.js

dist/scxml.min.js : dist/scxml.js
	uglifyjs dist/scxml.js > dist/scxml.min.js

get-deps : 
	npm install -g browserify uglifyjs 

clean :
	rm dist/*

.PHONY : get-deps all clean
