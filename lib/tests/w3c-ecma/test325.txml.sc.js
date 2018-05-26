//Generated on 2017-9-20 12:40:07 by the SCION SCXML compiler
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
function $cond_l9_c22(_event){
return Var1;
};
$cond_l9_c22.tagname='undefined';
$cond_l9_c22.line=9;
$cond_l9_c22.column=22;
function $expr_l14_c56(_event){
return 'pass';
};
$expr_l14_c56.tagname='undefined';
$expr_l14_c56.line=14;
$expr_l14_c56.column=56;
function $log_l14_c30(_event){
this.log("Outcome",$expr_l14_c56.apply(this, arguments));
};
$log_l14_c30.tagname='log';
$log_l14_c30.line=14;
$log_l14_c30.column=30;
function $expr_l15_c56(_event){
return 'fail';
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
function $data_l4_c24(_event){
return _ioprocessors;
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
 "name": "machineName",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "s0",
   "$type": "state",
   "transitions": [
    {
     "cond": $cond_l9_c22,
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
    $log_l14_c30
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l15_c30
   ]
  }
 ],
 "onEntry": [
  $datamodel_l3_c1
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test325.txml.scxml"
};
}
module.exports = machineNameConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QzMjUudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBU3NCLFc7Ozs7OztBQUtrQyxhOzs7Ozs7QUFBMUIseUQ7Ozs7OztBQUMwQixhOzs7Ozs7QUFBMUIseUQ7Ozs7OztBQVhOLG9COzs7Ozs7QUFEdkIsNEUifQ==