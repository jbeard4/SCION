js = lib/scion.js \
	lib/core/util/annotate-scxml-json.js \
	lib/core/scxml/SCXML.js \
	lib/core/scxml/default-transition-selector.js \
	lib/core/scxml/state-kinds-enum.js \
	lib/core/scxml/setup-default-opts.js \
	lib/core/scxml/model.js \
	lib/core/scxml/scxml-dynamic-name-match-transition-selector.js \
	lib/core/scxml/json2model.js \
	lib/core/scxml/set/ArraySet.js

scion-browser.js : $(js) 
	node lib/browser/build/stitch.js 

scion-browser-min.js : scion-browser.js
	uglifyjs scion-browser.js > scion-browser-min.js

clean : 
	rm scion-browser.js scion-browser-min.js

.PHONY : clean
