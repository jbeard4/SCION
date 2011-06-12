#todo: requirejs build script as well

csdir = src/main/coffeescript

.PHONY : clean coffee copy-others scion

clean:
	rm -rf build

build :
	if [ ! -d build/scxml/test/ ]; then mkdir -p build/scxml/test/; fi

coffee : build 
	#fixme: is there a smarter way to do this than iterating over each directory?
	#something like `find $(csdir) -name *.coffee`, and then map the names
	coffee -o build/scxml $(csdir)/scxml/*.coffee
	coffee -o build/scxml/test $(csdir)/scxml/test/*.coffee
	

copy-others : build
	cp -r lib/js/ build/lib/
	cp -r src/main/javascript/* build/
	cp -r src/main/xslt build/

scion : copy-others coffee
