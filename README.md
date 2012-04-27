# Overview

SCION provides an implementation of the [W3C SCXML draft specification](http://www.w3.org/TR/scxml/) in JavaScript. SCXML provides a declarative markup for Statecharts, a powerful modelling language for developing **complex, timed, reactive, state-based systems**, and can offer elegant solutions to many problems faced in development of JavaScript-based applications across various domains. In the browser, SCION can be used to facilitate the development of **rich, web-based user interfaces** with complex behavioural requirements. On the server, SCION can be used to manage **asynchronous control flow**. 

Here are some reasons you might choose to use SCION:

- Liberally licensed (Apache 2.0)
- Standards-based (SCXML)
- **Robust**: automatically tested using a custom testing framework for SCXML implementations.
- Maximally **portable** across JavaScript environments: works well in the browser, node.js, rhino, and various JavaScript shell environments. 
- Aggressively **optimized** for performance, memory usage and payload size. More information on this will be forthcoming.

# Table of Contents

1\.  [Use in the Browser](#useinthebrowser)  
1.1\.  [Quickstart](#quickstart)  
1.2\.  [Multiple Statechart Instances](#multiple_statechart_instances)  
1.3\.  [Advanced Examples](#advancedexamples)  
2\.  [Use in node.js](#useinnode.js)  
2.1\.  [Installation](#installation)  
2.2\.  [Example](#example)  
3\.  [Use in Rhino](#useinrhino)  
4\.  [SCION Semantics](#scionsemantics)  
5\.  [License](#license)  
6\.  [Support](#support)  
7\.  [Other Resources](#otherresources)  
8\.  [Related Work](#relatedwork)  

<a name="useinthebrowser"></a>

# Use in the Browser

<a name="quickstart"></a>

## Quickstart

Let's start with the simple example of drag-and-drop behaviour. An entity that can be dragged has two states: idle and dragging. If the entity is in an idle state, and it receives a mousedown event, then it starts dragging. While dragging, if it receives a mousemove event, then it changes its position. Also while dragging, when it receives a mouseup event, it returns to the idle state.

This natural-language description of behaviour can be described using the following simple state machine:

![Drag and Drop](http://jbeard4.github.com/SCION/img/drag_and_drop.png)

This state machine could be written in SCXML as follows:

```xml
<scxml 
	xmlns="http://www.w3.org/2005/07/scxml"
	version="1.0"
	profile="ecmascript"
	initial="idle">

	<state id="idle">
		<transition event="mousedown" target="dragging"/>
	</state>

	<state id="dragging">
		<transition event="mouseup" target="idle"/>
		<transition event="mousemove" target="dragging"/>
	</state>

</scxml>
```

One can add action code in order to script an SVG DOM element, so as to change its transform attribute on mousemove events:

```html
<scxml 
    xmlns="http://www.w3.org/2005/07/scxml"
    version="1.0"
    profile="ecmascript">

    <datamodel>
        <data id="firstEvent"/>
        <data id="eventStamp"/>
        <data id="rectNode"/>
        <data id="rectX"/>
        <data id="rectY"/>
    </datamodel>

    <state id="initial-default">
        <transition event="init" target="idle">
            <assign location="rectNode" expr="_event.data"/>
            <assign location="rectX" expr="0"/>
            <assign location="rectY" expr="0"/>
        </transition>
    </state>

    <state id="idle">
        <onentry>
            <script>
                rectNode.textContent='idle';
            </script>
        </onentry>

        <transition event="mousedown" target="dragging">
            <assign location="firstEvent" expr="_event.data"/>
            <assign location="eventStamp" expr="_event.data"/>
        </transition>
    </state>

    <state id="dragging">
        <onentry>
            <script>
                rectNode.textContent='dragging';
            </script>
        </onentry>

        <transition event="mouseup" target="idle"/>

        <transition event="mousemove" target="dragging">
            <script>
                var dx = eventStamp.clientX - _event.data.clientX;
                var dy = eventStamp.clientY - _event.data.clientY;

                //note that rectNode, rectX and rectY are all exposed
                //from the datamodel as local variables
                rectNode.style.left = rectX -= dx;
                rectNode.style.top = rectY -= dy;
            </script>
            <assign location="eventStamp" expr="_event.data"/>
        </transition>
    </state>

</scxml>
```
There are then 7 steps that must be performed to go from an SCXML document to a working state machine instance that is consuming DOM events and scripting web content on a web page:

1. Get the SCXML document.
2. Convert the XML to a JsonML object.
3. Transform the JsonML object so that it is in a more convenient form for interpretation.
4. Initialize the transformed JsonML to a "model" object. This step essentially converts id labels to object references, parses JavaScript scripts and expressions embedded in the SCXML as JavaScript functions, and does some validation for correctness. 
5. Use the Statecharts object model to instantiate the SCION interpreter.
6. Connect relevant event listeners to the statechart instance.
7. Call the `start` method on the new interpreter instance to start execution of the statechart.

``` html
<html>
    <head>
        <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
        <script src="https://raw.github.com/mckamey/jsonml/master/jsonml-dom.js"></script>
        <script src="http://cdnjs.cloudflare.com/ajax/libs/es5-shim/1.2.4/es5-shim.min.js"></script>
        <script type="text/javascript" src="http://jbeard4.github.com/SCION/builds/latest/scion.js"></script>
        <script>
            var scion = require('scion');

            $(document).ready(function(){
                var rect = document.getElementById("rect");

                //step 1 - get the scxml document
                $.get("drag-and-drop.xml",function(scxmlToTransform){

                    //step 2 - transform the scxml document to JSON
                    var arr = JsonML.parseDOM(scxmlToTransform);
                    var scxmlJson = arr[1];

                    //step 3 - transform the parsed JSON model so it is friendlier to interpretation
                    var annotatedScxmlJson = scion.annotator.transform(scxmlJson);

                    //step 4 - initialize sc object model
                    var model = scion.json2model(annotatedScxmlJson);

                    //step 5 - instantiate statechart
                    var interpreter = new scion.scxml.BrowserInterpreter(model);

                    interpreter.start();
                    interpreter.gen({name:"init",data:rect});

                    function handleEvent(e){
                        e.preventDefault();
                        interpreter.gen({name : e.type,data: e});
                    }

                    //step 6 - connect all relevant event listeners
                    $(rect).mousedown(handleEvent);
                    $(document.documentElement).bind("mouseup mousemove",handleEvent);
                },"xml");
            });
        </script>
    </head>
    <body>
        <div id="rect"/>
    </body>
</html>
```

Note that while jQuery is used in this example to handle AJAX and DOM scripting, the SCION interpreter does not have any dependencies on jQuery or the browser environment in general, so any other JavaScript library could be used for this purpose instead. SCION does use ES5 features, such as functional array methods (e.g. Array.prototype.reduce), Object.create and Function.prototype.bind, so the ES5-shim library is needed in order to make SCION compatible with JavaScript interpreters that do not implement these features.

You can run the demo live [here](http://jbeard4.github.com/SCION/demos/drag-and-drop/drag-and-drop.html).

<a name="multiple_statechart_instances"></a>

## Multiple Statechart Instances

Here is an example that dynamically creates and connects a new DOM node and state machine instance in response to user button click events. Steps 1-4, described above, only need to be performed once, as the model object can be used to instantiate multiple statechart instances.

```html
<html>
    <head>
        <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
        <script src="https://raw.github.com/mckamey/jsonml/master/jsonml-dom.js"></script>
        <script src="http://cdnjs.cloudflare.com/ajax/libs/es5-shim/1.2.4/es5-shim.min.js"></script>
        <script type="text/javascript" src="http://jbeard4.github.com/SCION/builds/latest/scion-min.js"></script>
        <script>
            // just for fun, random color generator, courtesy of 
            // http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript
            function get_random_color() {
                var letters = '0123456789ABCDEF'.split('');
                var color = '#';
                for (var i = 0; i < 6; i++ ) {
                    color += letters[Math.round(Math.random() * 15)];
                }
                return color;
            }

            function createNewRect(){
                //do DOM stuff - create new div
                var div = document.createElement("div");
                div.style.backgroundColor = get_random_color();
                document.body.appendChild(div);
                
                return div;
            }

            var scion = require('scion');

            $(document).ready(function(){

                var elementButton = $("#elementButton");

                //step 1 - get the scxml document
                jQuery.get("drag-and-drop.xml" , function(scxmlToTransform){

                    //step 2 - transform scxmlToTransform to JSON
                    var arr = JsonML.parseDOM(scxmlToTransform);
                    var scxmlJson = arr[1];

                    //step 3 - transform the parsed JSON model so it is friendlier to interpretation
                    var annotatedScxmlJson = scion.annotator.transform(scxmlJson);

                    //step 4 - initialize sc object model
                    var model = scion.json2model(annotatedScxmlJson);

                    //hook up button UI control
                    var interpreters = [];
                    elementButton.click(function(e){

                        //step 5 - instantiate statechart
                        var interpreter = new scion.scxml.BrowserInterpreter(model);

                        var div = createNewRect();

                        //step 6 - connect relevant event listeners
                        $(div).mousedown(function(e){
                            e.preventDefault();
                            interpreter.gen({name : e.type,data: e});
                        });

                        interpreters.push(interpreter); 

                        //step 7 - start statechart
                        interpreter.start()

                        //step 8 - initialize his variables by sending an "init" event and passing the nodes in as data
                        interpreter.gen({name : "init", data : div});

                    });

                    //the root element handles mousemove and mouseup events and dispatches the event to all individual statecharts
                    $(document.documentElement).bind("mousemove mouseup",function(e){
                        e.preventDefault();
                        interpreters.forEach(function(interpreter){
                            interpreter.gen({name : e.type,data: e});
                        });
                    });
                },"xml");
            });
        </script>
    </head>
    <body>
        <button id="elementButton" style="position:absolute;bottom:0px;left:0px;">Make draggable SVG Element</button>
    </body>
</html>


```

See this demo live [here](http://jbeard4.github.com/SCION/demos/drag-and-drop/drag-and-drop2.html).

<a name="advancedexamples"></a>

## Advanced Examples 

Drag and drop is a simple example of UI behaviour. Statecharts are most valuable for describing user interfaces that involve a more complex notion of state.

A more advanced example can be seen [here](http://jbeard4.github.com/SCION/demos/drawing-tool/drawing-tool.html).

It is described in detail in the source code of the page.

<a name="useinnode.js"></a>

# Use in node.js 

<a name="installation"></a>

## Installation 

```bash
npm install scion xml2jsonml
```
<a name="example"></a>

## Example 

The same 7 steps are performed in node.js as those described in section [Quickstart](#quickstart).

```javascript
var xml2jsonml = require('xml2jsonml'),
    scion = require('scion');

//1 - 2. get the xml file and convert it to jsonml
xml2jsonml.parseFile('basic1.scxml',function(err,scxmlJson){

    if(err){
        throw err;
    }

    //3. annotate jsonml
    var annotatedScxmlJson = scion.annotator.transform(scxmlJson,true,true,true,true);

    //4. Convert the SCXML-JSON document to a statechart object model. This step essentially converts id labels to object references, parses JavaScript scripts and expressions embedded in the SCXML as js functions, and does some validation for correctness. 
    var model = scion.json2model(annotatedScxmlJson); 
    console.log("model",model);

    //5. Use the statechart object model to instantiate an instance of the statechart interpreter. Optionally, we can pass to the construct an object to be used as the context object (the 'this' object) in script evaluation. Lots of other parameters are available.
    var interpreter = new scion.scxml.NodeInterpreter(model);
    console.log("interpreter",interpreter);

    //6. We would connect relevant event listeners to the statechart instance here.

    //7. Call the start method on the new intrepreter instance to start execution of the statechart.
    interpreter.start();

    //let's test it by printing current state
    console.log("initial configuration",interpreter.getConfiguration());

    //send an event, inspect new configuration
    console.log("sending event t");
    interpreter.gen({name : "t"});

    console.log("next configuration",interpreter.getConfiguration());
});

```

See [scion-demos/nodejs](https://github.com/jbeard4/scion-demos/tree/master/nodejs) for a complete example of this, as well as [scion-demos/node-repl](https://github.com/jbeard4/scion-demos/tree/master/node-repl) and [scion-demos/node-web-repl](https://github.com/jbeard4/scion-demos/tree/master/node-web-repl) for other reduced demonstrations.



<a name="useinrhino"></a>

# Use in Rhino 

SCION works well on Rhino, but this still needs to be documented.

<a name="scionsemantics"></a>

# SCION Semantics 

SCION takes many ideas from the SCXML standard. In particular, it reuses the syntax of SCXML, but changes some of the semantics.

* If you're already familiar with SCXML, and want a high-level overview of similarities and differences between SCION and SCXML, start here: [SCION vs. SCXML Comparison](https://github.com/jbeard4/SCION/wiki/SCION-vs.-SCXML-Comparison).
* If you're a specification implementer or a semanticist, and would like the details of the SCION semantics, start here: [SCION Semantics](https://github.com/jbeard4/SCION/wiki/Scion-Semantics).

<a name="license"></a>

# License 

Apache License, version 2.0.

<a name="support"></a>

# Support

[Mailing list](https://groups.google.com/group/scion-dev)

<a name="otherresources"></a>

# Other Resources

* [SCION Demos](https://github.com/jbeard4/scion-demos)
* [Table describing which SCXML tags are supported](https://github.com/jbeard4/SCION/wiki/SCION-Implementation-Status)
* [Project Background](https://github.com/jbeard4/SCION/wiki/Project-Background)

<a name="relatedwork"></a>

# Related Projects

* [SCXML Test Framework](https://github.com/jbeard4/scxml-test-framework)
* [SCXML Commons](http://commons.apache.org/scxml/)
* [PySCXML](http://code.google.com/p/pyscxml/) 
