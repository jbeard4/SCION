# Overview

The scion-core-legacy module is a drop-in replacement for the
scion-core module.

Versions of scion-core before 2.x implemented a slightly different semantics,
described
[here](http://digitool.library.mcgill.ca/R/-?func=dbin-jump-full&object_id=116899&silo_library=GEN01)
and [here](https://github.com/jbeard4/SCION/wiki/Scion-Semantics).  These
semantics have now been deprecated in favor of the official SCXML semantics
described in Appendix D of the specification. A comparison of differences
between these two semantics can be found
[here](https://github.com/jbeard4/SCION/wiki/SCION-vs.-SCXML-Comparison).

If you require support for scion-core semantics before 2.x, the this
module provides an interpreter that implements these legacy semantics. 
