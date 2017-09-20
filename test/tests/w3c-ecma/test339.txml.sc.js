//Generated on 2017-9-20 12:41:04 by the SCION SCXML compiler
function machineNameConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'machineName';
function $deserializeDatamodel($serializedDatamodel){

}
function $serializeDatamodel(){
   return {

   };
}
function $raise_l4_c6(_event){
this.raise({ name:"foo", data : null});
};
$raise_l4_c6.tagname='raise';
$raise_l4_c6.line=4;
$raise_l4_c6.column=6;
function $cond_l6_c33(_event){
return typeof _event.invokeid === 'undefined';
};
$cond_l6_c33.tagname='undefined';
$cond_l6_c33.line=6;
$cond_l6_c33.column=33;
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
   "onEntry": [
    $raise_l4_c6
   ],
   "transitions": [
    {
     "event": "foo",
     "cond": $cond_l6_c33,
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
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test339.txml.scxml"
};
}
module.exports = machineNameConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QzMzkudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFJTSx1Qzs7Ozs7O0FBRTJCLGEsQ0FBTyxNQUFNLENBQUMsUSxDQUFTLEcsQ0FBSSxXOzs7Ozs7QUFNSixhOzs7Ozs7QUFBMUIseUQ7Ozs7OztBQUMwQixhOzs7Ozs7QUFBMUIseUQifQ==