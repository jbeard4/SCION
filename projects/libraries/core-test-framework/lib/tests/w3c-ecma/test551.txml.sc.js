//Generated on 2017-9-20 12:40:33 by the SCION SCXML compiler
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
function $cond_l5_c25(_event){
return Var1;
};
$cond_l5_c25.tagname='undefined';
$cond_l5_c25.line=5;
$cond_l5_c25.column=25;
function $expr_l17_c56(_event){
return 'pass';
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
function $expr_l18_c56(_event){
return 'fail';
};
$expr_l18_c56.tagname='undefined';
$expr_l18_c56.line=18;
$expr_l18_c56.column=56;
function $log_l18_c30(_event){
this.log("Outcome",$expr_l18_c56.apply(this, arguments));
};
$log_l18_c30.tagname='log';
$log_l18_c30.line=18;
$log_l18_c30.column=30;
function $data_l11_c20(_event){
return [1,2,3];
};
$data_l11_c20.tagname='undefined';
$data_l11_c20.line=11;
$data_l11_c20.column=20;
function $datamodel_l10_c4(_event){
if(typeof Var1 === "undefined")  Var1 = $data_l11_c20.apply(this, arguments);
};
$datamodel_l10_c4.tagname='datamodel';
$datamodel_l10_c4.line=10;
$datamodel_l10_c4.column=4;
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
     "cond": $cond_l5_c25,
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
    $log_l17_c30
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l18_c30
   ]
  }
 ],
 "onEntry": [
  $datamodel_l10_c4
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test551.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3Q1NTEudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBS3lCLFc7Ozs7OztBQVkrQixhOzs7Ozs7QUFBMUIseUQ7Ozs7OztBQUMwQixhOzs7Ozs7QUFBMUIseUQ7Ozs7OztBQVBWLFFBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEM7Ozs7OztBQUR0Qiw2RSJ9