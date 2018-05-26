//Generated on 2017-9-20 12:40:35 by the SCION SCXML compiler
function machineNameConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'machineName';
var Var1;
function $deserializeDatamodel($serializedDatamodel){
  Var1 = $serializedDatamodel["Var1"];
}
function $serializeDatamodel(){
   return {
  "Var1" : Var1
   };
}
function $raise_l7_c6(_event){
this.raise({ name:"foo", data : null});
};
$raise_l7_c6.tagname='raise';
$raise_l7_c6.line=7;
$raise_l7_c6.column=6;
function $raise_l14_c5(_event){
this.raise({ name:"bar", data : null});
};
$raise_l14_c5.tagname='raise';
$raise_l14_c5.line=14;
$raise_l14_c5.column=5;
function $expr_l16_c34(_event){
return _event.name;
};
$expr_l16_c34.tagname='undefined';
$expr_l16_c34.line=16;
$expr_l16_c34.column=34;
function $assign_l16_c5(_event){
Var1 = $expr_l16_c34.apply(this, arguments);
};
$assign_l16_c5.tagname='assign';
$assign_l16_c5.line=16;
$assign_l16_c5.column=5;
function $cond_l18_c21(_event){
return Var1=='foo';
};
$cond_l18_c21.tagname='undefined';
$cond_l18_c21.line=18;
$cond_l18_c21.column=21;
function $expr_l23_c56(_event){
return 'pass';
};
$expr_l23_c56.tagname='undefined';
$expr_l23_c56.line=23;
$expr_l23_c56.column=56;
function $log_l23_c30(_event){
this.log("Outcome",$expr_l23_c56.apply(this, arguments));
};
$log_l23_c30.tagname='log';
$log_l23_c30.line=23;
$log_l23_c30.column=30;
function $expr_l24_c56(_event){
return 'fail';
};
$expr_l24_c56.tagname='undefined';
$expr_l24_c56.line=24;
$expr_l24_c56.column=56;
function $log_l24_c30(_event){
this.log("Outcome",$expr_l24_c56.apply(this, arguments));
};
$log_l24_c30.tagname='log';
$log_l24_c30.line=24;
$log_l24_c30.column=30;
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
    $raise_l7_c6
   ],
   "transitions": [
    {
     "event": "foo",
     "target": "s1"
    }
   ]
  },
  {
   "id": "s1",
   "$type": "state",
   "onEntry": [
    $raise_l14_c5,
    $assign_l16_c5
   ],
   "transitions": [
    {
     "cond": $cond_l18_c21,
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
    $log_l23_c30
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l24_c30
   ]
  }
 ],
 "onEntry": [],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test318.txml.scxml"
};
}
module.exports = machineNameConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QzMTgudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBT00sdUM7Ozs7OztBQU9ELHVDOzs7Ozs7QUFFNkIsYUFBTSxDQUFDLEk7Ozs7OztBQUFwQyw0Qzs7Ozs7O0FBRWdCLFdBQUksRUFBRSxLOzs7Ozs7QUFLNkIsYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUFDMEIsYTs7Ozs7O0FBQTFCLHlEIn0=