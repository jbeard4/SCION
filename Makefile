build = build
csdir = src/main/coffeescript
coffee := $(shell find $(csdir) -name "*.coffee")
coffeejs = $(patsubst $(csdir)/%.coffee,$(build)/%.js, $(coffee))

#TODO: generate these conditionally so we can compare the overhead induced by this version
extraModelXSLArgs = --param genDepth "true()" --param genAncestors "true()" --param genDescendants "true()" --param genLCA "true()"

testdir = src/test
buildtestdir = $(build)/test
scxmltests := $(shell find $(testdir) -name "*.scxml")
nonTransformedScxmlJson = $(patsubst $(testdir)/%.scxml,$(buildtestdir)/%.scxml.json, $(scxmltests))

buildtransformdir = $(build)/transform
buildFlattenedTransitionsDir = $(buildtransformdir)/flattened-transitions
flattenedSCXMLTests = $(patsubst $(testdir)/%.scxml,$(buildFlattenedTransitionsDir)/%.scxml, $(scxmltests))

flattenedTransitionsSCXMLJson = $(patsubst $(buildFlattenedTransitionsDir)/%.scxml,$(buildtestdir)/%.flattened-transitions.scxml.json, $(flattenedSCXMLTests))

#all scxmljson files (both flattened and non-flattened)
scxmljson = $(sort $(nonTransformedScxmlJson)  $(flattenedTransitionsSCXMLJson)) 

annotated_scxml_json = $(patsubst $(buildtestdir)/%.scxml.json,$(buildtestdir)/%.annotated.scxml.json, $(scxmljson)) 

scxmljsontuple = $(patsubst $(buildtestdir)/%.annotated.scxml.json,$(buildtestdir)/%.js, $(annotated_scxml_json))

#optimization variables
buildopt = $(build)/opt
tsel = $(buildopt)/transition-selection

tsel_class = $(patsubst $(buildtestdir)/%.scxml.json,$(tsel)/%.class.js, $(scxmljson))
tsel_switch = $(patsubst $(buildtestdir)/%.scxml.json,$(tsel)/%.switch.js, $(scxmljson))
tsel_table = $(patsubst $(buildtestdir)/%.scxml.json,$(tsel)/%.table.js, $(scxmljson))

spartanLoader = $(build)/spartanLoaderForAllTests.js

#paths to some scripts
scxmltojson = src/main/bash/util/scxml-to-json.sh
annotateScxmlJson = bin/run-module-node.sh util/annotate-scxml-json
generatetesttuple = src/main/bash/build/generate-requirejs-json-test-tuples.sh
generatetestloadermodule = src/main/bash/build/generate-requirejs-test-loader-module.sh
generateArrayTestLoaderModule = src/main/bash/build/generate-requirejs-array-test-loader-module.sh


.PHONY: clean coffee scxml2json copy-others combine-json-and-scxml-tests gen-spartan-loader gen-class-transition-lookup-optimization gen-table-transition-lookup-optimization gen-switch-transition-lookup-optimization gen-transition-lookup-optimization gen-state-configuration-set-optimization gen-transition-configuration-set-optimization gen-model-caching-optimization gen-transformed-statecharts gen-ahead-of-time-optimizations gen-top-level-optimized-requirejs-modules annotated-json

coffee : $(coffeejs)

all : all-tests scion gen-top-level-optimized-requirejs-modules gen-transition-lookup-optimization gen-optimization-loaders gen-optimization-array-loaders gen-spartan-loader

clean:
	rm -rf $(build)

build:
	mkdir $(build)


$(build)/%.js : $(csdir)/%.coffee
	coffee -o $(dir $@) $<

flatten-transitions-scxml-tests: $(flattenedSCXMLTests)

$(buildFlattenedTransitionsDir)/%.scxml : $(testdir)/%.scxml
	mkdir -p $(dir $@)
	xsltproc src/main/xslt/flattenTransitions.xsl $< > $@

scxml2json : $(scxmljson)

$(buildtestdir)/%.flattened-transitions.scxml.json : $(buildFlattenedTransitionsDir)/%.scxml 
	mkdir -p $(dir $@)
	$(scxmltojson) $< > $@

$(buildtestdir)/%.scxml.json : $(testdir)/%.scxml 
	mkdir -p $(dir $@)
	$(scxmltojson) $< > $@

copy-others : build
	cp -r lib/js/ $(build)/lib/
	cp -r src/main/javascript/* $(build)
	cp -r src/main/xslt $(build)

annotated-json : $(annotated_scxml_json)

combine-json-and-scxml-tests : $(scxmljsontuple) 

$(buildtestdir)/%.flattened-transitions.annotated.scxml.json : $(buildtestdir)/%.flattened-transitions.scxml.json coffee
	$(annotateScxmlJson) $< $@

$(buildtestdir)/%.annotated.scxml.json : $(buildtestdir)/%.scxml.json coffee
	$(annotateScxmlJson) $< $@

$(buildtestdir)/%.flattened-transitions.js : $(buildtestdir)/%.flattened-transitions.annotated.scxml.json $(testdir)/%.json
	$(generatetesttuple) $^ "$(basename $(basename $(basename $(notdir $<))))" "$(shell basename $(shell dirname $<))" > $@

$(buildtestdir)/%.js : $(buildtestdir)/%.annotated.scxml.json $(testdir)/%.json
	$(generatetesttuple) $^ "$(basename $(basename $(basename $(notdir $<))))" "$(shell basename $(shell dirname $<))" > $@

gen-spartan-loader : $(spartanLoader)

$(spartanLoader) : 
	$(generatetestloadermodule) $@ $(scxmljsontuple)


$(tsel)/%.class.js : $(buildtestdir)/%.annotated.scxml.json coffee copy-others
	mkdir -p $(dir $@)
	./bin/run-module-node.sh scxml/optimization/transition-optimizer $< class true true > $@

$(tsel)/%.switch.js : $(buildtestdir)/%.annotated.scxml.json coffee copy-others
	mkdir -p $(dir $@)
	./bin/run-module-node.sh scxml/optimization/transition-optimizer $< switch true true > $@

$(tsel)/%.table.js : $(buildtestdir)/%.annotated.scxml.json coffee copy-others
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

$(build)/class-transition-lookup-optimization-array-loader.js : 
	$(generateArrayTestLoaderModule) $@ $(tsel_class)
	
$(build)/table-transition-lookup-optimization-array-loader.js : 
	$(generateArrayTestLoaderModule) $@ $(tsel_table)

$(build)/switch-transition-lookup-optimization-array-loader.js : 
	$(generateArrayTestLoaderModule) $@ $(tsel_switch)

gen-optimization-array-loaders : $(build)/switch-transition-lookup-optimization-array-loader.js $(build)/table-transition-lookup-optimization-array-loader.js  $(build)/class-transition-lookup-optimization-array-loader.js 

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
