//Generated on 2017-9-20 12:40:27 by the SCION SCXML compiler
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
function $senddata_l8_c4(_event){
return {
};
};
$senddata_l8_c4.tagname='send';
$senddata_l8_c4.line=8;
$senddata_l8_c4.column=4;
function $delayexpr_l8_c44(_event){
return '1s';
};
$delayexpr_l8_c44.tagname='undefined';
$delayexpr_l8_c44.line=8;
$delayexpr_l8_c44.column=44;
function $send_l8_c4(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "event1",
  data: $senddata_l8_c4.apply(this, arguments),
  sendid: "foo",
  origin: _sessionid
}, 
       {
           delay: getDelayInMs($delayexpr_l8_c44.apply(this, arguments)),
       });
};
$send_l8_c4.tagname='send';
$send_l8_c4.line=8;
$send_l8_c4.column=4;
function $senddata_l9_c4(_event){
return {
};
};
$senddata_l9_c4.tagname='send';
$senddata_l9_c4.line=9;
$senddata_l9_c4.column=4;
function $delayexpr_l9_c35(_event){
return '1.5s';
};
$delayexpr_l9_c35.tagname='undefined';
$delayexpr_l9_c35.line=9;
$delayexpr_l9_c35.column=35;
function $send_l9_c4(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "event2",
  data: $senddata_l9_c4.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs($delayexpr_l9_c35.apply(this, arguments)),
       });
};
$send_l9_c4.tagname='send';
$send_l9_c4.line=9;
$send_l9_c4.column=4;
function $expr_l10_c33(_event){
return 'foo';
};
$expr_l10_c33.tagname='undefined';
$expr_l10_c33.line=10;
$expr_l10_c33.column=33;
function $assign_l10_c4(_event){
Var1 = $expr_l10_c33.apply(this, arguments);
};
$assign_l10_c4.tagname='assign';
$assign_l10_c4.line=10;
$assign_l10_c4.column=4;
function $sendidexpr_l11_c23(_event){
return Var1;
};
$sendidexpr_l11_c23.tagname='undefined';
$sendidexpr_l11_c23.line=11;
$sendidexpr_l11_c23.column=23;
function $cancel_l11_c4(_event){
this.cancel($sendidexpr_l11_c23.apply(this, arguments));
};
$cancel_l11_c4.tagname='cancel';
$cancel_l11_c4.line=11;
$cancel_l11_c4.column=4;
function $expr_l20_c53(_event){
return 'pass';
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
function $expr_l21_c53(_event){
return 'fail';
};
$expr_l21_c53.tagname='undefined';
$expr_l21_c53.line=21;
$expr_l21_c53.column=53;
function $log_l21_c27(_event){
this.log("Outcome",$expr_l21_c53.apply(this, arguments));
};
$log_l21_c27.tagname='log';
$log_l21_c27.line=21;
$log_l21_c27.column=27;
function $data_l3_c24(_event){
return 'bar';
};
$data_l3_c24.tagname='undefined';
$data_l3_c24.line=3;
$data_l3_c24.column=24;
function $datamodel_l2_c1(_event){
if(typeof Var1 === "undefined")  Var1 = $data_l3_c24.apply(this, arguments);
};
$datamodel_l2_c1.tagname='datamodel';
$datamodel_l2_c1.line=2;
$datamodel_l2_c1.column=1;
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
    $send_l8_c4,
    $send_l9_c4,
    $assign_l10_c4,
    $cancel_l11_c4
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
    $log_l20_c27
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l21_c27
   ]
  }
 ],
 "onEntry": [
  $datamodel_l2_c1
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test210.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QyMTAudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFRSTtBQUFBLEM7Ozs7OztBQUF3QyxXOzs7Ozs7QUFBeEM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFU7Ozs7OztBQUNBO0FBQUEsQzs7Ozs7O0FBQStCLGE7Ozs7OztBQUEvQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVTs7Ozs7O0FBQzZCLFk7Ozs7OztBQUE3Qiw0Qzs7Ozs7O0FBQ21CLFc7Ozs7OztBQUFuQix3RDs7Ozs7O0FBU2lELGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBQzBCLGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBbEJILFk7Ozs7OztBQUR2Qiw0RSJ9