//Generated on 2017-9-20 12:40:48 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
var Var1;
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
  Var1 = $serializedDatamodel["Var1"];
}
function $serializeDatamodel(){
   return {
  "Var1" : Var1
   };
}
function $senddata_l8_c6(_event){
return {
};
};
$senddata_l8_c6.tagname='send';
$senddata_l8_c6.line=8;
$senddata_l8_c6.column=6;
function $send_l8_c6(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "s0Event",
  data: $senddata_l8_c6.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs(null),
  type: "http://www.w3.org/TR/scxml/#SCXMLEventProcessor",
       });
};
$send_l8_c6.tagname='send';
$send_l8_c6.line=8;
$send_l8_c6.column=6;
function $expr_l11_c34(_event){
return _event.origin;
};
$expr_l11_c34.tagname='undefined';
$expr_l11_c34.line=11;
$expr_l11_c34.column=34;
function $assign_l11_c5(_event){
Var1 = $expr_l11_c34.apply(this, arguments);
};
$assign_l11_c5.tagname='assign';
$assign_l11_c5.line=11;
$assign_l11_c5.column=5;
function $targetexpr_l19_c76(_event){
return Var1;
};
$targetexpr_l19_c76.tagname='undefined';
$targetexpr_l19_c76.line=19;
$targetexpr_l19_c76.column=76;
function $senddata_l19_c4(_event){
return {
};
};
$senddata_l19_c4.tagname='send';
$senddata_l19_c4.line=19;
$senddata_l19_c4.column=4;
function $send_l19_c4(_event){
var _scionTargetRef = $targetexpr_l19_c76.apply(this, arguments);
     this.send(
{
  target: _scionTargetRef,
  name: "s0Event2",
  data: $senddata_l19_c4.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs(null),
  type: "http://www.w3.org/TR/scxml/#SCXMLEventProcessor",
       });
};
$send_l19_c4.tagname='send';
$send_l19_c4.line=19;
$send_l19_c4.column=4;
function $expr_l25_c56(_event){
return 'pass';
};
$expr_l25_c56.tagname='undefined';
$expr_l25_c56.line=25;
$expr_l25_c56.column=56;
function $log_l25_c30(_event){
this.log("Outcome",$expr_l25_c56.apply(this, arguments));
};
$log_l25_c30.tagname='log';
$log_l25_c30.line=25;
$log_l25_c30.column=30;
function $expr_l26_c56(_event){
return 'fail';
};
$expr_l26_c56.tagname='undefined';
$expr_l26_c56.line=26;
$expr_l26_c56.column=56;
function $log_l26_c30(_event){
this.log("Outcome",$expr_l26_c56.apply(this, arguments));
};
$log_l26_c30.tagname='log';
$log_l26_c30.line=26;
$log_l26_c30.column=30;
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
    $send_l8_c6
   ],
   "transitions": [
    {
     "event": "s0Event",
     "target": "s2",
     "onTransition": $assign_l11_c5
    },
    {
     "event": "*",
     "target": "fail"
    }
   ]
  },
  {
   "id": "s2",
   "$type": "state",
   "onEntry": [
    $send_l19_c4
   ],
   "transitions": [
    {
     "event": "s0Event2",
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
    $log_l25_c30
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l26_c30
   ]
  }
 ],
 "onEntry": [],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test349.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QzNDkudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFRTTtBQUFBLEM7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFU7Ozs7OztBQUc0QixhQUFNLENBQUMsTTs7Ozs7O0FBQXBDLDRDOzs7Ozs7QUFRdUUsVzs7Ozs7O0FBQXhFO0FBQUEsQzs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVTs7Ozs7O0FBTW9ELGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBQzBCLGE7Ozs7OztBQUExQix5RCJ9