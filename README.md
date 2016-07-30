# Overview

SCION provides an implementation of the [W3C SCXML specification](http://www.w3.org/TR/scxml/) in JavaScript. SCXML provides a declarative markup for Statecharts, a powerful modelling language for developing **complex, timed, event-driven, state-based systems**. 

SCION is: 

- Robust: automatically tested using a [custom testing framework for SCXML implementations](https://github.com/jbeard4/scxml-test-framework). ![Travis-CI build status](https://travis-ci.org/jbeard4/SCION.svg?branch=master)
- Persistent: Cheap snapshotting and state machine serialization to secondary storage.
- Portable: works well in IE6+, modern browsers, node.js, rhino, and various JavaScript shells. 
- Optimized: For performance, memory usage and payload size.
- Modular: Specify state machine in SCXML, or pure JSON using [SCION-CORE](https://github.com/jbeard4/SCION-CORE).


# Installation

## node.js

`npm install scxml`

## browser

`bower install jbeard4/scion`

## rhino

Get it with git:

    git clone --recursive git://github.com/jbeard4/SCION.git

Rhino 1.7R3 supports CommonJS modules, so SCION can be used as follows:

```bash

#just put SCION/lib on your modules path
rhino -modules path/to/SCION/lib -main path/to/your/script.js
```

# Quickstart

```javascript
scxml.urlToModel("drag-and-drop.xml",function(err,model){

  if(err) throw err;

  //instantiate the interpreter
  var interpreter = new scxml.scion.Statechart(model);

  //start the interpreter
  interpreter.start();

  //send the init event
  interpreter.gen({name:"init",data:rect});
})
```

# API

## Instantiation

### scxml.urlToModel(url,function(err, model){} [, context])
### scxml.pathToModel(path,function(err, model){} [, context])
### scxml.documentStringToModel(scxmlDocString,function(err, model){} [, context])
### scxml.documentToModel(scxmlDocument,function(err, model){} [, context])

SCION allows you to instantiate SCXML interpreters from SCXML "model" objects, which are SCXML documents that have been processed for easier interpretation. 
These methods allow you to create an SCXML model from an XML DOM document, document string, or url/path to document.

### new scion.SCXML(model, options)

The SCXML constructor creates an interpreter instance from a model object.

```javascript
    //same model can be used to create multiple interpreter instances
    var scxml1 = new scion.SCXML(model),
        scxml2 = new scion.SCXML(model);
```

## SCXML Interpreter Input

### scxml.start() : `<String>`[]

`scxml.start` starts the SCXML interpreter. `scxml.start` should only be called once, and should be called before `scxml.gen` is called for the first time.

Returns a "basic configuration", which is an Array of strings representing the ids all of the basic states the interpreter is in after the call to `scxml.start` completes.

### scxml.gen(String eventName, Object eventData) : `<String>`[]
### scxml.gen({name : String, data : Object}) : `<String>`[]

An SCXML interpreter takes SCXML events as input, where an SCXML event is an object with "name" and "data" properties. These can be passed to method `gen` as two positional arguments, or as a single object.

`scxml.gen` returns a "basic configuration", which is an Array of strings representing the ids all of the basic states the interpreter is in after the call to `scxml.gen` completes.

```javascript
    var scxml = new scion.SCXML(model),

    var data = {foo:1};
    var configuration = scxml.gen("eventName",data); 

    //the following call is equivalent
    var configuration = scxml.gen({name:"eventName",data:{foo:1}}); 
```

## SCXML Interpreter Output 

An SCXML interpreter has three forms of output:

1. Notify listeners of state changes.
2. Script JavaScript object references passed into the SCXML interpreter as event data. This technique is used to script the div DOM node in the drag-and-drop example above. 
3. Use SCXML `<send>` element to send SCXML events to web services.
    
### scxml.registerListener({onEntry : function(stateId){}, onExit : function(stateId){}, onTransition : function(sourceStateId,[targetStateIds,...]){}})

Registers a callback to receive notification of state changes, as described above.

Each `onEntry`, `onExit` and `onTransition` callback is optional - if the property is not present, it will be ignored.

Furthermore, for the `onTransition` callback, argument `targetStateIds` will be `null` for targetless transitions, rather than, e.g. an empty array.

### scxml.getConfiguration() : String[]

Returns current state machine ***configuration***, the set of basic states in which the state machine resides. 

### scxml.getFullConfiguration() : String[]

Returns current state machine ***full configuration***, the set of basic states in which the state machine resides, and the hierarchical ancestors of those basic states. 

### scxml.isIn(String : stateId) : Boolean

Returns true if the state machine is in state with id `stateId`.

### scxml.isFinal() : Boolean

Returns true, if the state machine is in a final state. Otherwise, returns false. 

### scxml.getSnapshot() : Snapshot 

Returns a `snapshot` object, of the form : 

```
[
    configuration,
    history,
    isInFinalState,
    dataModel
]
```

The snapshot object can be serialized as JSON and saved to a database. It can later be passed to the SCXML constructor to restore the state machine: `new scion.SCXML(model, {snapshot : snapshot})`.

# Example Use Cases

- [Interaction Design for the Web](https://github.com/jbeard4/SCION/wiki/SCION-for-Interaction-Design-and-Web-Front-end-Development)
- [IoT Signal Processing](http://www.instructables.com/id/UMEC-Universal-Morse-EncoderDecoder/)
- [Telephony](http://blog.echo-flow.com/2012/07/29/syracuse-student-sandbox-hackathon-recap/)

# Embedding SCION

SCION can be used as an embedded state machine interpreter:

* Java : [SCION-Java](https://github.com/jbeard4/SCION-Java)
* C# : [SCION.NET](https://github.com/jbeard4/SCION.NET)
* Python : [pySCION](https://github.com/jbeard4/pySCION)

<a name="support"></a>

# Support

[Mailing list](https://groups.google.com/group/scion-dev)

<a name="otherresources"></a>

# Other Resources

* [Custom Actions](https://github.com/jbeard4/SCION/wiki/Plugin-API-for-SCION-2.0-branch)
* [Action Tag Scripting APIs](https://github.com/jbeard4/SCION/wiki/Action-Tag-Scripting-API)
* [SCION Demos](https://github.com/jbeard4/scion-demos)
* [Table describing which SCXML tags are supported](https://github.com/jbeard4/SCION/wiki/SCION-Implementation-Status)
* [Project Background](https://github.com/jbeard4/SCION/wiki/Project-Background)
* [Jacob Beard's Master thesis](http://digitool.library.mcgill.ca/R/-?func=dbin-jump-full&object_id=116899&silo_library=GEN01)

<a name="relatedwork"></a>

# Related Projects

* [SCXML Test Framework](https://github.com/jbeard4/scxml-test-framework)
* [SCXML Commons](http://commons.apache.org/scxml/)
* [PySCXML](http://code.google.com/p/pyscxml/) 
