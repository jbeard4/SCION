//Generated on 2017-9-20 12:41:10 by the SCION SCXML compiler
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
function $script_l8_c5(_event){

      Var1+=1
};
$script_l8_c5.tagname='script';
$script_l8_c5.line=8;
$script_l8_c5.column=5;
function $cond_l12_c21(_event){
return Var1==1;
};
$cond_l12_c21.tagname='undefined';
$cond_l12_c21.line=12;
$cond_l12_c21.column=21;
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
function $data_l3_c24(_event){
return 0;
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
    $script_l8_c5
   ],
   "transitions": [
    {
     "cond": $cond_l12_c21,
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
  $datamodel_l2_c1
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test456.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3Q0NTYudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztNQVNNLElBQUksRUFBRSxDOzs7Ozs7QUFHUyxXQUFJLEVBQUUsQzs7Ozs7O0FBSTBCLGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBQzBCLGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBZEgsUTs7Ozs7O0FBRHZCLDRFIn0=