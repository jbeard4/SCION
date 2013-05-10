all : dist/scion-min.js

dist/scion-min.js : 
	java -jar ~/Downloads/compiler.jar  --js_output_file dist/scion.min.js --compilation_level ADVANCED_OPTIMIZATIONS --js lib/scion.js 

clean : 
	rm -rf dist

.PHONY : clean all
