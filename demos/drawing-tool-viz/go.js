$(document).ready(function(){

    //hook up minimal console api
    if(typeof console == "undefined"){
        console = {};
        ["log","info","error","dirxml"].forEach(function(m){console[m] = console[m] || function(){}; });
    } 

    var scxmlns = "http://www.w3.org/2005/07/scxml";
    var svgns = "http://www.w3.org/2000/svg";

    $("#toolbarDiv").svg({
        onLoad:function(toolbar){
            $(toolbar.root()).attr({
                "width":"150px",
                "height":"50px"
            });

            $(document.body).svg({
                onLoad:function(svg){

                    $(svg.root()).attr({
                        "width":"100%",
                        "height":"100%"
                    });

                    var toolbarOutlineRect = toolbar.rect(0,0,150,50,{
                        fill:"white", 
                        stroke:"black"
                    }) ;

                    var transformButton = toolbar.group();

                    var transformButtonBackground = toolbar.rect(transformButton,0,0,50,50,{
                        "class":"background"
                    });

                    //TODO: make proper icon
                    var transformButtonIcon = toolbar.path(transformButton,"M 10.020877,9.916493 10.125261,39.874739 16.962422,26.878914 29.958246,39.87474 39.979123,29.958246 26.983298,16.858038 40.083507,9.916493 l -30.06263,0 z",{
                        fill:"black",
                        stroke:"black"
                    });
                    
                    var rectButton = toolbar.group({"transform":"translate(50,0)"});
                    var rectButtonBackground = toolbar.rect(rectButton,0,0,50,50,{ 
                        "class":"background"
                    });
                    var rectButtonIcon = toolbar.rect(rectButton,10,10,30,30,{ 
                        fill:"red", 
                        stroke:"black"
                    });

                    var ellipseButton = toolbar.group({"transform":"translate(100,0)"});

                    var ellipseButtonBackground = toolbar.rect(ellipseButton,0,0,50,50,{
                        "class":"background"
                    });

                    var ellipseButtonIcon = toolbar.circle(ellipseButton,25,25,15,{
                        fill:"blue",
                        stroke:"black"
                    });

                    //workaround for webkit: svg root element does not receive events on its own, 
                    //so we create a white background rect, and proxy events to svg element
                    /*
                    if($.browser.webkit){
                         var backgroundRect = svg.rect(0,0,"100%","100%",{
                            stroke:"none",
                            fill:"white"
                        }) 
                        console.log(backgroundRect);

                        $(["mousedown","mouseup","mousemove"]).each(function(index,eventName){
                            backgroundRect.addEventListener(eventName,function(e){
                                svg.root().dispatchEvent(e);
                            },false)
                        });
                    }
                    */

                    var scaleHandle = svg.path("M 0 0 L -4 6 L -2 6 L -2 12 L -4 12 L 0 18 L 4 12 L 2 12 L 2 6 L 4 6 L 0 0 z",{
                        transform:"rotate(-45)",
                        visibility:"hidden"
                    });

                    var rotationHandle = svg.path("M 12 0 L 17 5 L 15 5 Q 15 15 5 15 L 5 17 L 0 12 L 5 7 L 5 9 Q 9 9 9 5 L 7 5 L 12 0 z",{
                        visibility:"hidden",
                        transform:"translate(0,0)"
                    });


                    var scion = require('scion');
                    //the steps 1-7 referenced here are described in full detail in src/main/coffeescript/util/browser/parseOnLoad.coffee
                    function hookUpDOMEvents(node,interpreter){
                        //hook up DOM events
                        ["mousedown","mouseup","mousemove"].forEach(function(eventName){
                            node.addEventListener(eventName,function(e){
                                e.preventDefault();
                                interpreter.gen({name : eventName,data : e});
                            },false);
                        });
                    }

                    $.get('behaviour/canvas.xml',function(scxmlDoc){

                        var viz = $('#viz');
                        ScxmlViz(viz[0],scxmlDoc,600,600,{hideTransitionLabels:true});

                        var listener = {
                            onEntry : function(stateId){
                                if(stateId[0] === '$') return;

                                d3.select('#' + stateId).classed('highlighted',true);
                            },
                            onExit : function(stateId){
                                if(stateId[0] === '$') return;

                                d3.select('#' + stateId).classed('highlighted',false);
                            }
                        };


                        //TODO: use documentToModel
                        scion.urlToModel("behaviour/canvas.xml", function(err,model){


                            if(err) throw err;

                            //instantiate statechart
                            var interpreter = new scion.SCXML(model,{logStatesEnteredAndExited:true});
                            
                            svg.statechart = interpreter;   //hook up dom node reference

                            interpreter.registerListener(listener);

                            //start statechart
                            interpreter.start();

                            hookUpDOMEvents(svg.root(),interpreter);
                            hookUpDOMEvents(toolbar.root(),interpreter);
                            
                            //pass in reference to rect
                            interpreter.gen({name : "init", data : {    
                                svg:svg,
                                scaleHandle:scaleHandle,
                                rotationHandle:rotationHandle,
                                ellipseButton:ellipseButton,
                                rectButton:rectButton,
                                transformButton:transformButton,
                                ellipseIcon:ellipseButtonIcon,
                                rectIcon:rectButtonIcon,
                                transformIcon:transformButtonIcon 
                            }});     
                        });
                    },'xml');
                }
            });
        }
    });

});

