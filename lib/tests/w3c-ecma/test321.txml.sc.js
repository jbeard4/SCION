//Generated on 2017-9-20 12:40:56 by the SCION SCXML compiler
function machineNameConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'machineName';
var Var1;
function $deserializeDatamodel($serializedDatamodel){
  Var1 = $serializedDatamodel["Var1"];
}
function $serializeDatamodel(){
   return {
  "Var1" : Var1
   };
}
function $cond_l6_c18(_event){
return Var1;
};
$cond_l6_c18.tagname='undefined';
$cond_l6_c18.line=6;
$cond_l6_c18.column=18;
function $cond_l7_c21(_event){
return true;
};
$cond_l7_c21.tagname='undefined';
$cond_l7_c21.line=7;
$cond_l7_c21.column=21;
function $expr_l11_c56(_event){
return 'pass';
};
$expr_l11_c56.tagname='undefined';
$expr_l11_c56.line=11;
$expr_l11_c56.column=56;
function $log_l11_c30(_event){
this.log("Outcome",$expr_l11_c56.apply(this, arguments));
};
$log_l11_c30.tagname='log';
$log_l11_c30.line=11;
$log_l11_c30.column=30;
function $expr_l12_c56(_event){
return 'fail';
};
$expr_l12_c56.tagname='undefined';
$expr_l12_c56.line=12;
$expr_l12_c56.column=56;
function $log_l12_c30(_event){
this.log("Outcome",$expr_l12_c56.apply(this, arguments));
};
$log_l12_c30.tagname='log';
$log_l12_c30.line=12;
$log_l12_c30.column=30;
function $data_l2_c24(_event){
return _sessionid;
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
 "name": "machineName",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "s0",
   "$type": "state",
   "transitions": [
    {
     "cond": $cond_l6_c18,
     "target": "pass"
    },
    {
     "cond": $cond_l7_c21,
     "target": "fail"
    }
   ]
  },
  {
   "id": "pass",
   "$type": "final",
   "onEntry": [
    $log_l11_c30
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l12_c30
   ]
  }
 ],
 "onEntry": [
  $datamodel_l1_c1
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test321.txml.scxml"
};
}
module.exports = machineNameConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QzMjEudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBTWtCLFc7Ozs7OztBQUNHLFc7Ozs7OztBQUltQyxhOzs7Ozs7QUFBMUIseUQ7Ozs7OztBQUMwQixhOzs7Ozs7QUFBMUIseUQ7Ozs7OztBQVZOLGlCOzs7Ozs7QUFEdkIsNEUifQ==