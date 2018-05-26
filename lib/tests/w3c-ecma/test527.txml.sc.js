//Generated on 2017-9-20 12:41:14 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
function $deserializeDatamodel($serializedDatamodel){

}
function $serializeDatamodel(){
   return {

   };
}
function $cond_l5_c43(_event){
return _event.data == 'foo';
};
$cond_l5_c43.tagname='undefined';
$cond_l5_c43.line=5;
$cond_l5_c43.column=43;
function $expr_l16_c21(_event){
return 'foo';
};
$expr_l16_c21.tagname='undefined';
$expr_l16_c21.line=16;
$expr_l16_c21.column=21;
function $expr_l21_c53(_event){
return 'pass';
};
$expr_l21_c53.tagname='undefined';
$expr_l21_c53.line=21;
$expr_l21_c53.column=53;
function $log_l21_c27(_event){
this.log("Outcome",$expr_l21_c53.apply(this, arguments));
};
$log_l21_c27.tagname='log';
$log_l21_c27.line=21;
$log_l21_c27.column=27;
function $expr_l22_c53(_event){
return 'fail';
};
$expr_l22_c53.tagname='undefined';
$expr_l22_c53.line=22;
$expr_l22_c53.column=53;
function $log_l22_c27(_event){
this.log("Outcome",$expr_l22_c53.apply(this, arguments));
};
$log_l22_c27.tagname='log';
$log_l22_c27.line=22;
$log_l22_c27.column=27;
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
     "event": "done.state.s0",
     "cond": $cond_l5_c43,
     "target": "pass"
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
     "donedata": $expr_l16_c21
    }
   ]
  },
  {
   "id": "pass",
   "$type": "final",
   "onEntry": [
    $log_l21_c27
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l22_c27
   ]
  }
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test527.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3Q1MjcudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFLMkMsYUFBTSxDQUFDLEksQ0FBSyxFLENBQUcsSzs7Ozs7O0FBV3JDLFk7Ozs7OztBQUtnQyxhOzs7Ozs7QUFBMUIseUQ7Ozs7OztBQUMwQixhOzs7Ozs7QUFBMUIseUQifQ==