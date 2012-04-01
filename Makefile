js = lib/scion.js lib/util/browser \
	lib/util/browser/parsePage.js \
	lib/util/annotate-scxml-json.js \
	lib/util/underscore-wrapper.js \
	lib/scxml/SCXML.js \
	lib/scxml/default-transition-selector.js \
	lib/scxml/state-kinds-enum.js \
	lib/scxml/setup-default-opts.js \
	lib/scxml/model.js \
	lib/scxml/scxml-dynamic-name-match-transition-selector.js \
	lib/scxml/json2model.js \
	lib/scxml/set/ArraySet.js

scion.js : $(js) 
	node build-lib/stitch.js 

scion-min.js : scion.js
	uglifyjs scion.js > scion-min.js

clean : 
	rm scion.js scion-min.js

.PHONY : clean
