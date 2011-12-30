#variable declarations
#sources
coffescript-dir = src/main/coffeescript
test-dir = src/test

#targets
build = build
core = $(build)/core
release = $(build)/release
browser-release = $(release)/browser
npm-release = $(release)/npm
tests = $(build)/tests
optimizations = $(tests)/optimizations
loaders = $(tests)/loaders
flattened-tests = $(tests)/flattened
hier-tests = $(tests)/hier

#this should be overridden when doing actual releases
release-number = 0.0.1
#release stuff
module-name = scion
browser-release-module = $(browser-release)/$(module-name)-$(release-number).js
#TODO: this isn't used yet
npm-release-module = $(npm-release)/$(module-name)-$(release-number).tgz

#these modules are significant for building other components, such as tests, etc.
#TODO: use coffescript src names for these, and go through macro to convert them. More DRY
annotate-scxml-json-module = $(core)/util/annotate-scxml-json.js
runner-module = $(core)/runner.js
beautify-module = $(lib)/beautify.js
initializer-optimization-module = $(core)/scxml/optimization/initializer.js
class-optimization-module = $(core)/scxml/optimization/class.js
table-optimization-module = $(core)/scxml/optimization/state-table.js
switch-optimization-module = $(core)/scxml/optimization/switch.js

#compile coffeescript
coffeescript-src = $(shell find $(coffescript-dir))
built-javascript-core = $(patsubst $(coffescript-dir)/%.coffee,$(core)/%.js, $(coffeescript-src))
$(core)/%.js : $(coffescript-dir)/%.coffee
	mkdir -p $(dir $@)
	coffee -o $(dir $@) $<

