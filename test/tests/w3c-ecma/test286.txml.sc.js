//Generated on 2017-9-20 12:41:24 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
function $deserializeDatamodel($serializedDatamodel){

}
function $serializeDatamodel(){
   return {

   };
}
function $script_l6_c4(_event){
throw new Error("Assignment to location not declared in the datamodel:foo.bar.baz ")
};
$script_l6_c4.tagname='script';
$script_l6_c4.line=6;
$script_l6_c4.column=4;
function $raise_l7_c4(_event){
this.raise({ name:"foo", data : null});
};
$raise_l7_c4.tagname='raise';
$raise_l7_c4.line=7;
$raise_l7_c4.column=4;
function $expr_l14_c53(_event){
return 'pass';
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
function $expr_l15_c53(_event){
return 'fail';
};
$expr_l15_c53.tagname='undefined';
$expr_l15_c53.line=15;
$expr_l15_c53.column=53;
function $log_l15_c27(_event){
this.log("Outcome",$expr_l15_c53.apply(this, arguments));
};
$log_l15_c27.tagname='log';
$log_l15_c27.line=15;
$log_l15_c27.column=27;
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
    $script_l6_c4,
    $raise_l7_c4
   ],
   "transitions": [
    {
     "event": "error.execution",
     "target": "pass"
    },
    {
     "event": "*",
     "target": "fail"
    }
   ]
  },
  {
   "id": "pass",
   "$type": "final",
   "onEntry": [
    $log_l14_c27
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l15_c27
   ]
  }
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test286.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QyODYudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFNSSxLLENBQU0sRyxDQUFJLEtBQUssQ0FBQyxtRUFBbUUsQzs7Ozs7O0FBQ25GLHVDOzs7Ozs7QUFPaUQsYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUFDMEIsYTs7Ozs7O0FBQTFCLHlEIn0=