//Generated on 2017-9-20 12:40:11 by the SCION SCXML compiler
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
function $cond_l6_c20(_event){
return false;
};
$cond_l6_c20.tagname='undefined';
$cond_l6_c20.line=6;
$cond_l6_c20.column=20;
function $raise_l12_c5(_event){
this.raise({ name:"foo", data : null});
};
$raise_l12_c5.tagname='raise';
$raise_l12_c5.line=12;
$raise_l12_c5.column=5;
function $expr_l18_c53(_event){
return 'pass';
};
$expr_l18_c53.tagname='undefined';
$expr_l18_c53.line=18;
$expr_l18_c53.column=53;
function $log_l18_c27(_event){
this.log("Outcome",$expr_l18_c53.apply(this, arguments));
};
$log_l18_c27.tagname='log';
$log_l18_c27.line=18;
$log_l18_c27.column=27;
function $expr_l19_c53(_event){
return 'fail';
};
$expr_l19_c53.tagname='undefined';
$expr_l19_c53.line=19;
$expr_l19_c53.column=53;
function $log_l19_c27(_event){
this.log("Outcome",$expr_l19_c53.apply(this, arguments));
};
$log_l19_c27.tagname='log';
$log_l19_c27.line=19;
$log_l19_c27.column=27;
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
     "target": "fail"
    },
    {
     "target": "s1"
    }
   ],
   "onEntry": $script_lundefined_cundefined
  },
  {
   "id": "s1",
   "$type": "state",
   "onEntry": [
    $raise_l12_c5
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
    $log_l18_c27
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l19_c27
   ]
  }
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test344.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QzNDQudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFNb0IsWTs7Ozs7O0FBTWYsdUM7Ozs7OztBQU1nRCxhOzs7Ozs7QUFBMUIseUQ7Ozs7OztBQUMwQixhOzs7Ozs7QUFBMUIseUQifQ==