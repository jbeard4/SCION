#SCION

A Statecharts interpreter/compiler library targeting JavaScript environments.

1\.  [Overview](#overview)  
2\.  [Use in the Browser](#useinthebrowser)  
2.1\.  [Quickstart](#quickstart)  
2.2\.  [More Control](#morecontrol)  
2.3\.  [Advanced usage](#advancedusage)  
3\.  [Use in node.js](#useinnode.js)  
3.1\.  [Installation](#installation)  
3.2\.  [Usage](#usage)  
4\.  [Use in Rhino](#useinrhino)  
5\.  [Ahead-of-time Optimization using Static Analysis](#aheadoftimeoptimizationusingstaticanalysis)  
6\.  [SCION Semantics](#scionsemantics)  
7\.  [Project Status and Supported Environments](#projectstatusandsupportedenvironments)  
8\.  [License](#license)  
9\.  [Support](#support)  
10\.  [Project Background](#projectbackground)  
11\.  [Related Work](#relatedwork)  

<a name="overview"></a>

## 1\. Overview 

Statecharts is a graphical modelling language developed to describe complex, reactive systems. Because of its usefulness for describing complex, timed, reactive, state-based behaviour, it is well-suited for developing rich user interfaces, including user interfaces built on Open Web technologies.

Statecharts was first described by David Harel in the 1987 paper "Statecharts: A Visual Formalism for Complex Systems". Over the years, many different Statecharts variants have been developed, including the W3C SCXML draft specification. SCXML provides an XML-based syntax for describing Statecharts, as well as a step algorithm which defines its executable semantics. 

**StateCharts Interpretation and Optimization eNgine** (SCION) is an implementation of Statecharts in JavaScript. Statecharts are written as XML documents, which are then executed by the SCION interpreter. Furthermore, optimized data structures may be generated ahead-of-time by SCION from the source SCXML document, which may improve memory usage and performance at runtime. 

The SCION project also includes a custom test suite for distributed unit and performance testing of SCXML interpreters.

<a name="useinthebrowser"></a>

## 2\. Use in the Browser

<a name="quickstart"></a>

### 2.1\. Quickstart

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
  profile="ecmascript"
  initial="idle">

  <script>
    function computeTDelta(oldEvent,newEvent){
      //summary:computes the offset between two events; to be later used with this.translate
      var dx = newEvent.clientX - oldEvent.clientX;
      var dy = newEvent.clientY - oldEvent.clientY;

      return {'dx':dx,'dy':dy};
    }

    function translate(rawNode,tDelta){
      var tl = rawNode.transform.baseVal;
      var t = tl.numberOfItems ? 
                tl.getItem(0) : 
                rawNode.ownerSVGElement.createSVGTransform();
      var m = t.matrix;
      var newM = rawNode.ownerSVGElement.
                  createSVGMatrix().
                  translate(tDelta.dx,tDelta.dy).multiply(m);
      t.setMatrix(newM);
      tl.initialize(t);
      return newM;
    }
  </script>

  <datamodel>
    <data id="firstEvent"/>
    <data id="eventStamp"/>
    <data id="tDelta"/>
  </datamodel>

  <state id="idle">
    <transition event="mousedown" target="dragging">
      <assign location="firstEvent" expr="_event.data"/>
      <assign location="eventStamp" expr="_event.data"/>
    </transition>
  </state>

  <state id="dragging">
    <transition event="mouseup" target="idle"/>

    <transition event="mousemove" target="dragging">
      <script>
        tDelta = computeTDelta(eventStamp,_event.data);

        translate(this,tDelta);
      </script>
      <assign location="eventStamp" expr="_event.data"/>
    </transition>
  </state>

</scxml>
```

In order to execute this on a web page, such that the state machine is instantiated, receives DOM events, and is able to script DOM nodes, one may use a tool included with SCION that allows one to embed the statechart directly into the content of the page. 


``` html
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:svg="http://www.w3.org/2000/svg">
  <head>
    <style type="text/css">
      html, body {
        height:100%;
        margin: 0;
        padding: 0;
      }
    </style>
    <script type="text/javascript"
      src="http://cdnjs.cloudflare.com/ajax/libs/require.js/1.0.1/require.min.js"></script>
    <script type="text/javascript"
      src="http://jbeard4.github.com/SCION/builds/scion-browser-0.1.js"></script>
    <script type="text/javascript">
      require(['util/browser/parseOnLoad'],function(parseOnLoad){
        parseOnLoad()
      });
    </script>


  </head>
  <body>
    <svg xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      xmlns:scion="https://github.com/jbeard4/SCION" width="100%" height="99%" >

      <rect width="100" height="100" stroke="black" fill="red"
        id="rectToTranslate" 
        scion:domEventsToConnect="mousedown,mouseup,mousemove">
        <scxml 
          xmlns="http://www.w3.org/2005/07/scxml"
          version="1.0"
          profile="ecmascript"
          initial="idle">

          <script>
            function computeTDelta(oldEvent,newEvent){
              //summary:computes the offset between two events; to be later
              //used with this.translate
              var dx = newEvent.clientX - oldEvent.clientX;
              var dy = newEvent.clientY - oldEvent.clientY;

              return {'dx':dx,'dy':dy};
            }

            function translate(rawNode,tDelta){
              var tl = rawNode.transform.baseVal;
              var t = tl.numberOfItems ? 
                        tl.getItem(0) : 
                        rawNode.ownerSVGElement.createSVGTransform();
              var m = t.matrix;
              var newM = rawNode.ownerSVGElement.
                           createSVGMatrix().
                           translate(tDelta.dx,tDelta.dy).multiply(m);
              t.setMatrix(newM);
              tl.initialize(t);
              return newM;
            }
          </script>

          <datamodel>
            <data id="firstEvent"/>
            <data id="eventStamp"/>
            <data id="tDelta"/>
          </datamodel>

          <state id="idle">
            <transition event="mousedown" target="dragging">
              <assign location="firstEvent" expr="_event.data"/>
              <assign location="eventStamp" expr="_event.data"/>
            </transition>
          </state>

          <state id="dragging">
            <transition event="mouseup" target="idle"/>

            <transition event="mousemove" target="dragging">
              <script>
                tDelta = computeTDelta(eventStamp,_event.data);
                translate(this,tDelta);
              </script>
              <assign location="eventStamp" expr="_event.data"/>
            </transition>
          </state>

        </scxml>
      </rect>
    </svg>
  </body>
</html>
```

Note that, due to limitations in cross-browser compatibility of techniques for embedding XML data in HTML pages, this technique will currently only work for web browsers that support XHTML. In particular, this excludes versions of Internet Explorer before IE9, so this technique is primarily useful for experimentation and demo purposes. A technique that should work well across browsers, including older versions of IE, will be shown below.  The SCION interpreter itself does not have any browser-specific dependencies, and in fact, runs well in a number of JavaScript environments, including Rhino and NodeJS shell environments.

You can run the demo live [here](http://jbeard4.github.com/SCION/demos/drag-and-drop/drag-and-drop.xhtml).

<a name="morecontrol"></a>

### 2.2\. More Control

What if we want to dynamically create state machine instances, and attach them to DOM nodes manually? This takes a bit more code.

There are 7 steps that must be performed to go from an SCXML document to a working state machine instance that is consuming DOM events and scripting web content on a web page:

1. Get the SCXML document.
2. Convert the XML to a JsonML JSON document using XSLT or DOM, and parse the JsonML JSON document to a JsonML JavaScript Object.
3. Annotate and transform the JsonML JavaScript Object so that it is in a more convenient form for interpretation, creating an annotated JsonML JavaScript Object
4. Convert the annotated JsonML JavaScript Object to a Statecharts object model. This step essentially converts id labels to object references, parses JavaScript scripts and expressions embedded in the SCXML as JavaScript functions, and does some validation for correctness. 
5. Use the Statecharts object model to instantiate the SCION interpreter. Optionally, one can pass to the SCION constructor an object to be used as the context object (the object bound to the `this` identifier) in script evaluation. There are many other parameters that can be passed to the constructor, none of which are currently documented.
6. Connect relevant event listeners to the statechart instance.
7. Call the `start` method on the new interpreter instance to start execution of the statechart.

Note that steps 1-3 can be done ahead-of-time, such that the annotated JsonML document can be serialized and sent down the wire, before being downloaded to the browser and parsed, then converted to a Statecharts object model in step 4. 

Here is an example. An SCXML document is downloaded with XMLHttpRequest and initialized. SVG circle nodes can be created dynamically, such that a new state machine is instantiated, listens to the circle node's DOM events, and scripts the circle node's DOM attributes.

```html
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:svg="http://www.w3.org/2000/svg">
  <head>
    <style type="text/css">
      html, body {
        height:100%;
        margin: 0;
        padding: 0;
      }
    </style>
    <!-- we use jquery for jQuery.get and jQuery.globalEval (globalEval can optionally be used by the statechart) -->
    <script
      src="http://cdnjs.cloudflare.com/ajax/libs/jquery/1.7/jquery.min.js"
      type="text/javascript"></script> 
    <script type="text/javascript"
      src="http://cdnjs.cloudflare.com/ajax/libs/require.js/1.0.1/require.min.js"></script>
    <script type="text/javascript"
      src="http://jbeard4.github.com/SCION/builds/scion-browser-0.1.js"></script>
  </head>
  <body>
    <svg xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink" width="100%" height="99%"
      id="canvas"/>

    <button id="elementButton"
      style="position:absolute;bottom:0px;left:0px;">Make draggable SVG
      Element</button>

    <script>
      var svgCanvas = document.getElementById("canvas"), 
        elementButton = document.getElementById("elementButton"),
        SVG_NS = "http://www.w3.org/2000/svg";

      //the steps 1-7 referenced here are described in full detail in
      //src/main/coffeescript/util/browser/parseOnLoad.coffee
      require(["scxml/SCXML",
                "util/annotate-scxml-json",
                "scxml/json2model",
                "scxml/event",
                "lib/JsonML_DOM"],function(scxml,jsonAnnotator,json2model,Event,JsonML){
        var BrowserInterpreter = scxml.BrowserInterpreter;

        //step 1 - get the scxml document
        jQuery.get("drag-and-drop2.xml" , function(scxmlToTransform, textStatus, jqXHR){

          console.log("scxmlToTransform",scxmlToTransform);

          //step 2 - transform scxmlToTransform to JSON
          var arr = JsonML.parseDOM(scxmlToTransform);
          var scxmlJson = arr[1];
          console.log("scxmlJson",scxmlJson);

          //step 3 - transform the parsed JSON model so it is friendlier to interpretation
          var annotatedScxmlJson = jsonAnnotator(scxmlJson);
          console.log("annotatedScxmlJson",annotatedScxmlJson);

          //step 4 - initialize sc object model
          var model = json2model(annotatedScxmlJson);
          console.log("model",model);


          //just for fun, random color generator, courtesy of
          //http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript
          function get_random_color() {
            var letters = '0123456789ABCDEF'.split('');
            var color = '#';
            for (var i = 0; i &lt; 6; i++ ) {
              color += letters[Math.round(Math.random() * 15)];
            }
            return color;
          }

          //hook up button UI control
          elementButton.addEventListener("click",function(e){

            //do DOM stuff- create new blue circle
            var newGNode = document.createElementNS(SVG_NS,"g");
            var newTextNode = document.createElementNS(SVG_NS,"text");
            var newNode = document.createElementNS(SVG_NS,"circle");
            newNode.setAttributeNS(null,"cx",50);
            newNode.setAttributeNS(null,"cy",50);
            newNode.setAttributeNS(null,"r",50);
            newNode.setAttributeNS(null,"fill",get_random_color());
            newNode.setAttributeNS(null,"stroke","black");

            newGNode.appendChild(newNode);
            newGNode.appendChild(newTextNode);

            //step 5 - instantiate statechart
            var interpreter = new BrowserInterpreter(model,
              {
                //globalEval is used to execute any top-level script children
                //of the scxml element
                //use of jQuery's global-eval is optional
                //TODO: cite that blog post about global-eval
                globalEval : jQuery.globalEval  
              });
            console.log("interpreter",interpreter);

            //step 6 - connect all relevant event listeners
            ["mousedown","mouseup","mousemove"].forEach(function(eventName){
              newGNode.addEventListener( eventName, function(e){
                e.preventDefault();
                interpreter.gen(new Event(eventName,e))
              },false)
            });

            //step 7 - start statechart
            interpreter.start()

            //step 8 - initialize his variables by sending an "init" event and
            //passing the nodes in as data
            interpreter.gen(
              new Event("init",{rawNode:newGNode,textNode:newTextNode}));

            svgCanvas.appendChild(newGNode);
          },false);
      
        },"xml");
      });
    </script>
  </body>
</html>
```

See this demo live [here](http://jbeard4.github.com/SCION/demos/drag-and-drop/drag-and-drop2.xhtml).

<a name="advancedusage"></a>

### 2.3\. Advanced usage 

Drag and drop is a simple example of UI behaviour. Statecharts are most valuable for describing user interfaces that involve a more complex notion of state.

A more advanced example can be seen [here](http://jbeard4.github.com/SCION/demos/drawing-tool/drawing-tool.html).

It is described in detail in the source code of the page.

<a name="useinnode.js"></a>

## 3\. Use in node.js 

<a name="installation"></a>

### 3.1\. Installation 

```bash
npm install -g scion
```

<a name="usage"></a>

### 3.2\. Usage 

node.js doesn't have great support for XML, so SCXML source must be converted ahead-of-time to annotated JSON. SCION ships with command-line tools to facilitate this. `scxml-to-json`  converts SCXML documents to JSON in the JsonML format, and `annotate-scxml-json` converts the JsonML document to a format more suitable for interpretation at runtime.

```bash
scxml-to-json input.scxml | annotate-scxml-json > output.json
```

The output json file can then be parsed in node.js, and everything works as in the browser environment:

```javascript
var scion = require('scion'), 
	fs=require('fs');

//step 1 - get the annotated json document
var annotatedScxmlJson = JSON.parse(fs.readFileSync('output.json','utf8'));

//step 2 - initialize sc object model
var model = scion.json2model(annotatedScxmlJson);

//step 3 - instantiate statechart
var interpreter = new scion.NodeInterpreter(model);

interpreter.start();

console.log(interpreter.getConfiguration());

interpreter.gen(new scion.Event('t'));

console.log(interpreter.getConfiguration());
```

See `src/demo/nodejs` for a complete example of this.

<a name="useinrhino"></a>

## 4\. Use in Rhino 

SCION works well on Rhino, but this still needs to be documented.

<a name="aheadoftimeoptimizationusingstaticanalysis"></a>

## 5\. Ahead-of-time Optimization using Static Analysis 

SCION also supports generating optimized data structures ahead-of-time using static analysis, which may enhance performance at runtime. This feature still needs to be documented.

<a name="scionsemantics"></a>

## 6\. SCION Semantics 

SCION takes many ideas from the SCXML standard. In particular, it reuses the syntax of SCXML, but changes some of the semantics.

* If you're already familiar with SCXML, and want a high-level overview of similarities and differences between SCION and SCXML, start here: [SCION vs. SCXML Comparison](https://github.com/jbeard4/SCION/wiki/SCION-vs.-SCXML-Comparison).
* If you're a specification implementer or a semanticist, and would like the details of the SCION semantics, start here: [SCION Semantics](https://github.com/jbeard4/SCION/wiki/Scion-Semantics).

<a name="projectstatusandsupportedenvironments"></a>

## 7\. Project Status and Supported Environments

SCION has been thoroughly tested in recent versions of Chromium, Firefox, and Opera on Ubuntu 10.04, as well as Internet Explorer 9 and recent Firefox, Chrome, Opera, and Safari on Windows 7 x64. SCION has also been thoroughly tested under multiple shell environments, including Node and Rhino, as well as the default shell environments included with v8, spidermonkey and jsc.

<a name="license"></a>

## 8\. License 

Libraries included in lib/ are published under their respective licenses.

Everything else is licensed under the Apache License, version 2.0.

<a name="support"></a>

## 9\. Support

[Mailing list](https://groups.google.com/group/scion-dev)

<a name="projectbackground"></a>

## 10\. Project Background 

SCION is the third major iteration in an effort to create a Statecharts interpreter/compiler that would be well-suited for use in the browser environment. The first iteration was the development of a JavaScript backend to the [SCC Statecharts compiler](http://msdl.cs.mcgill.ca/people/tfeng/uml/scc/) written by Thomas Feng. The second iteration was [scxml-js](http://commons.apache.org/sandbox/gsoc/2010/scxml-js/), which was started as course project for [COMP-621 - Program Analysis and Transformations](http://www.sable.mcgill.ca/~hendren/621/) under Prof. Laurie Hendren, and continued as a project for Google Summer of Code 2010, under the Apache Software Foundation, with Rahul Akolkar serving as project mentor. I decided to expand this work toward the completion of a master thesis at McGill University under Prof. Hans Vangheluwe. The decision was made to rewrite scxml-js from the ground up, for reasons described [here](http://blog.echo-flow.com/2011/06/08/masters-thesis-update-2-new-statecharts-project/), and the new project was named SCION. 

Right now, I'm still working on my master thesis, but believe SCION is ready for general use. 

My thanks go out to everyone who has supported me in this endeavour.


<a name="relatedwork"></a>

## 11\. Related Work 

* [SCXML Commons](http://commons.apache.org/scxml/)
* [PySCXML](http://code.google.com/p/pyscxml/) 

