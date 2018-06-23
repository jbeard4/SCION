# Overview
[![Backers on Open Collective](https://opencollective.com/scion/backers/badge.svg)](#backers)
 [![Sponsors on Open Collective](https://opencollective.com/scion/sponsors/badge.svg)](#sponsors) 

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
<script src="https://cdnjs.cloudflare.com/ajax/libs/scion/4.3.1/scxml.min.js">
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

See the API docs [here](http://jbeard4.github.io/SCION/modules/_workspace_scion_scxml_platform_projects_scion_tsd_index_d_.html).

# Backwards-compatibility with `SCION@3.x`

See the note [here](https://github.com/jbeard4/SCION-CORE#backwards-compatibility-semantics).

## Contributors

This project exists thanks to all the people who contribute. 
<a href="graphs/contributors"><img src="https://opencollective.com/SCION/contributors.svg?width=890&button=false" /></a>


## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/SCION#backer)]

<a href="https://opencollective.com/juan-carlos-madrid-abad#" target="_blank"><img width="60" src="https://opencollective.com/static/images/avatar-01.svg?width=890"></a>

## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/SCION#sponsor)]

<a href="https://opencollective.com/SCION/sponsor/0/website" target="_blank"><img src="https://opencollective.com/SCION/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/SCION/sponsor/1/website" target="_blank"><img src="https://opencollective.com/SCION/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/SCION/sponsor/2/website" target="_blank"><img src="https://opencollective.com/SCION/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/SCION/sponsor/3/website" target="_blank"><img src="https://opencollective.com/SCION/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/SCION/sponsor/4/website" target="_blank"><img src="https://opencollective.com/SCION/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/SCION/sponsor/5/website" target="_blank"><img src="https://opencollective.com/SCION/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/SCION/sponsor/6/website" target="_blank"><img src="https://opencollective.com/SCION/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/SCION/sponsor/7/website" target="_blank"><img src="https://opencollective.com/SCION/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/SCION/sponsor/8/website" target="_blank"><img src="https://opencollective.com/SCION/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/SCION/sponsor/9/website" target="_blank"><img src="https://opencollective.com/SCION/sponsor/9/avatar.svg"></a>

# Build Status

[![Build status](https://travis-ci.org/jbeard4/SCION.svg)](https://travis-ci.org/jbeard4/SCION)

