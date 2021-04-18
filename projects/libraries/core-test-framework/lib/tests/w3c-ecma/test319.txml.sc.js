//Generated on 2017-9-20 12:40:54 by the SCION SCXML compiler
function machineNameConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'machineName';
function $deserializeDatamodel($serializedDatamodel){

}
function $serializeDatamodel(){
   return {

   };
}
function $cond_l4_c15(_event){
return _event;
};
$cond_l4_c15.tagname='undefined';
$cond_l4_c15.line=4;
$cond_l4_c15.column=15;
function $raise_l5_c8(_event){
this.raise({ name:"bound", data : null});
};
$raise_l5_c8.tagname='raise';
$raise_l5_c8.line=5;
$raise_l5_c8.column=8;
function $raise_l7_c10(_event){
this.raise({ name:"unbound", data : null});
};
$raise_l7_c10.tagname='raise';
$raise_l7_c10.line=7;
$raise_l7_c10.column=10;
function $if_l4_c6(_event){
if($cond_l4_c15.apply(this, arguments)){
    $raise_l5_c8.apply(this, arguments);
}else{
    $raise_l7_c10.apply(this, arguments);
}
};
$if_l4_c6.tagname='if';
$if_l4_c6.line=4;
$if_l4_c6.column=6;
function $expr_l16_c56(_event){
return 'pass';
};
$expr_l16_c56.tagname='undefined';
$expr_l16_c56.line=16;
$expr_l16_c56.column=56;
function $log_l16_c30(_event){
this.log("Outcome",$expr_l16_c56.apply(this, arguments));
};
$log_l16_c30.tagname='log';
$log_l16_c30.line=16;
$log_l16_c30.column=30;
function $expr_l17_c56(_event){
return 'fail';
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
    $if_l4_c6
   ],
   "transitions": [
    {
     "event": "unbound",
     "target": "pass"
    },
    {
     "event": "bound",
     "target": "fail"
    }
   ]
  },
  {
   "id": "pass",
   "$type": "final",
   "onEntry": [
    $log_l16_c30
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l17_c30
   ]
  }
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test319.txml.scxml"
};
}
module.exports = machineNameConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QzMTkudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFJZSxhOzs7Ozs7QUFDUCx5Qzs7Ozs7O0FBRUUsMkM7Ozs7OztBQUhKO0FBQUE7QUFBQTtBQUFBO0FBQUEsQzs7Ozs7O0FBWWtELGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBQzBCLGE7Ozs7OztBQUExQix5RCJ9