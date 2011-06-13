#todo: requirejs build script as well

csdir = src/main/coffeescript

.PHONY : clean coffee copy-others scion

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
	for i in src/test/*; do \
		x=`basename $$i`; \
		mkdir build/test/$$x; \
		for scxmlFile in $$i/*.scxml; do \
			y=`basename $$scxmlFile`; \
			echo converting $$scxmlFile to json at "build/test/$$x/$$y.js"; \
			./bin/scxml-to-json.sh $$scxmlFile --param wrapInAsyncModuleDefinition "true()" > build/test/$$x/$$y.js; \
		done; \
	done

scion : copy-others coffee
