# Overview

scion-core is a small implementation of Statecharts in JavaScript. scion-core
lets you program with Statecharts using a simple JavaScript/JSON API. 

# Installation

## Browser

Install via bower:

```
npm install -g bower
bower install scion-core
```

Add to your page:

`<script src="bower_components/scion-core/dist/scion.min.js"></script>`

scion-core is then available as the global variable `scion`.

Alternatively, load scion-core via RequireJS:

```html
  <script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.2.0/require.min.js"></script>
  <script>
    require(['/bower_components/scion-core/dist/scion.min.js'], function(){
    }); 
  </script>
```

## Node.js

Install scion-core via npm:

    npm install scion-core

# Backwards-compatibility (semantics)

There are many different semantics for Statecharts family of languages (for a
good overview of various Statechart semantics, see ["Big-Step Semantics"](https://cs.uwaterloo.ca/~nday/pdf/techreps/2009-05-EsDa-tr.pdf) by
Shahram Esmaeilsabzali, Nancy A. Day, Joanne M. Atlee, and Jianwei Niu).
scion-core implements the semantics described in [Appendix D of the SCXML specification](https://www.w3.org/TR/scxml/).

Versions of scion-core@1.x implements a slightly different semantics,
described
[here](https://github.com/jbeard4/SCION/wiki/SCION-vs.-SCXML-Comparison),
[here](https://github.com/jbeard4/SCION/wiki/Scion-Semantics), and 
[here](http://digitool.library.mcgill.ca/R/-?func=dbin-jump-full&object_id=116899&silo_library=GEN01). 
The semantics of scion-core@1.x have been deprecated in scion-core@2.x in favor
of the SCXML semantics described in Appendix D of the specification. 

If you are upgrading an existing application, and you require support for
scion-core@1.x semantics, the
[scion-core-legacy](https://github.com/jbeard4/scion-core-legac://github.com/jbeard4/scion-core-legacy)
module provides a backwards-compatible, drop-in replacement module for
scion-core@1.5.5. 

# API

See generated API docs [here](http://jbeard4.github.io/SCION-CORE/classes/_workspace_scion_scxml_platform_projects_scion_core_tsd_scion_core_d_.statechart.html).

# Statecharts Model Schema

scion-core is designed to allow you to specify the Statecharts model declaratively as a single JavaScript object literal, or as JSON. This section is intended to describe the schema of the Statecharts object model accepted by scion-core. 

As of version 2, scion-core implements the semantics defined in Appendix D of the SCXML specification, ["Algorithm for SCXML Interpretation"](https://www.w3.org/TR/scxml/#AlgorithmforSCXMLInterpretation).

## States

A scion-core model is made up of states. States can have id's, which are optional. Here is a scion-core model which is a single state:

```
{
    id : 'foo'
}
```

States can contain other states hierarchically:

```javascript
{
    id : 'foo'
    states : [
        {
            id : 'bar'
        },
        {
            id : 'bat'
        }
    ]
}
```

By default, a parent state will be an "OR" state, which means it defines an XOR relationship between its children (if the state machine is in 'foo', then the state machine will either be in state 'bar' or 'bat', but will never be in both 'bar' and 'bat' simultaneously). 

By default, when entering a parent state, the first state in the parent's state array will be entered. So, for example, when the state machine is started with the above model, its **configuration** (the set of states the state machine is currently in) will be `['foo','bar']`;

There are other types of states, however, including "parallel" states, which defines an "AND" relationship between substates.

```javascript
{
    id : 'foo'
    $type : 'parallel'
    states : [
        {
            id : 'bar'
        },
        {
            id : 'bat'
        }
    ]
}
```

In this example, if the state machine is in state 'foo', then the state machine will also be in state 'bar' and state 'bat' simultaneously. So when the state machine is started with the above model, its configuration will be `['foo','bar','bat']`.

## Transitions

States are associated with **transitions**, which target other states. Transitions are optionally associated with an **event name**. A scion-core event is an object with "name" and "data" properties. When an event is sent to the state machine, the interpreter will inspect the current configuration, and select the set of transitions that matches event name.


```javascript
{
    id : 'foo'
    states : [
        {
            id : 'bar',
            transitions : [
                {
                    target : 'bat',
                    event : 't'
                }
            ]
        },
        {
            id : 'bat'
        }
    ]
}
```

In this case, the state machine would start in configuration `['foo','bar']`. When event `{ name : 't' }` is sent to the state machine, then the state machine would transition to state 'bat', and the resulting configuration would be `['foo','bat']`.

If the transition does not have an event property, then it is known as a "default transition", and it will be selected regardless of the event's "name" property.

A transition can also be associated with a **condition**, which is an arbitrary JavaScript function that accepts an event as input, and returns a boolean value as output. Boolean true means the transition can be selected, while boolean false means the transition will not be selected.

```javascript
{
    id : 'foo'
    states : [
        {
            id : 'bar',
            transitions : [
                {
                    target : 'bat',
                    event : 't',
                    cond : function(event){
                        return event.data % 2;
                    }
                }
            ]
        },
        {
            id : 'bat'
        }
    ]
}
```

For example, the above model will only transition from 'bar' to 'bat', when `event.data` contains an odd number.

## Entry, Exit, and Transition Actions

States can be associated with **entry** and **exit** actions. These are JavaScript functions which are executed when the state is entered or exited.

Transitions can also be associated with actions.

Actions are executed in the following order: 

* State exit actions, ordered first by hierarchy (inner states first), and then by the order in which they appear in the document.
* Transition actions, based on document order.
* State entry actions, ordered first by hierarchy (outer states first), and then by the order in which they appear in the document.

```javascript
var buffer;

var model = {
    id : 'foo'
    onEntry : function(event){
        buffer = [];      //initialize array
    },
    states : [
        {
            id : 'bar',
            onEntry : function(event){
                buffer.push(1);
            },
            onExit : function(event){
                buffer.push(2);
            },
            transitions : [
                {
                    target : 'bat',
                    event : 't',
                    onTransition : function(event){
                        buffer.push(3);
                    }
                }
            ]
        },
        {
            id : 'bat',
            onEntry : function(event){
                buffer.push(event.data);
            }
        }
    ]
};

var sc = new scion.SCInterpreter(model);
sc.start();     //buffer now contains [1]
sc.gen('t','x');    //buffer now contains [1,2,3,'x']
```

For the above model, when the state machine is started, 'foo' would be entered, thus initializing variable `buffer` with a new array; and then state 'bar' would be entered, pushing `1` to the buffer. After the invocation to `sc.start`, the buffer would then container `[1]`.

During the call to `sc.gen`, the exit action of state 'bar' would be executed, pushing `2` to the buffer, followed by transition action, pushing `3` to the buffer, followed by the entry action of `bat`, pushing the event data, string `"x"`, to the buffer. After the call to `sc.gen` completes, the buffer would contain [1,2,3,'x'].

## History

A **history** state is a special pseudo-state that allows the state machine to "remember" what substate it was in last time it was in a particular parent state. There are two types of history states: "deep" and "shallow".

The syntax for specifying history states is as follows:

```javascript
{
    states : [
        {
            id : 'foo',
            transitions : [
                { 
                    event : 't2'
                    target : 'bif'
                }
            ],
            states : [
                {
                    id : 'h',
                    $type : 'history',
                    isDeep : true
                    transitions : [
                        {
                            target : 'bar'
                        }
                    ]
                },
                {
                    id : 'bar',
                    transitions : [
                        { 
                            event : 't1'
                            target : 'bat2'
                        }
                    ]
                },
                {
                    id : 'bat',
                    substates : [
                        {
                            id : 'bat1'
                        },
                        {
                            id : 'bat2'
                        }
                    ]
                }
            ]
        },
        {
            id : 'bif',
            transitions : [
                {
                    target : 'h',
                    event : 't3'
                }
            ]
        }
    ]
}
```

The first time the state machine enters 'h', it it will transition to state 'bar'. After the call to sc.start(), the state machine will reside in ['foo','bar'].

After the state machine sends event `t1`, the state machine will transition to 'bat2', and will reside in configuration `['foo','bat','bat2']`.

After the state machine sends event `t2`, the state machine will transition to 'bif', and will reside in configuration `['bif']`.

Finally, after the state machine sends event `t3`, the state machine will transition to back to the history state 'h', which will "remember", the configuration the state machine was in last time it was in 'foo', and the state machine will complete in configuration `['foo','bat','bat2']`.

If property `isDeep` had not been set on the history state, then the state machine would only have remembered the child substates of `foo`, and the state machine would have completed in configuration `['foo','bat','bat1']`.

## Communications

The context object ("`this`") of onEntry, onExit, and onTransition functions contains the following methods:

* `send(event)`, which adds an event to the interpreter's outer queue
* `raise(event)`, which adds an event to the interpreter's inner queue 



# Quickstart and Simple Use Case

Let's start with the simple example of drag-and-drop behaviour in the browser. You can run this demo live on jsfiddle [here](http://jsfiddle.net/jbeard4/MDkLe/11/).

An entity that can be dragged has two states: idle and dragging. If the entity is in an idle state, and it receives a mousedown event, then it starts dragging. While dragging, if it receives a mousemove event, then it changes its position. Also while dragging, when it receives a mouseup event, it returns to the idle state.

This natural-language description of behaviour can be described using the following simple state machine:

![Drag and Drop](http://jbeard4.github.com/SCION/img/drag_and_drop.png)

This state machine could be written in scion-core's JSON syntax as follows:

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
```

You can then perform the following steps to script web content:

1. Use the statecharts model object to instantiate the SCXML interpreter.
2. Connect relevant event listeners to the SCXML interpreter.
3. Call the `start` method on the SCXML interpreter to start execution of the statechart.


```html
<html>
    <head>
        <script src="http://cdnjs.cloudflare.com/ajax/libs/es5-shim/1.2.4/es5-shim.min.js"></script>
        <script src="bower_components/scion-core/dist/scion.min.js"></script>
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
            var interpreter = new scion.SCInterpreter(statechartModel);

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

# Build Status

[![Build status](https://travis-ci.org/jbeard4/scion-core.svg?branch=master)](https://travis-ci.org/jbeard4/scion-core)

