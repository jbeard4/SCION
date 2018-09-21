# SCION sourcemap-plugin

This module adds support for generating source maps to the SCION compiler. This
enables a visual JavaScript debugger, like Chrome DevTools or VSCode, to read
the sourcemap, set breakpoints in the SCXML source file, and inspect the SCXML
datamodel. This works in Node.js and the Browser. 

You can enable it like this:

```
const scxml = require('@scion-scxml/scxml');
require('@scion-scxml/sourcemap-plugin')(scxml);  //load the sourcemaps plugin
```

Here is a video of this module in action:

[![Link to video](https://img.youtube.com/vi/Pg9tYuJN6BI/0.jpg)](https://www.youtube.com/watch?v=Pg9tYuJN6BI)
