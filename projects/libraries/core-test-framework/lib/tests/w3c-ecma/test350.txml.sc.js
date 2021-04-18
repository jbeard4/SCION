//Generated on 2017-9-20 12:40:01 by the SCION SCXML compiler
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
function $expr_l10_c35(_event){
return Var1 + Var2;
};
$expr_l10_c35.tagname='undefined';
$expr_l10_c35.line=10;
$expr_l10_c35.column=35;
function $assign_l10_c6(_event){
Var1 = $expr_l10_c35.apply(this, arguments);
};
$assign_l10_c6.tagname='assign';
$assign_l10_c6.line=10;
$assign_l10_c6.column=6;
function $senddata_l11_c6(_event){
return {
};
};
$senddata_l11_c6.tagname='send';
$senddata_l11_c6.line=11;
$senddata_l11_c6.column=6;
function $send_l11_c6(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "timeout",
  data: $senddata_l11_c6.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs("5s"),
       });
};
$send_l11_c6.tagname='send';
$send_l11_c6.line=11;
$send_l11_c6.column=6;
function $targetexpr_l12_c78(_event){
return Var1;
};
$targetexpr_l12_c78.tagname='undefined';
$targetexpr_l12_c78.line=12;
$targetexpr_l12_c78.column=78;
function $senddata_l12_c6(_event){
return {
};
};
$senddata_l12_c6.tagname='send';
$senddata_l12_c6.line=12;
$senddata_l12_c6.column=6;
function $send_l12_c6(_event){
var _scionTargetRef = $targetexpr_l12_c78.apply(this, arguments);
     this.send(
{
  target: _scionTargetRef,
  name: "s0Event",
  data: $senddata_l12_c6.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs(null),
  type: "http://www.w3.org/TR/scxml/#SCXMLEventProcessor",
       });
};
$send_l12_c6.tagname='send';
$send_l12_c6.line=12;
$send_l12_c6.column=6;
function $expr_l20_c56(_event){
return 'pass';
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
function $expr_l21_c56(_event){
return 'fail';
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
function $data_l3_c24(_event){
return '#_scxml_';
};
$data_l3_c24.tagname='undefined';
$data_l3_c24.line=3;
$data_l3_c24.column=24;
function $data_l4_c24(_event){
return _sessionid;
};
$data_l4_c24.tagname='undefined';
$data_l4_c24.line=4;
$data_l4_c24.column=24;
function $datamodel_l2_c1(_event){
if(typeof Var1 === "undefined")  Var1 = $data_l3_c24.apply(this, arguments);
if(typeof Var2 === "undefined")  Var2 = $data_l4_c24.apply(this, arguments);
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
    $assign_l10_c6,
    $send_l11_c6,
    $send_l12_c6
   ],
   "transitions": [
    {
     "event": "s0Event",
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
    $log_l20_c30
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l21_c30
   ]
  }
 ],
 "onEntry": [
  $datamodel_l2_c1
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test350.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QzNTAudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVVtQyxXLENBQUssQyxDQUFFLEk7Ozs7OztBQUFwQyw0Qzs7Ozs7O0FBQ0E7QUFBQSxDOzs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVTs7Ozs7O0FBQ3dFLFc7Ozs7OztBQUF4RTtBQUFBLEM7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFU7Ozs7OztBQVFrRCxhOzs7Ozs7QUFBMUIseUQ7Ozs7OztBQUMwQixhOzs7Ozs7QUFBMUIseUQ7Ozs7OztBQWxCTixpQjs7Ozs7O0FBQ0EsaUI7Ozs7OztBQUZ2QjtBQUFBLDRFIn0=