build = build
csdir = src/main/coffeescript
coffee := $(shell find $(csdir) -name "*.coffee")
coffeejs = $(patsubst $(csdir)/%.coffee,$(build)/%.js, $(coffee))

#TODO: generate these conditionally so we can compare the overhead induced by this version
extraModelXSLArgs = --param genDepth "true()" --param genAncestors "true()" --param genDescendants "true()" --param genLCA "true()"

testdir = src/test
buildtestdir = $(build)/test
scxmltests := $(shell find $(testdir) -name "*.scxml")
scxmljson = $(patsubst $(testdir)/%.scxml,$(buildtestdir)/%.scxml.json, $(scxmltests))

scxmljsontuple = $(patsubst $(testdir)/%.scxml,$(buildtestdir)/%.js, $(scxmltests))

#optimization variables
buildopt = $(build)/opt
tsel = $(buildopt)/transition-selection

tsel_class = $(patsubst $(buildtestdir)/%.scxml.json,$(tsel)/%.class.js, $(scxmljson))
tsel_switch = $(patsubst $(buildtestdir)/%.scxml.json,$(tsel)/%.switch.js, $(scxmljson))
tsel_table = $(patsubst $(buildtestdir)/%.scxml.json,$(tsel)/%.table.js, $(scxmljson))

spartanLoader = $(build)/spartanLoaderForAllTests.js

#paths to some scripts
scxmltojson = src/main/bash/util/scxml-to-json.sh
generatetesttuple = src/main/bash/build/generate-requirejs-json-test-tuples.sh
generatetestloadermodule = src/main/bash/build/generate-requirejs-test-loader-module.sh


.PHONY: clean coffee scxml2json copy-others combine-json-and-scxml-tests gen-spartan-loader gen-class-transition-lookup-optimization gen-table-transition-lookup-optimization gen-switch-transition-lookup-optimization gen-transition-lookup-optimization gen-state-configuration-set-optimization gen-transition-configuration-set-optimization gen-model-caching-optimization gen-transformed-statecharts gen-ahead-of-time-optimizations gen-top-level-optimized-requirejs-modules 

clean:
	rm -rf $(build)

build:
	mkdir $(build)

coffee : $(coffeejs)

$(build)/%.js : $(csdir)/%.coffee
	coffee -o $(dir $@) $<

scxml2json : $(scxmljson)

$(buildtestdir)/%.scxml.json : $(testdir)/%.scxml
	mkdir -p $(dir $@)
	$(scxmltojson) $< $(extraModelXSLArgs) > $@

copy-others : build
	cp -r lib/js/ $(build)/lib/
	cp -r src/main/javascript/* $(build)
	cp -r src/main/xslt $(build)

combine-json-and-scxml-tests : $(scxmljsontuple) 

$(buildtestdir)/%.js : $(buildtestdir)/%.scxml.json $(testdir)/%.json
	$(generatetesttuple) $^ > $@

gen-spartan-loader : $(spartanLoader)

$(spartanLoader) : 
	$(generatetestloadermodule) $@ $(scxmljsontuple)


$(tsel)/%.class.js : $(buildtestdir)/%.scxml.json coffee copy-others
	mkdir -p $(dir $@)
	./bin/run-module-node.sh scxml/optimization/transition-optimizer $< class true true > $@

$(tsel)/%.switch.js : $(buildtestdir)/%.scxml.json coffee copy-others
	mkdir -p $(dir $@)
	./bin/run-module-node.sh scxml/optimization/transition-optimizer $< switch true true > $@

$(tsel)/%.table.js : $(buildtestdir)/%.scxml.json coffee copy-others
	mkdir -p $(dir $@)
	./bin/run-module-node.sh scxml/optimization/transition-optimizer $< table true true > $@

gen-class-transition-lookup-optimization : $(tsel_class)
gen-table-transition-lookup-optimization : $(tsel_table)
gen-switch-transition-lookup-optimization : $(tsel_switch)

$(build)/class-transition-lookup-optimization-loader.js : 
	$(generatetestloadermodule) $@ $(tsel_class)
	
$(build)/table-transition-lookup-optimization-loader.js : 
	$(generatetestloadermodule) $@ $(tsel_table)

$(build)/switch-transition-lookup-optimization-loader.js : 
	$(generatetestloadermodule) $@ $(tsel_switch)

gen-optimization-loaders : $(build)/class-transition-lookup-optimization-loader.js $(build)/table-transition-lookup-optimization-loader.js $(build)/switch-transition-lookup-optimization-loader.js

gen-transition-lookup-optimization : gen-class-transition-lookup-optimization gen-table-transition-lookup-optimization gen-switch-transition-lookup-optimization

gen-state-configuration-set-optimization : 
	#bit-vector-set
	#binary-array-set

gen-transition-configuration-set-optimization : 
	#bit-vector-set
	#binary-array-set

gen-model-caching-optimization : 

gen-transformed-statecharts : 
	#flatten transitions
	#flatten orthogonal states

gen-ahead-of-time-optimizations : gen-transformed-statecharts gen-model-caching-optimization gen-transition-configuration-set-optimization gen-transition-lookup-optimization

gen-top-level-optimized-requirejs-modules : gen-ahead-of-time-optimizations
	#call script to make the module

scion : copy-others coffee

all-tests : $(scxmljsontuple)

all : all-tests scion gen-top-level-optimized-requirejs-modules gen-transition-lookup-optimization gen-optimization-loaders gen-spartan-loader
