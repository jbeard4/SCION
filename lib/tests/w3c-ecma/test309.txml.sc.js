//Generated on 2017-9-20 12:41:34 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
function $deserializeDatamodel($serializedDatamodel){

}
function $serializeDatamodel(){
   return {

   };
}
function $script_lundefined_cundefined(_event){
throw new Error("Line 1: Illegal return statement")
};
$script_lundefined_cundefined.tagname='script';
$script_lundefined_cundefined.line=undefined;
$script_lundefined_cundefined.column=undefined;
function $cond_l3_c20(_event){
return false;
};
$cond_l3_c20.tagname='undefined';
$cond_l3_c20.line=3;
$cond_l3_c20.column=20;
function $expr_l7_c53(_event){
return 'pass';
};
$expr_l7_c53.tagname='undefined';
$expr_l7_c53.line=7;
$expr_l7_c53.column=53;
function $log_l7_c27(_event){
this.log("Outcome",$expr_l7_c53.apply(this, arguments));
};
$log_l7_c27.tagname='log';
$log_l7_c27.line=7;
$log_l7_c27.column=27;
function $expr_l8_c53(_event){
return 'fail';
};
$expr_l8_c53.tagname='undefined';
$expr_l8_c53.line=8;
$expr_l8_c53.column=53;
function $log_l8_c27(_event){
this.log("Outcome",$expr_l8_c53.apply(this, arguments));
};
$log_l8_c27.tagname='log';
$log_l8_c27.line=8;
$log_l8_c27.column=27;
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
     "cond": $cond_l3_c20,
     "target": "fail"
    },
    {
     "target": "pass"
    }
   ],
   "onEntry": $script_lundefined_cundefined
  },
  {
   "id": "pass",
   "$type": "final",
   "onEntry": [
    $log_l7_c27
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l8_c27
   ]
  }
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test309.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QzMDkudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHb0IsWTs7Ozs7O0FBSWlDLGE7Ozs7OztBQUExQix3RDs7Ozs7O0FBQzBCLGE7Ozs7OztBQUExQix3RCJ9