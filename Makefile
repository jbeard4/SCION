#todo: requirejs build script as well

csdir = src/main/coffeescript

.PHONY : clean coffee copy-others scxml-tests-to-json tests-to-json-tuples scion generate-requirejs-test-loader-module

clean:
	rm -rf build

build :
	if [ ! -d build/scxml/test/ ]; then mkdir -p build/scxml/test/; mkdir -p build/test; fi;

coffee : build 
	#fixme: is there a smarter way to do this than iterating over each directory?
	#something like `find $(csdir) -name *.coffee`, and then map the names
	coffee -o build/scxml $(csdir)/scxml/*.coffee
	coffee -o build/scxml/test $(csdir)/scxml/test/*.coffee
	

copy-others : build
	cp -r lib/js/ build/lib/
	cp -r src/main/javascript/* build/
	cp -r src/main/xslt build/

scxml-tests-to-json : build
	sh src/main/bash/build/convert-scxml-tests-to-json.sh

tests-to-json-tuples : build
	sh src/main/bash/build/generate-requirejs-json-test-tuples.sh

generate-requirejs-test-loader-module : tests-to-json-tuples
	sh src/main/bash/build/generate-requirejs-test-loader-module.sh

scion : copy-others coffee
