//Generated on 2017-9-20 12:41:12 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
function $deserializeDatamodel($serializedDatamodel){

}
function $serializeDatamodel(){
   return {

   };
}
function $cond_l6_c20(_event){
return _ioprocessors['scxml'].location;
};
$cond_l6_c20.tagname='undefined';
$cond_l6_c20.line=6;
$cond_l6_c20.column=20;
function $expr_l11_c56(_event){
return 'pass';
};
$expr_l11_c56.tagname='undefined';
$expr_l11_c56.line=11;
$expr_l11_c56.column=56;
function $log_l11_c30(_event){
this.log("Outcome",$expr_l11_c56.apply(this, arguments));
};
$log_l11_c30.tagname='log';
$log_l11_c30.line=11;
$log_l11_c30.column=30;
function $expr_l12_c56(_event){
return 'fail';
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
     "cond": $cond_l6_c20,
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
    $log_l11_c30
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l12_c30
   ]
  }
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test569.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3Q1NjkudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFNb0Isb0JBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxROzs7Ozs7QUFLYSxhOzs7Ozs7QUFBMUIseUQ7Ozs7OztBQUMwQixhOzs7Ozs7QUFBMUIseUQifQ==