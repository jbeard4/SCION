//Generated on 2017-9-20 12:40:24 by the SCION SCXML compiler
function machineNameConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'machineName';
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
function $senddata_l5_c6(_event){
return {
};
};
$senddata_l5_c6.tagname='send';
$senddata_l5_c6.line=5;
$senddata_l5_c6.column=6;
function $send_l5_c6(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "foo",
  data: $senddata_l5_c6.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs(null),
       });
};
$send_l5_c6.tagname='send';
$send_l5_c6.line=5;
$send_l5_c6.column=6;
function $targetexpr_l8_c35(_event){
return _event.origin;
};
$targetexpr_l8_c35.tagname='undefined';
$targetexpr_l8_c35.line=8;
$targetexpr_l8_c35.column=35;
function $senddata_l8_c6(_event){
return {
};
};
$senddata_l8_c6.tagname='send';
$senddata_l8_c6.line=8;
$senddata_l8_c6.column=6;
function $typeexpr_l8_c60(_event){
return _event.origintype;
};
$typeexpr_l8_c60.tagname='undefined';
$typeexpr_l8_c60.line=8;
$typeexpr_l8_c60.column=60;
function $send_l8_c6(_event){
var _scionTargetRef = $targetexpr_l8_c35.apply(this, arguments);
     this.send(
{
  target: _scionTargetRef,
  name: "bar",
  data: $senddata_l8_c6.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs(null),
  type: $typeexpr_l8_c60.apply(this, arguments),
       });
};
$send_l8_c6.tagname='send';
$send_l8_c6.line=8;
$send_l8_c6.column=6;
function $senddata_l15_c5(_event){
return {
};
};
$senddata_l15_c5.tagname='send';
$senddata_l15_c5.line=15;
$senddata_l15_c5.column=5;
function $send_l15_c5(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "baz",
  data: $senddata_l15_c5.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs(null),
       });
};
$send_l15_c5.tagname='send';
$send_l15_c5.line=15;
$send_l15_c5.column=5;
function $expr_l21_c56(_event){
return 'pass';
};
$expr_l21_c56.tagname='undefined';
$expr_l21_c56.line=21;
$expr_l21_c56.column=56;
function $log_l21_c30(_event){
this.log("Outcome",$expr_l21_c56.apply(this, arguments));
};
$log_l21_c30.tagname='log';
$log_l21_c30.line=21;
$log_l21_c30.column=30;
function $expr_l22_c56(_event){
return 'fail';
};
$expr_l22_c56.tagname='undefined';
$expr_l22_c56.line=22;
$expr_l22_c56.column=56;
function $log_l22_c30(_event){
this.log("Outcome",$expr_l22_c56.apply(this, arguments));
};
$log_l22_c30.tagname='log';
$log_l22_c30.line=22;
$log_l22_c30.column=30;
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "{http://www.w3.org/2000/xmlns/}conf": "http://www.w3.org/2005/scxml-conformance",
 "initial": "s0",
 "name": "machineName",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "s0",
   "$type": "state",
   "onEntry": [
    $send_l5_c6
   ],
   "transitions": [
    {
     "event": "foo",
     "target": "s1",
     "onTransition": $send_l8_c6
    },
    {
     "event": "*",
     "target": "fail"
    }
   ]
  },
  {
   "id": "s1",
   "$type": "state",
   "onEntry": [
    $send_l15_c5
   ],
   "transitions": [
    {
     "event": "bar",
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
    $log_l21_c30
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l22_c30
   ]
  }
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test336.txml.scxml"
};
}
module.exports = machineNameConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QzMzYudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUtNO0FBQUEsQzs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFU7Ozs7OztBQUc2QixhQUFNLENBQUMsTTs7Ozs7O0FBQXBDO0FBQUEsQzs7Ozs7O0FBQXNELGFBQU0sQ0FBQyxVOzs7Ozs7QUFBN0Q7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVTs7Ozs7O0FBT0Q7QUFBQSxDOzs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVTs7Ozs7O0FBTW1ELGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBQzBCLGE7Ozs7OztBQUExQix5RCJ9