#copy over lib/js/*
lib-src = lib/js
lib-js-src = $(shell find $(lib-src)/*)
lib = $(core)/lib
lib-core = $(patsubst $(lib-src)/%,$(core)/lib/%, $(lib-js-src))

$(lib)/% : $(lib-src)/%
	mkdir -p $(dir $@)
	cp $< $@

#build browser release module
$(browser-release-module) : $(built-javascript-core) $(lib-core)
	mkdir -p $(dir $@)
	r.js -o name=util/browser/parseOnLoad out=$(browser-release-module) baseUrl=$(core)

#generate tests
scxml-test-src = $(shell find $(test-dir) -name "*.scxml")
json-test-src = $(patsubst %.scxml,%.json,$(scxml-test-src))

#generate json from scxml
scxml-json-dir = $(tests)/scxml-json
scxml-json-tests = $(patsubst $(test-dir)/%.scxml, $(scxml-json-dir)/%.json, $(scxml-test-src)) 
$(scxml-json-dir)/%.json : $(test-dir)/%.scxml
	mkdir -p $(dir $@)
	./src/main/bash/util/scxml-to-json.sh $< > $@

#annotate it

annotated-scxml-json-dir = $(tests)/annotated-scxml-json
annotated-scxml-json-tests = $(patsubst $(scxml-json-dir)/%.json,$(annotated-scxml-json-dir)/%.json,$(scxml-json-tests)) 
$(annotated-scxml-json-dir)/%.json : $(tests)/scxml-json/%.json $(annotate-scxml-json-module) $(runner-module)
	mkdir -p $(dir $@)
	./bin/run-module-node.sh util/annotate-scxml-json $< $@

#annotated-scxml-json-tests : $(annotated-scxml-json-tests)

#combine it with the json test script
#in this task, $^ are all the dependencies, second arg is the test name, third arg is the test group name
combined-script-and-annotated-scxml-json-dir = $(tests)/combined-script-and-annotated-scxml-json-test
combined-script-and-annotated-scxml-json-test = $(patsubst $(annotated-scxml-json-dir)/%.json,$(combined-script-and-annotated-scxml-json-dir)/%.js,$(annotated-scxml-json-tests)) 
$(combined-script-and-annotated-scxml-json-dir)/%.js : $(annotated-scxml-json-dir)/%.json $(test-dir)/%.json
	mkdir -p $(dir $@)
	./src/main/bash/build/generate-requirejs-json-test-tuples.sh $^ "$(basename $(notdir $<))" "$(notdir $(shell dirname $<))" > $@

#generate spartan loader
generate-test-loader-module-script = src/main/bash/build/generate-requirejs-test-loader-module.sh
$(loaders)/spartan-loader-for-all-tests.js :
	mkdir -p $(dir $@)
	$(generate-test-loader-module-script) $@ $(combined-script-and-annotated-scxml-json-test)

#generate optimizations
transition-selector = $(optimizations)/transition-selector

#class, switch, and table transition selectors
class-transition-selector = $(patsubst $(annotated-scxml-json-dir)/%.json,$(transition-selector)/%.class.js,$(annotated-scxml-json-tests))
switch-transition-selector = $(patsubst $(annotated-scxml-json-dir)/%.json,$(transition-selector)/%.switch.js,$(annotated-scxml-json-tests))
table-transition-selector = $(patsubst $(annotated-scxml-json-dir)/%.json,$(transition-selector)/%.table.js,$(annotated-scxml-json-tests))

$(transition-selector)/%.class.js : $(annotated-scxml-json-dir)/%.json $(runner-module) $(beautify-module) $(initializer-optimization-module) $(class-optimization-module)
	mkdir -p $(dir $@)
	./bin/run-module-node.sh scxml/optimization/transition-optimizer $< class true true > $@

$(transition-selector)/%.switch.js : $(annotated-scxml-json-dir)/%.json $(runner-module) $(beautify-module) $(initializer-optimization-module) $(switch-optimization-module)
	mkdir -p $(dir $@)
	./bin/run-module-node.sh scxml/optimization/transition-optimizer $< switch true true > $@

$(transition-selector)/%.table.js : $(annotated-scxml-json-dir)/%.json $(runner-module) $(beautify-module) $(initializer-optimization-module) $(table-optimization-module)
	mkdir -p $(dir $@)
	./bin/run-module-node.sh scxml/optimization/transition-optimizer $< table true true > $@


generate-array-test-loader-module-script = src/main/bash/build/generate-requirejs-array-test-loader-module.sh

#generate optimization loader modules
$(loaders)/class-transition-lookup-optimization-loader.js : 
	mkdir -p $(dir $@)
	$(generate-test-loader-module-script) $@ $(class-transition-selector)
	
$(loaders)/table-transition-lookup-optimization-loader.js : 
	mkdir -p $(dir $@)
	$(generate-test-loader-module-script) $@ $(table-transition-selector)

$(loaders)/switch-transition-lookup-optimization-loader.js : 
	mkdir -p $(dir $@)
	$(generate-test-loader-module-script) $@ $(switch-transition-selector)

$(loaders)/class-transition-lookup-optimization-array-loader.js : 
	mkdir -p $(dir $@)
	$(generate-array-test-loader-module-script) $@ $(class-transition-selector)
	
$(loaders)/table-transition-lookup-optimization-array-loader.js : 
	mkdir -p $(dir $@)
	$(generate-array-test-loader-module-script) $@ $(table-transition-selector)

$(loaders)/switch-transition-lookup-optimization-array-loader.js : 
	mkdir -p $(dir $@)
	$(generate-array-test-loader-module-script) $@ $(switch-transition-selector)


#top-level tasks
#TODO: node module
#TODO: flattened test modules
#TODO: all test modules

all : interpreter browser-release tests test-loader optimizations optimization-loaders 

#interpreter
interpreter : $(built-javascript-core) $(lib-core)

#amd module
browser-release : $(browser-release-module)

#test modules
tests : $(combined-script-and-annotated-scxml-json-test)

#test-loader	(with/without flattened test modules)
test-loader : $(loaders)/spartan-loader-for-all-tests.js

#optimizations
optimizations : $(class-transition-selector) $(table-transition-selector) $(switch-transition-selector) 

#optimization-loaders	(with/without flattened test modules)
optimization-loaders : $(loaders)/class-transition-lookup-optimization-loader.js $(loaders)/table-transition-lookup-optimization-loader.js $(loaders)/switch-transition-lookup-optimization-loader.js $(loaders)/class-transition-lookup-optimization-array-loader.js $(loaders)/table-transition-lookup-optimization-array-loader.js $(loaders)/switch-transition-lookup-optimization-array-loader.js

get-deps :
	npm install -g coffee requirejs


foo : 
	echo $(class-transition-selector)

clean : 
	rm -rf $(build)


.PHONY : interpreter-core browser-build tests optimzations test-loader optimization-loaders get-deps clean foo


