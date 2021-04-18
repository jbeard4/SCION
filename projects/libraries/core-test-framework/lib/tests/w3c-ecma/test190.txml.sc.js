//Generated on 2017-9-20 12:41:05 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
var Var1, Var2;
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
  Var2 = $serializedDatamodel["Var2"];
}
function $serializeDatamodel(){
   return {
  "Var1" : Var1,
  "Var2" : Var2
   };
}
function $expr_l11_c32(_event){
return Var1 + Var2;
};
$expr_l11_c32.tagname='undefined';
$expr_l11_c32.line=11;
$expr_l11_c32.column=32;
function $assign_l11_c3(_event){
Var1 = $expr_l11_c32.apply(this, arguments);
};
$assign_l11_c3.tagname='assign';
$assign_l11_c3.line=11;
$assign_l11_c3.column=3;
function $targetexpr_l13_c36(_event){
return Var1;
};
$targetexpr_l13_c36.tagname='undefined';
$targetexpr_l13_c36.line=13;
$targetexpr_l13_c36.column=36;
function $senddata_l13_c4(_event){
return {
};
};
$senddata_l13_c4.tagname='send';
$senddata_l13_c4.line=13;
$senddata_l13_c4.column=4;
function $send_l13_c4(_event){
var _scionTargetRef = $targetexpr_l13_c36.apply(this, arguments);
     this.send(
{
  target: _scionTargetRef,
  name: "event2",
  data: $senddata_l13_c4.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs(null),
       });
};
$send_l13_c4.tagname='send';
$send_l13_c4.line=13;
$send_l13_c4.column=4;
function $raise_l15_c4(_event){
this.raise({ name:"event1", data : null});
};
$raise_l15_c4.tagname='raise';
$raise_l15_c4.line=15;
$raise_l15_c4.column=4;
function $senddata_l17_c4(_event){
return {
};
};
$senddata_l17_c4.tagname='send';
$senddata_l17_c4.line=17;
$senddata_l17_c4.column=4;
function $send_l17_c4(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "timeout",
  data: $senddata_l17_c4.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs(null),
       });
};
$send_l17_c4.tagname='send';
$send_l17_c4.line=17;
$send_l17_c4.column=4;
function $expr_l31_c56(_event){
return 'pass';
};
$expr_l31_c56.tagname='undefined';
$expr_l31_c56.line=31;
$expr_l31_c56.column=56;
function $log_l31_c30(_event){
this.log("Outcome",$expr_l31_c56.apply(this, arguments));
};
$log_l31_c30.tagname='log';
$log_l31_c30.line=31;
$log_l31_c30.column=30;
function $expr_l32_c56(_event){
return 'fail';
};
$expr_l32_c56.tagname='undefined';
$expr_l32_c56.line=32;
$expr_l32_c56.column=56;
function $log_l32_c30(_event){
this.log("Outcome",$expr_l32_c56.apply(this, arguments));
};
$log_l32_c30.tagname='log';
$log_l32_c30.line=32;
$log_l32_c30.column=30;
function $data_l5_c23(_event){
return '#_scxml_';
};
$data_l5_c23.tagname='undefined';
$data_l5_c23.line=5;
$data_l5_c23.column=23;
function $data_l6_c23(_event){
return _sessionid;
};
$data_l6_c23.tagname='undefined';
$data_l6_c23.line=6;
$data_l6_c23.column=23;
function $datamodel_l4_c1(_event){
if(typeof Var1 === "undefined")  Var1 = $data_l5_c23.apply(this, arguments);
if(typeof Var2 === "undefined")  Var2 = $data_l6_c23.apply(this, arguments);
};
$datamodel_l4_c1.tagname='datamodel';
$datamodel_l4_c1.line=4;
$datamodel_l4_c1.column=1;
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
    $assign_l11_c3,
    $send_l13_c4,
    $raise_l15_c4,
    $send_l17_c4
   ],
   "transitions": [
    {
     "event": "event1",
     "target": "s1"
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
   "transitions": [
    {
     "event": "event2",
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
    $log_l31_c30
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l32_c30
   ]
  }
 ],
 "onEntry": [
  $datamodel_l4_c1
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test190.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QxOTAudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVdnQyxXLENBQUssQyxDQUFFLEk7Ozs7OztBQUFwQyw0Qzs7Ozs7O0FBRWlDLFc7Ozs7OztBQUFoQztBQUFBLEM7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVOzs7Ozs7QUFFQSwwQzs7Ozs7O0FBRUE7QUFBQSxDOzs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVTs7Ozs7O0FBY29ELGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBQzBCLGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBM0JQLGlCOzs7Ozs7QUFDQSxpQjs7Ozs7O0FBRnRCO0FBQUEsNEUifQ==