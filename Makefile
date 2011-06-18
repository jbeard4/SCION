build = build
csdir = src/main/coffeescript
coffee := $(shell find $(csdir) -name "*.coffee")
coffeejs = $(patsubst $(csdir)/%.coffee,$(build)/%.js, $(coffee))

testdir = src/test
buildtestdir = $(build)/test
scxmltests := $(shell find $(testdir) -name "*.scxml")
scxmljson = $(patsubst $(testdir)/%.scxml,$(buildtestdir)/%.scxml.json, $(scxmltests))

scxmljsontuple = $(patsubst $(testdir)/%.scxml,$(buildtestdir)/%.js, $(scxmltests))

spartanLoader = $(build)/spartanLoaderForAllTests.js

#paths to some scripts
scxmltojson = src/main/bash/util/scxml-to-json.sh
generatetesttuple = src/main/bash/build/generate-requirejs-json-test-tuples.sh
generatetestloadermodule = src/main/bash/build/generate-requirejs-test-loader-module.sh


.PHONY: clean coffee scxml2json copy-others combine-json-and-scxml-tests spartanLoader

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
	$(scxmltojson) $< > $@

copy-others : build
	cp -r lib/js/ $(build)/lib/
	cp -r src/main/javascript/* $(build)
	cp -r src/main/xslt $(build)

combine-json-and-scxml-tests : $(scxmljsontuple) 

$(buildtestdir)/%.js : $(buildtestdir)/%.scxml.json $(testdir)/%.json
	$(generatetesttuple) $^ > $@

spartan-loader : $(spartanLoader)

$(spartanLoader) : $(scxmljsontuple)
	$(generatetestloadermodule) $@ $^

all : copy-others coffee

all-tests : spartan-loader

