# Overview

The scion-core-legacy module is a drop-in replacement for the
scion-core module.

Versions of scion-core before 2.x implemented a slightly different semantics,
described (here)[] and (here)[]. A comparison of differences between these two
semantics can be found (here)[].  These semantics have now been deprecated in favor
of the official SCXML semantics described in Appendix D of the specification.
However, if you require support for scion-core semantics before 2.x, the
scion-core-legacy module provides an interpreter that implements these legacy
semantics. 
