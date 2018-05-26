//Generated on 2017-9-20 12:41:29 by the SCION SCXML compiler
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
function $senddata_l5_c4(_event){
return {
};
};
$senddata_l5_c4.tagname='send';
$senddata_l5_c4.line=5;
$senddata_l5_c4.column=4;
function $send_l5_c4(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "event1",
  data: $senddata_l5_c4.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs(null),
       });
};
$send_l5_c4.tagname='send';
$send_l5_c4.line=5;
$send_l5_c4.column=4;
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
  name: "timeout",
  data: $senddata_l6_c4.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs(null),
       });
};
$send_l6_c4.tagname='send';
$send_l6_c4.line=6;
$send_l6_c4.column=4;
function $cond_l10_c35(_event){
return _event.origintype == 'http://www.w3.org/TR/scxml/#SCXMLEventProcessor';
};
$cond_l10_c35.tagname='undefined';
$cond_l10_c35.line=10;
$cond_l10_c35.column=35;
function $expr_l15_c53(_event){
return 'pass';
};
$expr_l15_c53.tagname='undefined';
$expr_l15_c53.line=15;
$expr_l15_c53.column=53;
function $log_l15_c27(_event){
this.log("Outcome",$expr_l15_c53.apply(this, arguments));
};
$log_l15_c27.tagname='log';
$log_l15_c27.line=15;
$log_l15_c27.column=27;
function $expr_l16_c53(_event){
return 'fail';
};
$expr_l16_c53.tagname='undefined';
$expr_l16_c53.line=16;
$expr_l16_c53.column=53;
function $log_l16_c27(_event){
this.log("Outcome",$expr_l16_c53.apply(this, arguments));
};
$log_l16_c27.tagname='log';
$log_l16_c27.line=16;
$log_l16_c27.column=27;
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
    $send_l5_c4,
    $send_l6_c4
   ],
   "transitions": [
    {
     "event": "event1",
     "cond": $cond_l10_c35,
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
    $log_l15_c27
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l16_c27
   ]
  }
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test198.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QxOTgudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUtJO0FBQUEsQzs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFU7Ozs7OztBQUNBO0FBQUEsQzs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFU7Ozs7OztBQUkrQixPQUFDLE1BQU0sQ0FBQyxVLENBQVcsRSxDQUFHLGlEOzs7Ozs7QUFLSixhOzs7Ozs7QUFBMUIseUQ7Ozs7OztBQUMwQixhOzs7Ozs7QUFBMUIseUQifQ==