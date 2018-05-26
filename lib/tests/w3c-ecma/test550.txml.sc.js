//Generated on 2017-9-20 12:40:08 by the SCION SCXML compiler
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
function $cond_l4_c25(_event){
return Var1==2;
};
$cond_l4_c25.tagname='undefined';
$cond_l4_c25.line=4;
$cond_l4_c25.column=25;
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
function $data_l10_c26(_event){
return 2;
};
$data_l10_c26.tagname='undefined';
$data_l10_c26.line=10;
$data_l10_c26.column=26;
function $datamodel_l9_c5(_event){
if(typeof Var1 === "undefined")  Var1 = $data_l10_c26.apply(this, arguments);
};
$datamodel_l9_c5.tagname='datamodel';
$datamodel_l9_c5.line=9;
$datamodel_l9_c5.column=5;
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "{http://www.w3.org/2000/xmlns/}conf": "http://www.w3.org/2005/scxml-conformance",
 "initial": "s0",
 "binding": "early",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "s0",
   "$type": "state",
   "transitions": [
    {
     "cond": $cond_l4_c25,
     "target": "pass"
    },
    {
     "target": "fail"
    }
   ]
  },
  {
   "id": "s1",
   "$type": "state"
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
  $datamodel_l9_c5
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test550.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3Q1NTAudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBSXlCLFdBQUksRUFBRSxDOzs7Ozs7QUFVeUIsYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUFDMEIsYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUFMSixROzs7Ozs7QUFEckIsNkUifQ==