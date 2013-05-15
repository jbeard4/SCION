This is the transitional repository for the next generation of the SCION JavaScript library. This documentation is in flux, and is incomplete.

# Overview

Statecharts is a powerful modelling language for developing **complex, timed, event-driven, state-based systems**. For an overview of Statecharts see [Statecharts: A Visual Formalism For Complex Systems](http://websrv0a.sdu.dk/ups/ESD/materials/harel-Statecharts.pdf) and [The Rhapsody Semantics of Statecharts](http://research.microsoft.com/pubs/148761/Charts04.pdf).

SCION is a small (2.9kb, minified and gzipped), embeddable implementation of Statecharts in ECMAScript (JavaScript). SCION lets you program with Statecharts using a simple JavaScript/JSON API. It can be used in the browser to manage complex user interface behaviour, or on the server under Node.js or Rhino to manage page navigation and asynchronous control flow. It can even be used in custom JavaScript environments, such as the Mozilla Spidermonkey shell. 

SCION is written so as to abstract out platform dependencies, and is implemented as a single UMD module, which makes it easy to deploy in any JavaScript environment. The philosophy of SCION is "write once, embed everywhere".

SCION powers [SCXML.js](https://github.com/jbeard4/scxml.js), an implementation of [SCXML](http://www.w3.org/TR/scxml) in JavaScript, and as such, it supports all of the features of the SCXML core module, including compound states ( **OR** states), parallel states ( **AND** states), and history states. 

# Quickstart and Simple Use Case

Let's start with the simple example of drag-and-drop behaviour in the browser. You can run this demo live on jsfiddle [here](http://jsfiddle.net/jbeard4/MDkLe/1/).

An entity that can be dragged has two states: idle and dragging. If the entity is in an idle state, and it receives a mousedown event, then it starts dragging. While dragging, if it receives a mousemove event, then it changes its position. Also while dragging, when it receives a mouseup event, it returns to the idle state.

This natural-language description of behaviour can be described using the following simple state machine:

![Drag and Drop](http://jbeard4.github.com/SCION/img/drag_and_drop.png)

This state machine could be written in SCION's JSON syntax as follows:

```javascript
{
    "states" : [
        {
            "id" : "idle",
            "transitions" : [
                {
                    "event" : "mousedown",
                    "target" : "dragging",
                }
            ]
        },
        {
            "id" : "dragging",
            "transitions" : [
                {
                    "event" : "mouseup",
                    "target" : "idle",
                },
                {
                    "event" : "mousemove",
                    "target" : "dragging"
                }
            ]
        }
    ]
}
```

One can add action code in order to script an HTML DOM element, so as to change its position on mousemove events:

```javascript
//declare the your statechart model, same as before
var firstEvent,
    eventStamp,
    rectNode = document.getElementById('rect'),
    rectX = 0,
    rectY = 0;

var statechartModel = {
    states : [
        {
            id : 'idle',
            onEntry : function(){
                rectNode.textContent='idle';
            },
            transitions : [
                {
                    event : 'mousedown',
                    target : 'dragging',
                    onTransition : function(event){
                        eventStamp = firstEvent = event.data;
                    }
                }
            ]
        },
        {
            id : 'dragging',
            onEntry : function(){
                rectNode.textContent='dragging';
            },
            transitions : [
                {
                    event : 'mouseup',
                    target : 'idle'
                },
                {
                    event : 'mousemove',
                    target : 'dragging',
                    onTransition : function(event){
                        var dx = eventStamp.clientX - event.data.clientX;
                        var dy = eventStamp.clientY - event.data.clientY;

                        rectNode.style.left = (rectX -= dx) + 'px';
                        rectNode.style.top = (rectY -= dy) + 'px';
                        
                        eventStamp = event.data;
                    }
                }
            ]
        }
    ]
};

//instantiate the interpreter
var interpreter = new SCION.Statechart(statechartModel);

//start the interpreter
interpreter.start();

function handleEvent(e){
    e.preventDefault();
    interpreter.gen({name : e.type,data: e});
}

//connect all relevant event listeners
rectNode.addEventListener('mousedown',handleEvent,true);
document.documentElement.addEventListener('mouseup',handleEvent,true);
document.documentElement.addEventListener('mousemove',handleEvent,true);

```

You can then perform the following steps to script web content:

1. Use the statecharts model object to instantiate the SCXML interpreter.
2. Connect relevant event listeners to the SCXML interpreter.
3. Call the `start` method on the SCXML interpreter to start execution of the statechart.


```html
<html>
    <head>
        <script src="http://cdnjs.cloudflare.com/ajax/libs/es5-shim/1.2.4/es5-shim.min.js"></script>
        <script type="text/javascript" src="http://jbeard4.github.com/SCION-ng/builds/latest/scion-min.js"></script>
    </head>
    <body>
        <div id="rect"/>
        <script>
            //declare the your statechart model, same as before
            var firstEvent,
                eventStamp,
                rectNode = document.getElementById('rect'),
                rectX = 0,
                rectY = 0;

            var statechartModel = {
                states : [
                    {
                        id : 'idle',
                        onEntry : function(){
                            rectNode.textContent='idle';
                        },
                        transitions : [
                            {
                                event : 'mousedown',
                                target : 'dragging',
                                onTransition : function(event){
                                    eventStamp = firstEvent = event.data;
                                }
                            }
                        ]
                    },
                    {
                        id : 'dragging',
                        onEntry : function(){
                            rectNode.textContent='dragging';
                        },
                        transitions : [
                            {
                                event : 'mouseup',
                                target : 'idle'
                            },
                            {
                                event : 'mousemove',
                                target : 'dragging',
                                onTransition : function(event){
                                    var dx = eventStamp.clientX - event.data.clientX;
                                    var dy = eventStamp.clientY - event.data.clientY;

                                    rectNode.style.left = (rectX -= dx) + 'px';
                                    rectNode.style.top = (rectY -= dy) + 'px';
                                    
                                    eventStamp = event.data;
                                }
                            }
                        ]
                    }
                ]
            };

            //instantiate the interpreter
            var interpreter = new scion.Statechart(statechartModel);

            //start the interpreter
            interpreter.start();

            function handleEvent(e){
                e.preventDefault();
                interpreter.gen({name : e.type,data: e});
            }

            //connect all relevant event listeners
            rectNode.addEventListener('mousedown',handleEvent,true);
            document.documentElement.addEventListener('mouseup',handleEvent,true);
            document.documentElement.addEventListener('mousemove',handleEvent,true);


        </script>
    </body>
</html>
```

<!--

# API

## Statecharts Model Schema


SCION is designed to allow you to specify the Statecharts model declaratively as a single JavaScript object literal, or as JSON.

The schema for this object is defined here using JSON Schema.

```javascript
{
    id : { type : 'string', required : false },
    initial : { type : 'string', required : false },
    states : { type : 'array', required : false, items : { href : '#' }  },
    type : { type : 'string', require : false, enum : ['parallel', 'history', 'initial', 'final', 'scxml'], default : 'state' },
    transitions : {
        event : { type : 'string', required : false},
        events : { type : 'array', items : 'string', required : false},

        target : { type : 'string', required : false},
        targets : { type : 'array', items : 'string', required : false},

        onTransition : { type : ['string', 'function'] }
    },
    onEntry : { type : ['string', 'function'] },
    onExit : { type : ['string', 'function'] },
    isDeep : { type : 'boolean', require : false, default : 'false', description : "This only applies to history states. See ..." },
}
```

### Function signature for onEntry, onExit, and onTransition

```javascript
function(event, isIn, sessionId, name, ioProcessors, _x){}
```

`event` is the current Statechart event, which is of the form `{name : String, data : Object}`.

Parmaters `isIn`, `sessionId`, `name`, `ioProcessors`, `_x` are added for compatibility with SCXML. 

The context ("`this`") object contains the following methods:

* `gen(event)`, which adds an event to the Statechart's outer queue
* `raise(event)`, which adds an event to the Statechart's inner queue 

For semantics, see [TODO: the SCXML specification, and my thesis.]

## Instantiation

### new scion.Statechart(model)

The SCXML constructor creates an interpreter instance from a model object.

```javascript
    //same model can be used to create multiple interpreter instances
    var scxml1 = new scion.Statechart(model),
        scxml2 = new scion.Statechart(model);
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

### scxml.registerListener({onEntry : function(stateId){}, onExit : function(stateId){}, onTransition : function(sourceStateId,[targetStateIds,...]){}})

Registers a callback to receive notification of state changes, as described above.

Each `onEntry`, `onExit` and `onTransition` callback is optional - if the property is not present, it will be ignored.

Furthermore, for the `onTransition` callback, argument `targetStateIds` will be `null` for targetless transitions, rather than, e.g. an empty array.

# Usage in Browser

Add the following script tags to your web page:

```html
<script src="http://cdnjs.cloudflare.com/ajax/libs/es5-shim/1.2.4/es5-shim.min.js"></script>
<script type="text/javascript" src="http://jbeard4.github.com/SCION/builds/latest/scion.js"></script>
```

# Usage in Node.js

Install SCION via npm:

    npm install scion

# Usage in Rhino

Get it with git:

    git clone git://github.com/jbeard4/SCION.git

Rhino 1.7R3 supports CommonJS modules, so SCION can be used as follows:

```bash
#just put SCION/lib on your modules path
rhino -modules path/to/SCION/lib -main path/to/your/script.js
```

<a name="scionsemantics"></a>

# Support

[Mailing list](https://groups.google.com/group/scion-dev)
-->
