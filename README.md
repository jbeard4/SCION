# Overview

SCION is an industrial-strength implementation of [W3C SCXML](http://www.w3.org/TR/scxml/) in JavaScript. 

SCXML provides a declarative markup for Statecharts, a powerful modelling language for developing **complex, timed, event-driven, state-based systems**. 

# Installation

## node.js

`npm install scxml`

## browser

`bower install jbeard4/scion`

Or add:

`<script src="https://cdnjs.cloudflare.com/ajax/libs/scion/3.0.0/scion-min.js">`

# Quickstart

```javascript
scxml.urlToModel("drag-and-drop.xml",function(err,model){

  if(err) throw err;

  model.prepare(function(err, fnModel) {

    if(err) throw err;

    //instantiate the interpreter
    var sc = new scxml.scion.Statechart(model);

    //start the interpreter
    sc.start();

    //send the init event
    sc.gen({name:"init",data:rect});

  });
})
```

# API

## Instantiation

### scxml.urlToModel(url,function(err, model){} [, context])
### scxml.pathToModel(path,function(err, model){} [, context])
### scxml.documentStringToModel(scxmlDocString,function(err, model){} [, context])
### scxml.documentToModel(scxmlDocument,function(err, model){} [, context])

SCXML to JavaScript object "model".

### model.prepare(function(err, fnModel) {}, executionContext, hostContext)

Prepare the model by downloading source scripts and constructing a host execution context. The resulting `fnModel` can be used to instantiate multiple Statechart instances. 

### new scxml.scion.SCXML(fnModel, options)


The SCXML constructor creates an interpreter instance from a model object.

```javascript
    //same model can be used to create multiple interpreter instances
    var sc1 = new scxml.scion.SCXML(fnModel),
        sc2 = new scxml.scion.SCXML(fnModel);
```

## SCXML Interpreter API

See [SCION-CORE API](https://github.com/jbeard4/SCION-CORE#api). 


# Build Status

[![Build status](https://travis-ci.org/jbeard4/SCION.svg?branch=master)](https://travis-ci.org/jbeard4/SCION-CORE)

[![Sauce Test Status](https://saucelabs.com/buildstatus/jbeard43?branch=build-tools)](https://saucelabs.com/u/jbeard43)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/jbeard43.svg?branch=build-tools)](https://saucelabs.com/u/jbeard43)

