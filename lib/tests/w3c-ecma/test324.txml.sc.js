//Generated on 2017-9-20 12:41:13 by the SCION SCXML compiler
function machineNameConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'machineName';
function $deserializeDatamodel($serializedDatamodel){

}
function $serializeDatamodel(){
   return {

   };
}
function $cond_l4_c21(_event){
return _name  === 'machineName';
};
$cond_l4_c21.tagname='undefined';
$cond_l4_c21.line=4;
$cond_l4_c21.column=21;
function $script_l10_c5(_event){
throw new Error("You can't change system variables: _name")
};
$script_l10_c5.tagname='script';
$script_l10_c5.line=10;
$script_l10_c5.column=5;
function $cond_l12_c21(_event){
return _name  === 'machineName';
};
$cond_l12_c21.tagname='undefined';
$cond_l12_c21.line=12;
$cond_l12_c21.column=21;
function $expr_l17_c56(_event){
return 'pass';
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
function $expr_l18_c56(_event){
return 'fail';
};
$expr_l18_c56.tagname='undefined';
$expr_l18_c56.line=18;
$expr_l18_c56.column=56;
function $log_l18_c30(_event){
this.log("Outcome",$expr_l18_c56.apply(this, arguments));
};
$log_l18_c30.tagname='log';
$log_l18_c30.line=18;
$log_l18_c30.column=30;
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
   "transitions": [
    {
     "cond": $cond_l4_c21,
     "target": "s1"
    },
    {
     "target": "fail"
    }
   ]
  },
  {
   "id": "s1",
   "$type": "state",
   "onEntry": [
    $script_l10_c5
   ],
   "transitions": [
    {
     "cond": $cond_l12_c21,
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
    $log_l17_c30
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l18_c30
   ]
  }
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test324.txml.scxml"
};
}
module.exports = machineNameConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QzMjQudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFJcUIsWSxFQUFPLEcsQ0FBSSxhOzs7Ozs7QUFNM0IsSyxDQUFNLEcsQ0FBSSxLQUFLLENBQUMsMENBQTBDLEM7Ozs7OztBQUUxQyxZLEVBQU8sRyxDQUFJLGE7Ozs7OztBQUt3QixhOzs7Ozs7QUFBMUIseUQ7Ozs7OztBQUMwQixhOzs7Ozs7QUFBMUIseUQifQ==