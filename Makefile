all : dist/scion-min.js

dist/scion-min.js : 
	java -jar ~/Downloads/compiler.jar  --js_output_file dist/SCION-min.js --compilation_level ADVANCED_OPTIMIZATIONS --js lib/SCION.js 

clean : 
	rm -rf dist

.PHONY : clean all
