v0.0.10
-------

Various bug fixes.

v0.0.9
------

* Removed use of JsonML internally. Instead, DOM is now used directly to transform SCXML to JSON. To see the internal JSON representation of an SCXML document, you can run node `node lib/core/util/annotate-scxml-json.js path/to/document.scxml`
* Improved the platform API so that it can be exposed as part of the SCION API, and used to more easily embed SCION in other languages and environments. 

v0.0.8
------

* Added support for `<if>`, `<elseif>`, `<else>`, and `<foreach>` action tags.
* Refactored architecture by which action code gets evaluated, such that all action code is evaluated within the document scope. This should provide more efficient execution, as datamodel variables can be referenced as local variables and strings expressions can be referenced as string constants. The disadvantage is that some some datamodel variable names must be reserved for the interpreter. These currently are: `$log`, `$cancel`, `$send`, and `$origin`

v0.0.7
------

* Improved handling of platform dependencies, such that each "blessed" platform (currently node.js, Rhino, and the browser) declares an adapter which exposes a standard API for network, filesystem, and DOM. This allows the portable interpreter core to be cleanly separated out from platform dependencies.
* Changed script evaluation semantics so that each SCXML document instance declares its own scope. 
    * Global scripts are evaluated at the top level of that scope, and all other action code is evaluated in separate function contexts within that scope. 
    * Variables declared in the SCXML document datamodel are visible to the entire document scope, including inside of functions declared in top-level scripts, and all other action code. Furthermore, datamodel variables now MUST be legal ECMAScript identifiers. 
* Better support for Rhino delayed send: fixed a bug where a reference kept to a Timer instance would keep the timer thread running and not allow the process to terminate.
* Added integration with travis-ci continuous integration service.
* Added support for @src attribute on data and script tags. 
    * This entailed a change in API, such that `scion.documentToModel` and `scion.documentStringToModel` are now asynchronous, as scripts referenced in SCXML may be downloaded asynchronously. 
    * This also entailed a change in the testing protocol and associated test scripts, such that test documents are now passed around as URLs instead of document strings, and are loaded using `scion.urlToModel`, rather than `scion.documentStringToModel`.

v0.0.6
------

* Better support for "blessed" environments of node.js, Rhino and the browser
    * Created a single unified API for the browser, node.js and Rhino, as well as generic front-end that should load environment-specific front-ends as needed. 
    * Used modified version of stitch to make sure that only environment-specific js bundles are built.
* Made `gen` method more flexible in what input it accepts, allowing the user to pass in event object with name and data properties as first argument, OR pass in name string and data object as separate positional argument.
* Better support and testing for Rhino.

v0.0.5
------

* Removed parsePage module, which would automatically instantiate SCXML markup on a page. This did not integrate well with regular HTML, and overall was deemed too leaky an abstraction.
* Optimization: state depth, ancestors, descendants, and transition LCA are always generated at parse time and stored in the SCXML model.
* Removed underscore.js dependency in favor of regular ES5 APIs. It should be possible to provide cross-browser compatibility through a shim, like: https://github.com/kriskowal/es5-shim
* Fixed bug in interpreter where composite states being entered would not have their enter actions triggered if the transition targeted one of their descendants. 
* Preliminary support for attaching state change listeners to SCION interpreter instances, and connecting them to remote graphical debuggers, such as the scxmlgui project: http://code.google.com/p/scxmlgui/

v0.0.4
------

* Fixed bug where ancestors would not be properly computed in function getAncestors.

v0.0.3
------

* Rewrote core SCXML interpreter from CoffeeScript to JavaScript.
* Converted tabs to spaces.
* Moved out demos and testing framework into their own projects. Added HTTP test server to be run with test client included in scxml-test-framework.
* New interpreter features:
    * Event Matching: 
        * Added support for scxml events of the form "foo.bar.*". These get normalized to the form "foo.bar".
        * Added support for scxml wildcard ("*") event. 
        * Added support for SCXML prefix events (e.g transition with trigger "foo" will match event names "foo", "foo.bar", "foo.bar.bat", but not "foobar").
    * Added support for specifying multiple events on a single transition.
    * Added interpreter support and tests for targetless transitions (a.k.a. static reactions, described in Statemate/Rhapsody).
    * Changed semantics of `<assign>` tag to match JavaScript semantics, so that the datamodel is updated immediately, in the same small-step. Added tests for this. Next Small-Step assignment semantics are still available using the `setData()`/`getData()` functions in a `<script>` tag.

    * Added check to `SCXML.gen` so that it would throw an error on recursive calls, which are not supported.
    * If attribute initial and initial state are not specified, the first state will be taken as the default initial state. 

    * Changed the interpreter API so that `start()` and `gen()` return the new configuration.

    * Updated interpreter to use `raise` to send events in next small-step (add to inner queue), and `send` to send events after a timeout. 

    * Added support and tests for the following attributes and child nodes of `<send>`:
        * namelist
        * params
        * content
        * eventexpr
        * targetexpr
        * delayexpr


v0.0.2
------

* Changed the license from LGPLv3 to Apache-2.0. 
* Updated build process.

v0.0.1
------

* Initial release.
