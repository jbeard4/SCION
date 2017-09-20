//Generated on 2017-9-20 12:40:04 by the SCION SCXML compiler
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
function $script_l9_c4(_event){
throw new Error("Line 1: Unexpected token return")
};
$script_l9_c4.tagname='script';
$script_l9_c4.line=9;
$script_l9_c4.column=4;
function $raise_l10_c4(_event){
this.raise({ name:"foo", data : null});
};
$raise_l10_c4.tagname='raise';
$raise_l10_c4.line=10;
$raise_l10_c4.column=4;
function $expr_l16_c53(_event){
return 'pass';
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
function $expr_l17_c53(_event){
return 'fail';
};
$expr_l17_c53.tagname='undefined';
$expr_l17_c53.line=17;
$expr_l17_c53.column=53;
function $log_l17_c27(_event){
this.log("Outcome",$expr_l17_c53.apply(this, arguments));
};
$log_l17_c27.tagname='log';
$log_l17_c27.line=17;
$log_l17_c27.column=27;
function $data_l4_c24(_event){
return 1;
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
    $script_l9_c4,
    $raise_l10_c4
   ],
   "transitions": [
    {
     "event": "error.execution",
     "target": "pass"
    },
    {
     "event": ".*",
     "target": "fail"
    }
   ]
  },
  {
   "id": "pass",
   "$type": "final",
   "onEntry": [
    $log_l16_c27
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l17_c27
   ]
  }
 ],
 "onEntry": [
  $datamodel_l3_c1
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test313.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QzMTMudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBU0ksSyxDQUFNLEcsQ0FBSSxLQUFLLENBQUMsaUNBQWlDLEM7Ozs7OztBQUNqRCx1Qzs7Ozs7O0FBTWlELGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBQzBCLGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBYkgsUTs7Ozs7O0FBRHZCLDRFIn0=