//Generated on 2017-9-20 12:41:00 by the SCION SCXML compiler
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
function $expr_l9_c33(_event){
return '1s';
};
$expr_l9_c33.tagname='undefined';
$expr_l9_c33.line=9;
$expr_l9_c33.column=33;
function $assign_l9_c4(_event){
Var1 = $expr_l9_c33.apply(this, arguments);
};
$assign_l9_c4.tagname='assign';
$assign_l9_c4.line=9;
$assign_l9_c4.column=4;
function $senddata_l10_c4(_event){
return {
};
};
$senddata_l10_c4.tagname='send';
$senddata_l10_c4.line=10;
$senddata_l10_c4.column=4;
function $delayexpr_l10_c20(_event){
return Var1;
};
$delayexpr_l10_c20.tagname='undefined';
$delayexpr_l10_c20.line=10;
$delayexpr_l10_c20.column=20;
function $send_l10_c4(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "event2",
  data: $senddata_l10_c4.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs($delayexpr_l10_c20.apply(this, arguments)),
       });
};
$send_l10_c4.tagname='send';
$send_l10_c4.line=10;
$send_l10_c4.column=4;
function $senddata_l11_c4(_event){
return {
};
};
$senddata_l11_c4.tagname='send';
$senddata_l11_c4.line=11;
$senddata_l11_c4.column=4;
function $delayexpr_l11_c20(_event){
return '.5s';
};
$delayexpr_l11_c20.tagname='undefined';
$delayexpr_l11_c20.line=11;
$delayexpr_l11_c20.column=20;
function $send_l11_c4(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "event1",
  data: $senddata_l11_c4.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs($delayexpr_l11_c20.apply(this, arguments)),
       });
};
$send_l11_c4.tagname='send';
$send_l11_c4.line=11;
$send_l11_c4.column=4;
function $expr_l23_c56(_event){
return 'pass';
};
$expr_l23_c56.tagname='undefined';
$expr_l23_c56.line=23;
$expr_l23_c56.column=56;
function $log_l23_c30(_event){
this.log("Outcome",$expr_l23_c56.apply(this, arguments));
};
$log_l23_c30.tagname='log';
$log_l23_c30.line=23;
$log_l23_c30.column=30;
function $expr_l24_c56(_event){
return 'fail';
};
$expr_l24_c56.tagname='undefined';
$expr_l24_c56.line=24;
$expr_l24_c56.column=56;
function $log_l24_c30(_event){
this.log("Outcome",$expr_l24_c56.apply(this, arguments));
};
$log_l24_c30.tagname='log';
$log_l24_c30.line=24;
$log_l24_c30.column=30;
function $data_l4_c24(_event){
return '0s';
};
$data_l4_c24.tagname='undefined';
$data_l4_c24.line=4;
$data_l4_c24.column=24;
function $datamodel_l3_c1(_event){
if(typeof Var1 === "undefined")  Var1 = $data_l4_c24.apply(this, arguments);
};
$datamodel_l3_c1.tagname='datamodel';
$datamodel_l3_c1.line=3;
$datamodel_l3_c1.column=1;
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
    $assign_l9_c4,
    $send_l10_c4,
    $send_l11_c4
   ],
   "transitions": [
    {
     "event": "event1",
     "target": "s1"
    },
    {
     "event": "event2",
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
    $log_l23_c30
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l24_c30
   ]
  }
 ],
 "onEntry": [
  $datamodel_l3_c1
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test175.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QxNzUudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFTaUMsVzs7Ozs7O0FBQTdCLDJDOzs7Ozs7QUFDQTtBQUFBLEM7Ozs7OztBQUFnQixXOzs7Ozs7QUFBaEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFU7Ozs7OztBQUNBO0FBQUEsQzs7Ozs7O0FBQWdCLFk7Ozs7OztBQUFoQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVTs7Ozs7O0FBWW9ELGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBQzBCLGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBcEJOLFc7Ozs7OztBQUR2Qiw0RSJ9