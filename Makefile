js = lib/core/scion.js \
	lib/core/util/annotate-scxml-json.js \
	lib/core/scxml/SCXML.js \
	lib/core/scxml/default-transition-selector.js \
	lib/core/scxml/state-kinds-enum.js \
	lib/core/scxml/setup-default-opts.js \
	lib/core/scxml/model.js \
	lib/core/scxml/scxml-dynamic-name-match-transition-selector.js \
	lib/core/scxml/json2model.js \
	lib/core/scxml/set/ArraySet.js

scion.js : $(js) 
	node lib/build/stitch.js 

scion-min.js : scion.js
	uglifyjs scion.js > scion-min.js

clean : 
	rm scion.js scion-min.js

.PHONY : clean
