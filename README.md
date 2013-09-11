# Overview

SCION provides an implementation of the [W3C SCXML draft specification](http://www.w3.org/TR/scxml/) in JavaScript. SCXML provides a declarative markup for Statecharts, a powerful modelling language for developing **complex, timed, event-driven, state-based systems**, and can offer elegant solutions to many problems faced in development of JavaScript-based applications across various domains. In the browser, SCION can be used to facilitate the development of **rich, web-based user interfaces** with complex behavioural requirements. On the server, SCION can be used to manage **asynchronous control flow**. 

Here are some reasons you might choose to use SCION:

- Liberally licensed (Apache 2.0)
- Standards-based (SCXML)
- **Small**: Only 8kb minified and gzipped.
- **Robust**: automatically tested using a [custom testing framework for SCXML implementations](https://github.com/jbeard4/scxml-test-framework). 
- Maximally **portable** across JavaScript environments: works well in IE6+, modern browsers, node.js, rhino, and various JavaScript shells. 
- **Easy** to learn and use: now with a simple, unified API for Rhino, Node.js and the browser.
- Aggressively **optimized** for performance, memory usage and payload size. More information on this will be forthcoming.

# Quickstart and Simple Use Case

Let's start with the simple example of drag-and-drop behaviour in the browser. You can run this demo live [here](http://jbeard4.github.com/SCION/demos/drag-and-drop/drag-and-drop.html), or on jsfiddle [here](http://jsfiddle.net/jbeard4/mjm72/).

An entity that can be dragged has two states: idle and dragging. If the entity is in an idle state, and it receives a mousedown event, then it starts dragging. While dragging, if it receives a mousemove event, then it changes its position. Also while dragging, when it receives a mouseup event, it returns to the idle state.

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

One can add action code in order to script an HTML DOM element, so as to change its position on mousemove events:

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

There are then **4 steps** that must be performed to go from an SCXML document to a working state machine instance that is consuming DOM events and scripting web content:

1. Get the SCXML document, and convert it to a SCXML "model" object for easier interpretation.
2. Use the SCXML model object to instantiate the SCXML interpreter.
3. Connect relevant event listeners to the SCXML interpreter.
4. Call the `start` method on the SCXML interpreter to start execution of the statechart.


```html
<html>
    <head>
        <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
        <script src="http://cdnjs.cloudflare.com/ajax/libs/es5-shim/1.2.4/es5-shim.min.js"></script>
        <script type="text/javascript" src="http://jbeard4.github.com/SCION/builds/latest/scion-min.js"></script>
        <script>
            $(document).ready(function(){
                var rect = document.getElementById("rect");

                //convert to model
                scion.urlToModel("drag-and-drop.xml",function(err,model){

                    if(err) throw err;

                    //instantiate the interpreter
                    var interpreter = new scion.SCXML(model);

                    //start the interpreter
                    interpreter.start();

                    //send the init event
                    interpreter.gen({name:"init",data:rect});

                    function handleEvent(e){
                        e.preventDefault();
                        interpreter.gen({name : e.type,data: e});
                    }

                    //connect all relevant event listeners
                    $(rect).mousedown(handleEvent);
                    $(document.documentElement).bind("mouseup mousemove",handleEvent);
                });
            });
        </script>
    </head>
    <body>
        <div id="rect"/>
    </body>
</html>
```

# API

## Instantiation

### scion.urlToModel(url,function(err, model){})
### scion.pathToModel(path,function(err, model){})
### scion.documentStringToModel(scxmlDocString,function(err, model){})
### scion.documentToModel(scxmlDocument,function(err, model){})

SCION allows you to instantiate SCXML interpreters from SCXML "model" objects, which are SCXML documents that have been processed for easier interpretation. 
These methods allow you to create an SCXML model from an XML DOM document, document string, or url/path to document.

### new scion.SCXML(model)

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
3. Use SCXML `<send>` element to send SCXML events to web services. Right now, the `<send>` tag is not supported by SCION out of the box. This should be better supported by next release (v0.0.9).
    
### scxml.registerListener({onEntry : function(stateId){}, onExit : function(stateId){}, onTransition : function(sourceStateId,[targetStateIds,...]){}})

Registers a callback to receive notification of state changes, as described above.

Each `onEntry`, `onExit` and `onTransition` callback is optional - if the property is not present, it will be ignored.

Furthermore, for the `onTransition` callback, argument `targetStateIds` will be `null` for targetless transitions, rather than, e.g. an empty array.

# Usage in Browser

Add the following script tags to your web page, which will make SCION available as a global variable `scion`:

```html
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
<script src="http://cdnjs.cloudflare.com/ajax/libs/es5-shim/1.2.4/es5-shim.min.js"></script>
<script type="text/javascript" src="http://jbeard4.github.com/SCION/builds/latest/scion.js"></script>
```

SCION is also available as an AMD module, so if you are using RequireJS in your page, then you can do the following:

```html
<script src="http://cdnjs.cloudflare.com/ajax/libs/es5-shim/1.2.4/es5-shim.min.js"></script>
<script src="http://cdnjs.cloudflare.com/ajax/libs/require-jquery/0.25.0/require-jquery.min.js "></script>

<script type="text/javascript">
  //from inside your script
  require(["http://jbeard4.github.com/SCION/builds/latest/scion-min.js"],function(scion){
    //use SCION here
  });
</script>
```

Note that SCION assumes the presence of jQuery to handle cross-browser XMLHTTPRequest, however an alternative Ajax library could instead be used. This is set up in the following way:

```javascript
    //perform this setup once, before SCION is used
    scion.platformModule.platform.ajax = {
        get : function(url,successCallback,dataType){
            //call your preferred Ajax library here to do HTTP GET
            //if dataType is 'xml', the Ajax response must be parsed as DOM
        },
        post : function(url, data, successCallback, dataType){
            //call your preferred Ajax library here to do HTTP POST
        }
    }; 
```

SCION does not currently use `platform.ajax.post`, but there are plans to use this API in the future to implement SCXML `<send>`.

# Usage in Node.js

Install SCION via npm:

    npm install scion

Or, to get the latest and greatest from Github master:

    cd node_modules/    #cd into wherever your node_modules directory lives
    git clone --recursive git://github.com/jbeard4/SCION.git scion  #this fetches SCION and its git submodule dependencies into directory "scion"
    cd scion && npm install     #this fetches npm package dependencies    

For example usage see [SCION Demos](https://github.com/jbeard4/scion-demos).

# Usage in Rhino

Get it with git:

    git clone --recursive git://github.com/jbeard4/SCION.git

Rhino 1.7R3 supports CommonJS modules, so SCION can be used as follows:

```bash
#just put SCION/lib on your modules path
rhino -modules path/to/SCION/lib -main path/to/your/script.js
```

<a name="scionsemantics"></a>

# Using SCION from Other Languages

Because SCION is implemented in ECMAScript, it has been fairly easy to embed in other programming environments, including:

* Java : [SCION-Java](https://github.com/jbeard4/SCION-Java)
* C# : [SCION.NET](https://github.com/jbeard4/SCION.NET)
* Python : [pySCION](https://github.com/jbeard4/pySCION)

This guide describes how to embed SCION in other JavaScript environments: [Embedding SCION](https://github.com/jbeard4/SCION/wiki/Embedding-SCION)

# SCION Semantics 

SCION takes many ideas from the SCXML standard. In particular, it reuses the syntax of SCXML, but changes some of the semantics.

* If you're already familiar with SCXML, and want a high-level overview of similarities and differences between SCION and SCXML, start here: [SCION vs. SCXML Comparison](https://github.com/jbeard4/SCION/wiki/SCION-vs.-SCXML-Comparison).
* If you're a specification implementer or a semanticist, and would like the details of the SCION semantics, start here: [SCION Semantics](https://github.com/jbeard4/SCION/wiki/Scion-Semantics).

<a name="support"></a>

# Support

[Mailing list](https://groups.google.com/group/scion-dev)

<a name="otherresources"></a>

# Other Resources

* [Custom Actions](https://github.com/jbeard4/SCION/wiki/Custom-Action-Tags)
* [Action Tag Scripting APIs](https://github.com/jbeard4/SCION/wiki/Action-Tag-Scripting-API)
* [SCION Demos](https://github.com/jbeard4/scion-demos)
* [Table describing which SCXML tags are supported](https://github.com/jbeard4/SCION/wiki/SCION-Implementation-Status)
* [Project Background](https://github.com/jbeard4/SCION/wiki/Project-Background)
* [Jacob Beard's Master thesis](http://digitool.library.mcgill.ca/R/Q5UK1QE8RHLBVR46SCL28IJMFDMCLJ75SD9LRM23EH1BCNBUFT-02740?func=results-jump-full&set_entry=000019&set_number=001373&base=GEN01)

<a name="relatedwork"></a>

# Related Projects

* [SCXML Test Framework](https://github.com/jbeard4/scxml-test-framework)
* [SCION-Java](https://github.com/jbeard4/SCION-Java)
* [SCXML Commons](http://commons.apache.org/scxml/)
* [PySCXML](http://code.google.com/p/pyscxml/) 
