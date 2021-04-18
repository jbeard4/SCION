//Generated on 2017-9-20 12:41:19 by the SCION SCXML compiler
function machineNameConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'machineName';
var Var1, Var2, Var3, Var4;
function $deserializeDatamodel($serializedDatamodel){
  Var1 = $serializedDatamodel["Var1"];
  Var2 = $serializedDatamodel["Var2"];
  Var3 = $serializedDatamodel["Var3"];
  Var4 = $serializedDatamodel["Var4"];
}
function $serializeDatamodel(){
   return {
  "Var1" : Var1,
  "Var2" : Var2,
  "Var3" : Var3,
  "Var4" : Var4
   };
}
function $raise_l11_c6(_event){
this.raise({ name:"foo", data : null});
};
$raise_l11_c6.tagname='raise';
$raise_l11_c6.line=11;
$raise_l11_c6.column=6;
function $expr_l12_c35(_event){
return _sessionid;
};
$expr_l12_c35.tagname='undefined';
$expr_l12_c35.line=12;
$expr_l12_c35.column=35;
function $assign_l12_c6(_event){
Var1 = $expr_l12_c35.apply(this, arguments);
};
$assign_l12_c6.tagname='assign';
$assign_l12_c6.line=12;
$assign_l12_c6.column=6;
function $script_l13_c6(_event){
throw new Error("You can't change system variables: _sessionid")
};
$script_l13_c6.tagname='script';
$script_l13_c6.line=13;
$script_l13_c6.column=6;
function $cond_l16_c33(_event){
return Var1==_sessionid;
};
$cond_l16_c33.tagname='undefined';
$cond_l16_c33.line=16;
$cond_l16_c33.column=33;
function $expr_l22_c35(_event){
return _event;
};
$expr_l22_c35.tagname='undefined';
$expr_l22_c35.line=22;
$expr_l22_c35.column=35;
function $assign_l22_c6(_event){
Var2 = $expr_l22_c35.apply(this, arguments);
};
$assign_l22_c6.tagname='assign';
$assign_l22_c6.line=22;
$assign_l22_c6.column=6;
function $script_l23_c6(_event){
throw new Error("You can't change system variables: _event")
};
$script_l23_c6.tagname='script';
$script_l23_c6.line=23;
$script_l23_c6.column=6;
function $cond_l25_c21(_event){
return Var2==_event;
};
$cond_l25_c21.tagname='undefined';
$cond_l25_c21.line=25;
$cond_l25_c21.column=21;
function $expr_l31_c35(_event){
return _name;
};
$expr_l31_c35.tagname='undefined';
$expr_l31_c35.line=31;
$expr_l31_c35.column=35;
function $assign_l31_c6(_event){
Var3 = $expr_l31_c35.apply(this, arguments);
};
$assign_l31_c6.tagname='assign';
$assign_l31_c6.line=31;
$assign_l31_c6.column=6;
function $script_l32_c6(_event){
throw new Error("You can't change system variables: _name")
};
$script_l32_c6.tagname='script';
$script_l32_c6.line=32;
$script_l32_c6.column=6;
function $cond_l34_c21(_event){
return Var3==_name;
};
$cond_l34_c21.tagname='undefined';
$cond_l34_c21.line=34;
$cond_l34_c21.column=21;
function $expr_l41_c35(_event){
return _ioprocessors;
};
$expr_l41_c35.tagname='undefined';
$expr_l41_c35.line=41;
$expr_l41_c35.column=35;
function $assign_l41_c6(_event){
Var4 = $expr_l41_c35.apply(this, arguments);
};
$assign_l41_c6.tagname='assign';
$assign_l41_c6.line=41;
$assign_l41_c6.column=6;
function $script_l42_c6(_event){
throw new Error("You can't change system variables: _ioprocessors")
};
$script_l42_c6.tagname='script';
$script_l42_c6.line=42;
$script_l42_c6.column=6;
function $cond_l44_c21(_event){
return Var4==_ioprocessors;
};
$cond_l44_c21.tagname='undefined';
$cond_l44_c21.line=44;
$cond_l44_c21.column=21;
function $expr_l49_c56(_event){
return 'pass';
};
$expr_l49_c56.tagname='undefined';
$expr_l49_c56.line=49;
$expr_l49_c56.column=56;
function $log_l49_c30(_event){
this.log("Outcome",$expr_l49_c56.apply(this, arguments));
};
$log_l49_c30.tagname='log';
$log_l49_c30.line=49;
$log_l49_c30.column=30;
function $expr_l50_c56(_event){
return 'fail';
};
$expr_l50_c56.tagname='undefined';
$expr_l50_c56.line=50;
$expr_l50_c56.column=56;
function $log_l50_c30(_event){
this.log("Outcome",$expr_l50_c56.apply(this, arguments));
};
$log_l50_c30.tagname='log';
$log_l50_c30.line=50;
$log_l50_c30.column=30;
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
    $raise_l11_c6,
    $assign_l12_c6,
    $script_l13_c6
   ],
   "transitions": [
    {
     "event": "foo",
     "cond": $cond_l16_c33,
     "target": "s1"
    },
    {
     "event": "*",
     "target": "fail"
    }
   ]
  },
  {
   "id": "s1",
   "$type": "state",
   "onEntry": [
    $assign_l22_c6,
    $script_l23_c6
   ],
   "transitions": [
    {
     "cond": $cond_l25_c21,
     "target": "s2"
    },
    {
     "target": "fail"
    }
   ]
  },
  {
   "id": "s2",
   "$type": "state",
   "onEntry": [
    $assign_l31_c6,
    $script_l32_c6
   ],
   "transitions": [
    {
     "cond": $cond_l34_c21,
     "target": "s3"
    },
    {
     "target": "fail"
    }
   ]
  },
  {
   "id": "s3",
   "$type": "state",
   "onEntry": [
    $assign_l41_c6,
    $script_l42_c6
   ],
   "transitions": [
    {
     "cond": $cond_l44_c21,
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
    $log_l49_c30
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l50_c30
   ]
  }
 ],
 "onEntry": [],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test329.txml.scxml"
};
}
module.exports = machineNameConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QzMjkudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBV00sdUM7Ozs7OztBQUM2QixpQjs7Ozs7O0FBQTdCLDRDOzs7Ozs7QUFDQSxLLENBQU0sRyxDQUFJLEtBQUssQ0FBQywrQ0FBK0MsQzs7Ozs7O0FBR3BDLFdBQUksRUFBRSxVOzs7Ozs7QUFNSixhOzs7Ozs7QUFBN0IsNEM7Ozs7OztBQUNBLEssQ0FBTSxHLENBQUksS0FBSyxDQUFDLDJDQUEyQyxDOzs7Ozs7QUFFNUMsV0FBSSxFQUFFLE07Ozs7OztBQU1RLFk7Ozs7OztBQUE3Qiw0Qzs7Ozs7O0FBQ0EsSyxDQUFNLEcsQ0FBSSxLQUFLLENBQUMsMENBQTBDLEM7Ozs7OztBQUUzQyxXQUFJLEVBQUUsSzs7Ozs7O0FBT1Esb0I7Ozs7OztBQUE3Qiw0Qzs7Ozs7O0FBQ0EsSyxDQUFNLEcsQ0FBSSxLQUFLLENBQUMsa0RBQWtELEM7Ozs7OztBQUVuRCxXQUFJLEVBQUUsYTs7Ozs7O0FBSzZCLGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBQzBCLGE7Ozs7OztBQUExQix5RCJ9