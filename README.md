[![Build status](https://travis-ci.org/jbeard4/SCION.svg?branch=master)](https://travis-ci.org/jbeard4/SCION)

SCION 2.0 is a lightweight SCXML-to-JavaScript compiler that targets the [SCION-CORE](http://github.com/jbeard4/SCION-CORE)  Statecharts interpreter. It currently supports node.js and the browser, and will later support Rhino and other JavaScript environments.

# Overview

SCION 2.0 provides an implementation of the [W3C SCXML draft specification](http://www.w3.org/TR/scxml/) in JavaScript. SCXML provides a declarative markup for Statecharts, a powerful modelling language for developing **complex, timed, event-driven, state-based systems**, and can offer elegant solutions to many problems faced in development of JavaScript-based applications across various domains. In the browser, SCXML can be used to facilitate the development of **rich, web-based user interfaces** with complex behavioural requirements. On the server, SCXML can be used to manage **asynchronous control flow**. 

# Installation

In node.js, install SCION 2.0 via npm:

    npm install scxml

In the browser, add the following script tags to your web page:

```html
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
<script src="http://cdnjs.cloudflare.com/ajax/libs/es5-shim/1.2.4/es5-shim.min.js"></script>
<script type="text/javascript" src="http://jbeard4.github.com/scxml.js/builds/latest/scxml.js"></script>
```

Note that SCION 2.0 assumes the presence of jQuery to handle cross-browser XMLHTTPRequest, however an alternative Ajax library could instead be used. This is set up in the following way:

```javascript
    //perform this setup once, before SCION is used
    scxml.ext.platformModule.platform.ajax = {
        get : function(url,successCallback,dataType){
            //call your preferred Ajax library here to do HTTP GET
            //if dataType is 'xml', the Ajax response must be parsed as DOM
        },
        post : function(url, data, successCallback, dataType){
            //call your preferred Ajax library here to do HTTP POST
        }
    }; 
```

Support is currently being added for Rhino. 

# API

SCION 2.0 uses [SCION-CORE](http://github.com/jbeard4/SCION-CORE) as its Statecharts engine. SCION 2.0 first compiles the SCXML document to a JavaScript object model. The "model" is then used to instantiate a SCION Statecharts interpreter.

Here is an example of a typical usage:

```javascript
    scxml.urlToModel(url,function(err, model){

        if(err) throw err;

        //you can inspect the generated code if you like using JavaScript's Function.prototype.toString
        console.log(model.toString());       

        //instantiate the interpreter
        var statechart1 = new scxml.scion.Statechart(model);

        //you can instantiate a second interpreter using the same model
        var statechart2 = new scxml.scion.Statechart(model);

        //start the interpreter
        var initialConfiguration = statechart1.start();

        //send events
        statechart1.gen({name : 'foo', data : 'bar'});
    });
```

In node, you can also use `require`. 

```javascript
var model = require('./path/to/foo.scxml');
//etc...
```

Note that this will only work if the SCXML `<script>` tags contain local filesystem paths, and not references to 'http:' URIs. The reason for this is that node's `require()` is a synchronous API, but requesting resources across a network must be done asynchronously. 

## Instantiation

### scxml.urlToModel(url,function(err, model){})
### scxml.pathToModel(path,function(err, model){})
### scxml.documentStringToModel(scxmlDocString,function(err, model){})
### scxml.documentToModel(scxmlDocument,function(err, model){})

SCION allows you to instantiate SCXML interpreters from SCXML "model" objects, which are SCXML documents that have been processed for easier interpretation. 
These methods allow you to create an SCXML model from an XML DOM document, document string, or url/path to document.

### new scxml.scion.Statechart(model)

The SCXML constructor creates an interpreter instance from a model object.

## SCXML Interpreter Input

### statechart.start() : `<String>`[]

`statechart.start` starts the SCXML interpreter. `statechart.start` should only be called once, and should be called before `statechart.gen` is called for the first time.

Returns a "basic configuration", which is an Array of strings representing the ids all of the basic states the interpreter is in after the call to `statechart.start` completes.

### statechart.gen(String eventName, Object eventData) : `<String>`[]
### statechart.gen({name : String, data : Object}) : `<String>`[]

An SCXML interpreter takes SCXML events as input, where an SCXML event is an object with "name" and "data" properties. These can be passed to method `gen` as two positional arguments, or as a single object.

`statechart.gen` returns a "basic configuration", which is an Array of strings representing the ids all of the basic states the interpreter is in after the call to `statechart.gen` completes.

```javascript
    var statechart = new scxml.scion.Statechart(model),

    var data = {foo:1};
    var configuration = statechart.gen("eventName",data); 

    //the following call is equivalent
    var configuration = statechart.gen({name:"eventName",data:{foo:1}}); 
```

## SCXML Interpreter Output 

An SCXML interpreter has three forms of output:

1. Notify listeners of state changes.
2. Script JavaScript object references passed into the SCXML interpreter as event data. This technique is used to script the div DOM node in the drag-and-drop example above. 
3. Use SCXML `<send>` element to send SCXML events to web services. Right now, the `<send>` tag is not supported by SCION out of the box. This should be better supported by next release.
    
### statechart.registerListener({onEntry : function(stateId){}, onExit : function(stateId){}, onTransition : function(sourceStateId,[targetStateIds,...]){}})

Registers a callback to receive notification of state changes, as described above.

Each `onEntry`, `onExit` and `onTransition` callback is optional - if the property is not present, it will be ignored.

Furthermore, for the `onTransition` callback, argument `targetStateIds` will be `null` for targetless transitions, rather than, e.g. an empty array.

# Support

[Mailing list](https://groups.google.com/group/scion-dev)
