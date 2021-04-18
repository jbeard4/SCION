//Generated on 2017-9-20 12:41:00 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
var var1;
function $deserializeDatamodel($serializedDatamodel){
  var1 = $serializedDatamodel["var1"];
}
function $serializeDatamodel(){
   return {
  "var1" : var1
   };
}
function $cond_l7_c20(_event){
return var1==undefined;
};
$cond_l7_c20.tagname='undefined';
$cond_l7_c20.line=7;
$cond_l7_c20.column=20;
function $expr_l13_c53(_event){
return 'pass';
};
$expr_l13_c53.tagname='undefined';
$expr_l13_c53.line=13;
$expr_l13_c53.column=53;
function $log_l13_c27(_event){
this.log("Outcome",$expr_l13_c53.apply(this, arguments));
};
$log_l13_c27.tagname='log';
$log_l13_c27.line=13;
$log_l13_c27.column=27;
function $expr_l14_c53(_event){
return 'fail';
};
$expr_l14_c53.tagname='undefined';
$expr_l14_c53.line=14;
$expr_l14_c53.column=53;
function $log_l14_c27(_event){
this.log("Outcome",$expr_l14_c53.apply(this, arguments));
};
$log_l14_c27.tagname='log';
$log_l14_c27.line=14;
$log_l14_c27.column=27;
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "{http://www.w3.org/2000/xmlns/}conf": "http://www.w3.org/2005/scxml-conformance",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "s0",
   "$type": "state",
   "transitions": [
    {
     "cond": $cond_l7_c20,
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
    $log_l13_c27
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l14_c27
   ]
  }
 ],
 "onEntry": [],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test445.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3Q0NDUudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBT29CLFdBQUksRUFBRSxTOzs7Ozs7QUFNMkIsYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUFDMEIsYTs7Ozs7O0FBQTFCLHlEIn0=