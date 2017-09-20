//Generated on 2017-9-20 12:40:22 by the SCION SCXML compiler
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
function $cond_l8_c25(_event){
return Var1;
};
$cond_l8_c25.tagname='undefined';
$cond_l8_c25.line=8;
$cond_l8_c25.column=25;
function $expr_l12_c56(_event){
return 'pass';
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
function $expr_l13_c56(_event){
return 'fail';
};
$expr_l13_c56.tagname='undefined';
$expr_l13_c56.line=13;
$expr_l13_c56.column=56;
function $log_l13_c30(_event){
this.log("Outcome",$expr_l13_c56.apply(this, arguments));
};
$log_l13_c30.tagname='log';
$log_l13_c30.line=13;
$log_l13_c30.column=30;
function $data_l3_c5(_event){
return 2;
};
$data_l3_c5.tagname='undefined';
$data_l3_c5.line=3;
$data_l3_c5.column=5;
function $datamodel_l2_c3(_event){
if(typeof Var1 === "undefined")  Var1 = $data_l3_c5.apply(this, arguments);
};
$datamodel_l2_c3.tagname='datamodel';
$datamodel_l2_c3.line=2;
$datamodel_l2_c3.column=3;
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
   "transitions": [
    {
     "cond": $cond_l8_c25,
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
    $log_l12_c30
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l13_c30
   ]
  }
 ],
 "onEntry": [
  $datamodel_l2_c3
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test552.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3Q1NTIudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBUXlCLFc7Ozs7OztBQUkrQixhOzs7Ozs7QUFBMUIseUQ7Ozs7OztBQUMwQixhOzs7Ozs7QUFBMUIseUQ7Ozs7OztBQVZ6QixROzs7Ozs7QUFERiwyRSJ9