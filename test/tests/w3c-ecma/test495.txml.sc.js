//Generated on 2017-9-20 12:40:01 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
function getDelayInMs(delayString){
    if(typeof delayString === 'string') {
        if (delayString.slice(-2) === "ms") {
            return parseFloat(delayString.slice(0, -2));
        } else if (delayString.slice(-1) === "s") {
            return parseFloat(delayString.slice(0, -1)) * 1000;
        } else if (delayString.slice(-1) === "m") {
            return parseFloat(delayString.slice(0, -1)) * 1000 * 60;
        } else {
            return parseFloat(delayString);
        }
    }else if (typeof delayString === 'number'){
        return delayString;
    }else{
        return 0;
    }
}
function $deserializeDatamodel($serializedDatamodel){

}
function $serializeDatamodel(){
   return {

   };
}
function $senddata_l6_c4(_event){
return {
};
};
$senddata_l6_c4.tagname='send';
$senddata_l6_c4.line=6;
$senddata_l6_c4.column=4;
function $send_l6_c4(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "event1",
  data: $senddata_l6_c4.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs(null),
  type: "http://www.w3.org/TR/scxml/#SCXMLEventProcessor",
       });
};
$send_l6_c4.tagname='send';
$send_l6_c4.line=6;
$send_l6_c4.column=4;
function $senddata_l7_c6(_event){
return {
};
};
$senddata_l7_c6.tagname='send';
$senddata_l7_c6.line=7;
$senddata_l7_c6.column=6;
function $send_l7_c6(_event){
var _scionTargetRef = "#_internal";
     this.send(
{
  target: _scionTargetRef,
  name: "event2",
  data: $senddata_l7_c6.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs(null),
  type: "http://www.w3.org/TR/scxml/#SCXMLEventProcessor",
       });
};
$send_l7_c6.tagname='send';
$send_l7_c6.line=7;
$send_l7_c6.column=6;
function $expr_l19_c56(_event){
return 'pass';
};
$expr_l19_c56.tagname='undefined';
$expr_l19_c56.line=19;
$expr_l19_c56.column=56;
function $log_l19_c30(_event){
this.log("Outcome",$expr_l19_c56.apply(this, arguments));
};
$log_l19_c30.tagname='log';
$log_l19_c30.line=19;
$log_l19_c30.column=30;
function $expr_l20_c56(_event){
return 'fail';
};
$expr_l20_c56.tagname='undefined';
$expr_l20_c56.line=20;
$expr_l20_c56.column=56;
function $log_l20_c30(_event){
this.log("Outcome",$expr_l20_c56.apply(this, arguments));
};
$log_l20_c30.tagname='log';
$log_l20_c30.line=20;
$log_l20_c30.column=30;
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "{http://www.w3.org/2000/xmlns/}conf": "http://www.w3.org/2005/scxml-conformance",
 "initial": "s0",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "s0",
   "$type": "state",
   "onEntry": [
    $send_l6_c4,
    $send_l7_c6
   ],
   "transitions": [
    {
     "event": "event1",
     "target": "fail"
    },
    {
     "event": "event2",
     "target": "s1"
    }
   ]
  },
  {
   "id": "s1",
   "$type": "state",
   "transitions": [
    {
     "event": "event1",
     "target": "pass"
    },
    {
     "event": "*",
     "target": "fail"
    }
   ]
  },
  {
   "id": "pass",
   "$type": "final",
   "onEntry": [
    $log_l19_c30
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l20_c30
   ]
  }
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test495.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3Q0OTUudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU1JO0FBQUEsQzs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVTs7Ozs7O0FBQ0U7QUFBQSxDOzs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVOzs7Ozs7QUFZa0QsYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUFDMEIsYTs7Ozs7O0FBQTFCLHlEIn0=