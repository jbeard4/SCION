This module is the top-level git repository for the SCION SCXML System (SCION). SCION provides a complete system for developing with SCXML. All submodule that are part of SCION are in `projects/{devtools,examples,libraries}` directories as git submodules. 

This package (`scion`) is published to npm so that the bundled modules can be consumed and published by cdnjs for use in the browser. The bundled modules are in the `dist/` directory: 

core (Statecharts interpreter):

* core.js
* core.js.map
* core.min.js

scxml (SCXML compiler and runtime):

* scxml.js
* scxml.min.js
* scxml.debug.js (SCXML compiler with sourcemaps enabled)

schviz (visualization):

* dist/schviz.js
* dist/schviz.js.map
* dist/schviz.min.js
* dist/schviz.min.js.map

If you are using SCION in Node.js, you should use npm to install specific packages (e.g. `@scion-scxml/core`, `@scion-scxml/scxml`, `@scion-scxml/schviz`, etc.) rather than installing this module. 

For more information on specific modules that are published as a part of SCION, please check each individual project's README.

For more information on the SCION project, please visit [scion.scxml.io](https://scion.scxml.io).
