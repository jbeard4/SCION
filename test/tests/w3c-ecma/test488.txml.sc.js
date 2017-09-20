//Generated on 2017-9-20 12:40:28 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
function $deserializeDatamodel($serializedDatamodel){

}
function $serializeDatamodel(){
   return {

   };
}
function $script_lundefined_cundefined(_event){
throw new Error("Line 1: Unexpected token return")
};
$script_lundefined_cundefined.tagname='script';
$script_lundefined_cundefined.line=undefined;
$script_lundefined_cundefined.column=undefined;
function $cond_l26_c43(_event){
return typeof _event.data === 'undefined';
};
$cond_l26_c43.tagname='undefined';
$cond_l26_c43.line=26;
$cond_l26_c43.column=43;
function $expr_l30_c53(_event){
return 'pass';
};
$expr_l30_c53.tagname='undefined';
$expr_l30_c53.line=30;
$expr_l30_c53.column=53;
function $log_l30_c27(_event){
this.log("Outcome",$expr_l30_c53.apply(this, arguments));
};
$log_l30_c27.tagname='log';
$log_l30_c27.line=30;
$log_l30_c27.column=27;
function $expr_l31_c53(_event){
return 'fail';
};
$expr_l31_c53.tagname='undefined';
$expr_l31_c53.line=31;
$expr_l31_c53.column=53;
function $log_l31_c27(_event){
this.log("Outcome",$expr_l31_c53.apply(this, arguments));
};
$log_l31_c27.tagname='log';
$log_l31_c27.line=31;
$log_l31_c27.column=27;
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "{http://www.w3.org/2000/xmlns/}conf": "http://www.w3.org/2005/scxml-conformance",
 "initial": "s0",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "s0",
   "initial": "s01",
   "$type": "state",
   "transitions": [
    {
     "event": "error.execution",
     "target": "s1"
    },
    {
     "event": "done.state.s0",
     "target": "fail"
    },
    {
     "event": "done.state.s0",
     "target": "fail"
    }
   ],
   "states": [
    {
     "id": "s01",
     "$type": "state",
     "transitions": [
      {
       "target": "s02"
      }
     ]
    },
    {
     "id": "s02",
     "$type": "final",
     "onEntry": $script_lundefined_cundefined
    }
   ]
  },
  {
   "id": "s1",
   "$type": "state",
   "transitions": [
    {
     "event": "done.state.s0",
     "cond": $cond_l26_c43,
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
    $log_l30_c27
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l31_c27
   ]
  }
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test488.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3Q0ODgudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQjJDLGEsQ0FBTyxNQUFNLENBQUMsSSxDQUFLLEcsQ0FBSSxXOzs7Ozs7QUFJYixhOzs7Ozs7QUFBMUIseUQ7Ozs7OztBQUMwQixhOzs7Ozs7QUFBMUIseUQifQ==