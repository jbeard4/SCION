//Generated on 2017-9-20 12:40:43 by the SCION SCXML compiler
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
function $targetexpr_l7_c22(_event){
return Var1;
};
$targetexpr_l7_c22.tagname='undefined';
$targetexpr_l7_c22.line=7;
$targetexpr_l7_c22.column=22;
function $senddata_l7_c5(_event){
return {
};
};
$senddata_l7_c5.tagname='send';
$senddata_l7_c5.line=7;
$senddata_l7_c5.column=5;
function $send_l7_c5(_event){
var _scionTargetRef = $targetexpr_l7_c22.apply(this, arguments);
     this.send(
{
  target: _scionTargetRef,
  name: "foo",
  data: $senddata_l7_c5.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs(null),
       });
};
$send_l7_c5.tagname='send';
$send_l7_c5.line=7;
$send_l7_c5.column=5;
function $senddata_l8_c5(_event){
return {
};
};
$senddata_l8_c5.tagname='send';
$senddata_l8_c5.line=8;
$senddata_l8_c5.column=5;
function $send_l8_c5(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "timeout",
  data: $senddata_l8_c5.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs("2s"),
       });
};
$send_l8_c5.tagname='send';
$send_l8_c5.line=8;
$send_l8_c5.column=5;
function $expr_l15_c56(_event){
return 'pass';
};
$expr_l15_c56.tagname='undefined';
$expr_l15_c56.line=15;
$expr_l15_c56.column=56;
function $log_l15_c30(_event){
this.log("Outcome",$expr_l15_c56.apply(this, arguments));
};
$log_l15_c30.tagname='log';
$log_l15_c30.line=15;
$log_l15_c30.column=30;
function $expr_l16_c56(_event){
return 'fail';
};
$expr_l16_c56.tagname='undefined';
$expr_l16_c56.line=16;
$expr_l16_c56.column=56;
function $log_l16_c30(_event){
this.log("Outcome",$expr_l16_c56.apply(this, arguments));
};
$log_l16_c30.tagname='log';
$log_l16_c30.line=16;
$log_l16_c30.column=30;
function $data_l2_c24(_event){
return _ioprocessors['http://www.w3.org/TR/scxml/#SCXMLEventProcessor'].location;
};
$data_l2_c24.tagname='undefined';
$data_l2_c24.line=2;
$data_l2_c24.column=24;
function $datamodel_l1_c1(_event){
if(typeof Var1 === "undefined")  Var1 = $data_l2_c24.apply(this, arguments);
};
$datamodel_l1_c1.tagname='datamodel';
$datamodel_l1_c1.line=1;
$datamodel_l1_c1.column=1;
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
    $send_l7_c5,
    $send_l8_c5
   ],
   "transitions": [
    {
     "event": "foo",
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
    $log_l15_c30
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l16_c30
   ]
  }
 ],
 "onEntry": [
  $datamodel_l1_c1
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test501.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3Q1MDEudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFPc0IsVzs7Ozs7O0FBQWpCO0FBQUEsQzs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFU7Ozs7OztBQUNBO0FBQUEsQzs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFU7Ozs7OztBQU9tRCxhOzs7Ozs7QUFBMUIseUQ7Ozs7OztBQUMwQixhOzs7Ozs7QUFBMUIseUQ7Ozs7OztBQWROLG9CQUFhLENBQUMsaURBQWlELENBQUMsQ0FBQyxROzs7Ozs7QUFEeEYsNEUifQ==