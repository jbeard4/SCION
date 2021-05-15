---
title: SCION@4.3.1 Release Notes, Part 1
author: jacob-beard
date: 2018-06-26
template: article.jade
---

_tl;dr The first and main feature that was added to SCION@4.3.1 is full compliance with the [SCXML IRP test suite](https://www.w3.org/Voice/2013/scxml-irp/) (passes all of the required, automated tests)._

Notably, this includes support for SCXML's `<invoke>` tag; provides a compliant implementation of the "Algorithm for SCXML Interpretation" described in [Appendix D](https://www.w3.org/TR/scxml/#AlgorithmforSCXMLInterpretation) of the specification; and fixes [several](https://github.com/jbeard4/SCION-CORE/issues/28) [open](https://github.com/jbeard4/SCION/issues/390) [issues](https://github.com/jbeard4/SCION-CORE/issues/50).


There are many different semantics for Statecharts family of languages (for a
good overview of various Statechart semantics, see ["Big-Step Semantics"](https://cs.uwaterloo.ca/~nday/pdf/techreps/2009-05-EsDa-tr.pdf) by
Shahram Esmaeilsabzali, Nancy A. Day, Joanne M. Atlee, and Jianwei Niu).
SCION now implements by default the semantics described in [Appendix D of the SCXML specification](https://www.w3.org/TR/scxml/). This is a breaking change.

Versions of SCION@3.3.1 implements a slightly different semantics,
described
[here](https://github.com/jbeard4/SCION/wiki/SCION-vs.-SCXML-Comparison),
[here](https://github.com/jbeard4/SCION/wiki/Scion-Semantics), and 
[here](http://digitool.library.mcgill.ca/R/-?func=dbin-jump-full&object_id=116899&silo_library=GEN01). 
The semantics of SCION@3.3.1 have been deprecated in SCION@4.3.1 in favor
of the semantics described in Appendix D of the SCXML specification. 

If you are upgrading an existing application, and you require support for
SCION@3.3.1 semantics, the
[scion-core-legacy](https://github.com/jbeard4/scion-core-legac://github.com/jbeard4/scion-core-legacy)
module provides a backwards-compatible, drop-in replacement module.

Further documentation on the scion-core-legacy module will be forthcoming, but for now, you can find an example of its use [here](https://github.com/jbeard4/SCION/blob/v4.3.1/test/node-test-server.js#L14-L16), in the node-test-server. 

## Testing backwards-compatibility

This section describes the approach used by SCION for testing backwards-compatibility.

The SCION node.js test framework supports testing the backwards-compatibility mode. In terms of what is being tested, all the tests that were passing in SCION@3.3.1 also pass in SCION@4.3.1. In fact, SCION@4.3.1 includes _more_ tests for the legacy semantics than SCION@3.3.1 did:

```javascript
> const _ = require('underscore')
> undefined
> > const v431 = require('./4.3.1.json')    //4.3.1 tests
> undefined
> > const v331 = require('./3.3.1.json')    //3.3.1 tests
> _.difference(v431, v331)
[ 'node_modules/scxml-test-framework/test/actionSend/*.scxml',
  'node_modules/scxml-test-framework/test/assign-current-small-step/*.scxml',
  'node_modules/scxml-test-framework/test/assign/*.scxml',
  'node_modules/scxml-test-framework/test/atom3-basic-tests/*.scxml',
  'node_modules/scxml-test-framework/test/basic/*.scxml',
  'node_modules/scxml-test-framework/test/cond-js/*.scxml',
  'node_modules/scxml-test-framework/test/data/*.scxml',
  'node_modules/scxml-test-framework/test/default-initial-state/*.scxml',
  'node_modules/scxml-test-framework/test/delayedSend/*.scxml',
  'node_modules/scxml-test-framework/test/documentOrder/*.scxml',
  'node_modules/scxml-test-framework/test/error/*.scxml',
  'node_modules/scxml-test-framework/test/foreach/*.scxml',
  'node_modules/scxml-test-framework/test/hierarchy+documentOrder/*.scxml',
  'node_modules/scxml-test-framework/test/hierarchy/*.scxml',
  'node_modules/scxml-test-framework/test/history/*.scxml',
  'node_modules/scxml-test-framework/test/if-else/*.scxml',
  'node_modules/scxml-test-framework/test/in/*.scxml',
  'node_modules/scxml-test-framework/test/internal-transitions/*.scxml',
  'node_modules/scxml-test-framework/test/more-parallel/*.scxml',
  'node_modules/scxml-test-framework/test/multiple-events-per-transition/*.scxml',
  'node_modules/scxml-test-framework/test/parallel+interrupt/*.scxml',
  'node_modules/scxml-test-framework/test/parallel/*.scxml',
  'node_modules/scxml-test-framework/test/script/*.scxml',
  'node_modules/scxml-test-framework/test/send-idlocation/*.scxml' ]
> _.difference(v331, v431)
[ 'node_modules/scxml-test-framework/test/w3c-ecma/test201.txml.scxml' ]
```

`w3c-ecma/test201.txml.scxml` is an optional test for the Basic HTTP Event I/O Processor defined in the specification, which SCION does not support. I believe it was listed in 3.3.1 erroneously, and I removed the test for it.

For tests that are shared between Appendix D and the legacy semantics, two different test scripts are sometimes needed, because the semantics change the outcome of the test. For this, a special property `legacySemantics` has been added to the JSON test scripts in scxml-test-framework, which describes the test used for the legacy semantics. Currently, the following test scripts required changes because of different semantics regarding transition priority:

* [more-parallel/test10.json](https://github.com/jbeard4/scxml-test-framework/blob/2.0.0/test/more-parallel/test10.json)
* [more-parallel/test10b.json](https://github.com/jbeard4/scxml-test-framework/blob/2.0.0/test/more-parallel/test10b.json)
* [more-parallel/test2.json](https://github.com/jbeard4/scxml-test-framework/blob/2.0.0/test/more-parallel/test2.json)
* [more-parallel/test3.json](https://github.com/jbeard4/scxml-test-framework/blob/2.0.0/test/more-parallel/test3.json)
* [more-parallel/test6.json](https://github.com/jbeard4/scxml-test-framework/blob/2.0.0/test/more-parallel/test6.json)
* [parallel+interrupt/test21.json](https://github.com/jbeard4/scxml-test-framework/blob/2.0.0/test/parallel+interrupt/test21.json)
* [parallel+interrupt/test21b.json](https://github.com/jbeard4/scxml-test-framework/blob/2.0.0/test/parallel+interrupt/test21b.json)
* [parallel+interrupt/test7.json](https://github.com/jbeard4/scxml-test-framework/blob/2.0.0/test/parallel+interrupt/test7.json)

You can run the tests for legacy semantics with the following invocation:

`grunt test --legacy-semantics`

## Support for `<invoke>` in legacy semantics

Note that `<invoke>` is not currently supported in the legacy semantics. It does work, but it will invoke a new session with the Appendix D semantics. I could add an API to configure SCION to start new invoked sessions with legacy semantics, if people report this as a desirable feature.
