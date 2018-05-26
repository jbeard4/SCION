//Generated on 2017-9-20 12:40:02 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
var Var1, Var2;
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
function $cond_l9_c21(_event){
return typeof Var2 === 'undefined';
};
$cond_l9_c21.tagname='undefined';
$cond_l9_c21.line=9;
$cond_l9_c21.column=21;
function $expr_l18_c34(_event){
return Var2;
};
$expr_l18_c34.tagname='undefined';
$expr_l18_c34.line=18;
$expr_l18_c34.column=34;
function $assign_l18_c5(_event){
Var1 = $expr_l18_c34.apply(this, arguments);
};
$assign_l18_c5.tagname='assign';
$assign_l18_c5.line=18;
$assign_l18_c5.column=5;
function $data_l15_c26(_event){
return 1;
};
$data_l15_c26.tagname='undefined';
$data_l15_c26.line=15;
$data_l15_c26.column=26;
function $datamodel_l14_c3(_event){
if(typeof Var2 === "undefined")  Var2 = $data_l15_c26.apply(this, arguments);
};
$datamodel_l14_c3.tagname='datamodel';
$datamodel_l14_c3.line=14;
$datamodel_l14_c3.column=3;
function $cond_l20_c22(_event){
return Var1===Var2;
};
$cond_l20_c22.tagname='undefined';
$cond_l20_c22.line=20;
$cond_l20_c22.column=22;
function $expr_l24_c56(_event){
return 'pass';
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
function $expr_l25_c56(_event){
return 'fail';
};
$expr_l25_c56.tagname='undefined';
$expr_l25_c56.line=25;
$expr_l25_c56.column=56;
function $log_l25_c30(_event){
this.log("Outcome",$expr_l25_c56.apply(this, arguments));
};
$log_l25_c30.tagname='log';
$log_l25_c30.line=25;
$log_l25_c30.column=30;
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "{http://www.w3.org/2000/xmlns/}conf": "http://www.w3.org/2005/scxml-conformance",
 "initial": "s0",
 "binding": "late",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "s0",
   "$type": "state",
   "transitions": [
    {
     "cond": $cond_l9_c21,
     "target": "s1"
    },
    {
     "target": "fail"
    }
   ]
  },
  {
   "id": "s1",
   "$type": "state",
   "onEntry": [
    $datamodel_l14_c3,
    $assign_l18_c5
   ],
   "transitions": [
    {
     "cond": $cond_l20_c22,
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
    $log_l24_c30
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l25_c30
   ]
  }
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test280.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QyODAudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFTcUIsYSxDQUFPLEksQ0FBSyxHLENBQUksVzs7Ozs7O0FBU0gsVzs7Ozs7O0FBQTdCLDRDOzs7Ozs7QUFIcUIsUTs7Ozs7O0FBRHZCLDZFOzs7Ozs7QUFNbUIsV0FBSSxHQUFHLEk7Ozs7OztBQUkyQixhOzs7Ozs7QUFBMUIseUQ7Ozs7OztBQUMwQixhOzs7Ozs7QUFBMUIseUQifQ==