//Generated on 2017-9-20 12:41:15 by the SCION SCXML compiler
function machineNameConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'machineName';
var Var1, Var2;
function $deserializeDatamodel($serializedDatamodel){
  Var1 = $serializedDatamodel["Var1"];
  Var2 = $serializedDatamodel["Var2"];
}
function $serializeDatamodel(){
   return {
  "Var1" : Var1,
  "Var2" : Var2
   };
}
function $cond_l7_c22(_event){
return Var1;
};
$cond_l7_c22.tagname='undefined';
$cond_l7_c22.line=7;
$cond_l7_c22.column=22;
function $cond_l8_c21(_event){
return true;
};
$cond_l8_c21.tagname='undefined';
$cond_l8_c21.line=8;
$cond_l8_c21.column=21;
function $script_l14_c5(_event){
throw new Error("You can't change system variables: _ioprocessors")
};
$script_l14_c5.tagname='script';
$script_l14_c5.line=14;
$script_l14_c5.column=5;
function $raise_l15_c5(_event){
this.raise({ name:"foo", data : null});
};
$raise_l15_c5.tagname='raise';
$raise_l15_c5.line=15;
$raise_l15_c5.column=5;
function $expr_l24_c35(_event){
return _ioprocessors;
};
$expr_l24_c35.tagname='undefined';
$expr_l24_c35.line=24;
$expr_l24_c35.column=35;
function $assign_l24_c6(_event){
Var2 = $expr_l24_c35.apply(this, arguments);
};
$assign_l24_c6.tagname='assign';
$assign_l24_c6.line=24;
$assign_l24_c6.column=6;
function $cond_l26_c21(_event){
return Var1==Var2;
};
$cond_l26_c21.tagname='undefined';
$cond_l26_c21.line=26;
$cond_l26_c21.column=21;
function $expr_l31_c56(_event){
return 'pass';
};
$expr_l31_c56.tagname='undefined';
$expr_l31_c56.line=31;
$expr_l31_c56.column=56;
function $log_l31_c30(_event){
this.log("Outcome",$expr_l31_c56.apply(this, arguments));
};
$log_l31_c30.tagname='log';
$log_l31_c30.line=31;
$log_l31_c30.column=30;
function $expr_l32_c56(_event){
return 'fail';
};
$expr_l32_c56.tagname='undefined';
$expr_l32_c56.line=32;
$expr_l32_c56.column=56;
function $log_l32_c30(_event){
this.log("Outcome",$expr_l32_c56.apply(this, arguments));
};
$log_l32_c30.tagname='log';
$log_l32_c30.line=32;
$log_l32_c30.column=30;
function $data_l2_c24(_event){
return _ioprocessors;
};
$data_l2_c24.tagname='undefined';
$data_l2_c24.line=2;
$data_l2_c24.column=24;
function $datamodel_l1_c1(_event){
if(typeof Var1 === "undefined")  Var1 = $data_l2_c24.apply(this, arguments);
};
$datamodel_l1_c1.tagname='datamodel';
$datamodel_l1_c1.line=1;
$datamodel_l1_c1.column=1;
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
     "cond": $cond_l7_c22,
     "target": "s1"
    },
    {
     "cond": $cond_l8_c21,
     "target": "fail"
    }
   ]
  },
  {
   "id": "s1",
   "$type": "state",
   "onEntry": [
    $script_l14_c5,
    $raise_l15_c5
   ],
   "transitions": [
    {
     "event": "error.execution",
     "target": "s2"
    },
    {
     "event": "*",
     "target": "fail"
    }
   ]
  },
  {
   "id": "s2",
   "$type": "state",
   "onEntry": [
    $assign_l24_c6
   ],
   "transitions": [
    {
     "cond": $cond_l26_c21,
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
    $log_l31_c30
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l32_c30
   ]
  }
 ],
 "onEntry": [
  $datamodel_l1_c1
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test326.txml.scxml"
};
}
module.exports = machineNameConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QzMjYudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFPc0IsVzs7Ozs7O0FBQ0QsVzs7Ozs7O0FBTWhCLEssQ0FBTSxHLENBQUksS0FBSyxDQUFDLGtEQUFrRCxDOzs7Ozs7QUFDbEUsdUM7Ozs7OztBQVM4QixvQjs7Ozs7O0FBQTdCLDRDOzs7Ozs7QUFFZSxXQUFJLEVBQUUsSTs7Ozs7O0FBSzZCLGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBQzBCLGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBOUJOLG9COzs7Ozs7QUFEdkIsNEUifQ==