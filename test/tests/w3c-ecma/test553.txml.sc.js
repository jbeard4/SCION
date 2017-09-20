//Generated on 2017-9-20 12:40:45 by the SCION SCXML compiler
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
function $senddata_l7_c4(_event){
return {
};
};
$senddata_l7_c4.tagname='send';
$senddata_l7_c4.line=7;
$senddata_l7_c4.column=4;
function $delayexpr_l7_c36(_event){
return '1s';
};
$delayexpr_l7_c36.tagname='undefined';
$delayexpr_l7_c36.line=7;
$delayexpr_l7_c36.column=36;
function $send_l7_c4(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "timeout",
  data: $senddata_l7_c4.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs($delayexpr_l7_c36.apply(this, arguments)),
       });
};
$send_l7_c4.tagname='send';
$send_l7_c4.line=7;
$send_l7_c4.column=4;
function $senddata_l9_c4(_event){
return {
"foo":foo};
};
$senddata_l9_c4.tagname='send';
$senddata_l9_c4.line=9;
$senddata_l9_c4.column=4;
function $send_l9_c4(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "event1",
  data: $senddata_l9_c4.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs(null),
       });
};
$send_l9_c4.tagname='send';
$send_l9_c4.line=9;
$send_l9_c4.column=4;
function $expr_l19_c53(_event){
return 'pass';
};
$expr_l19_c53.tagname='undefined';
$expr_l19_c53.line=19;
$expr_l19_c53.column=53;
function $log_l19_c27(_event){
this.log("Outcome",$expr_l19_c53.apply(this, arguments));
};
$log_l19_c27.tagname='log';
$log_l19_c27.line=19;
$log_l19_c27.column=27;
function $expr_l20_c53(_event){
return 'fail';
};
$expr_l20_c53.tagname='undefined';
$expr_l20_c53.line=20;
$expr_l20_c53.column=53;
function $log_l20_c27(_event){
this.log("Outcome",$expr_l20_c53.apply(this, arguments));
};
$log_l20_c27.tagname='log';
$log_l20_c27.line=20;
$log_l20_c27.column=27;
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
    $send_l7_c4,
    $send_l9_c4
   ],
   "transitions": [
    {
     "event": "timeout",
     "target": "pass"
    },
    {
     "event": "event1",
     "target": "fail"
    }
   ]
  },
  {
   "id": "pass",
   "$type": "final",
   "onEntry": [
    $log_l19_c27
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l20_c27
   ]
  }
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test553.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3Q1NTMudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU9JO0FBQUEsQzs7Ozs7O0FBQWdDLFc7Ozs7OztBQUFoQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVTs7Ozs7O0FBRUE7QUFBQSxVOzs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVTs7Ozs7O0FBVWlELGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBQzBCLGE7Ozs7OztBQUExQix5RCJ9