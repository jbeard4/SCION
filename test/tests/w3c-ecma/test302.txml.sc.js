//Generated on 2017-9-20 12:40:35 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
var Var1 = 1
function $deserializeDatamodel($serializedDatamodel){

}
function $serializeDatamodel(){
   return {

   };
}
function $cond_l6_c21(_event){
return Var1==1;
};
$cond_l6_c21.tagname='undefined';
$cond_l6_c21.line=6;
$cond_l6_c21.column=21;
function $expr_l10_c53(_event){
return 'pass';
};
$expr_l10_c53.tagname='undefined';
$expr_l10_c53.line=10;
$expr_l10_c53.column=53;
function $log_l10_c27(_event){
this.log("Outcome",$expr_l10_c53.apply(this, arguments));
};
$log_l10_c27.tagname='log';
$log_l10_c27.line=10;
$log_l10_c27.column=27;
function $expr_l11_c53(_event){
return 'fail';
};
$expr_l11_c53.tagname='undefined';
$expr_l11_c53.line=11;
$expr_l11_c53.column=53;
function $log_l11_c27(_event){
this.log("Outcome",$expr_l11_c53.apply(this, arguments));
};
$log_l11_c27.tagname='log';
$log_l11_c27.line=11;
$log_l11_c27.column=27;
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
     "cond": $cond_l6_c21,
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
    $log_l10_c27
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l11_c27
   ]
  }
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test302.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QzMDIudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFHRSxHLENBQUksSSxDQUFLLEMsQ0FBRSxDOzs7Ozs7Ozs7O0FBR1EsV0FBSSxFQUFFLEM7Ozs7OztBQUkwQixhOzs7Ozs7QUFBMUIseUQ7Ozs7OztBQUMwQixhOzs7Ozs7QUFBMUIseUQifQ==