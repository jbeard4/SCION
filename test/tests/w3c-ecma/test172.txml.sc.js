//Generated on 2017-9-20 12:40:12 by the SCION SCXML compiler
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
function $expr_l7_c33(_event){
return 'event2';
};
$expr_l7_c33.tagname='undefined';
$expr_l7_c33.line=7;
$expr_l7_c33.column=33;
function $assign_l7_c4(_event){
Var1 = $expr_l7_c33.apply(this, arguments);
};
$assign_l7_c4.tagname='assign';
$assign_l7_c4.line=7;
$assign_l7_c4.column=4;
function $eventexpr_l8_c20(_event){
return Var1;
};
$eventexpr_l8_c20.tagname='undefined';
$eventexpr_l8_c20.line=8;
$eventexpr_l8_c20.column=20;
function $senddata_l8_c4(_event){
return {
};
};
$senddata_l8_c4.tagname='send';
$senddata_l8_c4.line=8;
$senddata_l8_c4.column=4;
function $send_l8_c4(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: $eventexpr_l8_c20.apply(this, arguments),
  data: $senddata_l8_c4.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs(null),
       });
};
$send_l8_c4.tagname='send';
$send_l8_c4.line=8;
$send_l8_c4.column=4;
function $expr_l16_c56(_event){
return 'pass';
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
function $expr_l17_c56(_event){
return 'fail';
};
$expr_l17_c56.tagname='undefined';
$expr_l17_c56.line=17;
$expr_l17_c56.column=56;
function $log_l17_c30(_event){
this.log("Outcome",$expr_l17_c56.apply(this, arguments));
};
$log_l17_c30.tagname='log';
$log_l17_c30.line=17;
$log_l17_c30.column=30;
function $data_l2_c24(_event){
return 'event1';
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
    $assign_l7_c4,
    $send_l8_c4
   ],
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
    $log_l16_c30
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l17_c30
   ]
  }
 ],
 "onEntry": [
  $datamodel_l1_c1
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test172.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QxNzIudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFPaUMsZTs7Ozs7O0FBQTdCLDJDOzs7Ozs7QUFDZ0IsVzs7Ozs7O0FBQWhCO0FBQUEsQzs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFU7Ozs7OztBQVFvRCxhOzs7Ozs7QUFBMUIseUQ7Ozs7OztBQUMwQixhOzs7Ozs7QUFBMUIseUQ7Ozs7OztBQWZOLGU7Ozs7OztBQUR2Qiw0RSJ9