# Overview

SCION is an industrial-strength implementation of [W3C SCXML](http://www.w3.org/TR/scxml/) in JavaScript. 

SCXML provides a declarative markup for Statecharts, a powerful modelling language for developing **complex, timed, event-driven, state-based systems**. 

# Installation

## node.js

`npm install scxml`

## browser

### Script tag with cdnjs

Add the following script tags to your HTML:

```
<script src="https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.23.0/polyfill.min.js">
<script src="https://cdnjs.cloudflare.com/ajax/libs/scion/3.0.2/scxml.min.js">
```

Then SCION API available as global singleton object `scxml`.

### npm and browserify

Install babel-polyfill and scxml with npm:

`npm install --save scxml babel-polyfill`

Then add to your application entry point:

```js
require('babel-polyfill');
let scxml = require('scxml');
```

# Quickstart

```javascript
scxml.urlToModel("drag-and-drop.xml",function(err,model){

  if(err) throw err;

  model.prepare(function(err, fnModel) {

    if(err) throw err;

    //instantiate the interpreter
    var sc = new scxml.scion.Statechart(fnModel);

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
### scxml.documentStringToModel(url,scxmlDocString,function(err, model){} [, context])
### scxml.documentToModel(scxmlDocument,function(err, model){} [, context])

Compile SCXML to JavaScript object "model".

### model.prepare(function(err, fnModel) {}, executionContext, hostContext)

Prepare the model by downloading source scripts and constructing a host execution context for the SCXML datamodel.

### new scxml.scion.Statechart(fnModel, options)


The Statechart constructor creates an interpreter instance from a model object.

```javascript
    //same model can be used to create multiple interpreter instances
    var sc1 = new scxml.scion.Statechart(fnModel),
        sc2 = new scxml.scion.Statechart(fnModel);
```

## Statechart Interpreter API

See [SCION-CORE API](https://github.com/jbeard4/SCION-CORE#api). 


# Build Status

[![Build status](https://travis-ci.org/jbeard4/SCION.svg)](https://travis-ci.org/jbeard4/SCION)

