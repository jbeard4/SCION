//Generated on 2017-9-20 12:41:30 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
var Var1;
function $deserializeDatamodel($serializedDatamodel){
  Var1 = $serializedDatamodel["Var1"];
}
function $serializeDatamodel(){
   return {
  "Var1" : Var1
   };
}
function $expr_l8_c33(_event){
return 2;
};
$expr_l8_c33.tagname='undefined';
$expr_l8_c33.line=8;
$expr_l8_c33.column=33;
function $assign_l8_c4(_event){
Var1 = $expr_l8_c33.apply(this, arguments);
};
$assign_l8_c4.tagname='assign';
$assign_l8_c4.line=8;
$assign_l8_c4.column=4;
function $script_l9_c4(_event){
Var1 = 1;
};
$script_l9_c4.tagname='script';
$script_l9_c4.line=9;
$script_l9_c4.column=4;
function $cond_l11_c21(_event){
return Var1==1;
};
$cond_l11_c21.tagname='undefined';
$cond_l11_c21.line=11;
$cond_l11_c21.column=21;
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
function $data_l3_c22(_event){
return 0;
};
$data_l3_c22.tagname='undefined';
$data_l3_c22.line=3;
$data_l3_c22.column=22;
function $datamodel_l2_c1(_event){
if(typeof Var1 === "undefined")  Var1 = $data_l3_c22.apply(this, arguments);
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
    $assign_l8_c4,
    $script_l9_c4
   ],
   "transitions": [
    {
     "cond": $cond_l11_c21,
     "target": "pass"
    },
    {
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
 "onEntry": [
  $datamodel_l2_c1
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test303.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QzMDMudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBUWlDLFE7Ozs7OztBQUE3QiwyQzs7Ozs7O0FBQ0ksSSxDQUFBLEMsQ0FBTyxDOzs7Ozs7QUFFTSxXQUFJLEVBQUUsQzs7Ozs7O0FBSTBCLGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBQzBCLGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBYkwsUTs7Ozs7O0FBRHJCLDRFIn0=