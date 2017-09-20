//Generated on 2017-9-20 12:41:26 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
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
function $raise_l8_c5(_event){
this.raise({ name:"foo", data : null});
};
$raise_l8_c5.tagname='raise';
$raise_l8_c5.line=8;
$raise_l8_c5.column=5;
function $raise_l9_c5(_event){
this.raise({ name:"bar", data : null});
};
$raise_l9_c5.tagname='raise';
$raise_l9_c5.line=9;
$raise_l9_c5.column=5;
function $expr_l16_c33(_event){
return Var1 + 1;
};
$expr_l16_c33.tagname='undefined';
$expr_l16_c33.line=16;
$expr_l16_c33.column=33;
function $assign_l16_c4(_event){
Var1 = $expr_l16_c33.apply(this, arguments);
};
$assign_l16_c4.tagname='assign';
$assign_l16_c4.line=16;
$assign_l16_c4.column=4;
function $expr_l19_c35(_event){
return Var2 + 1;
};
$expr_l19_c35.tagname='undefined';
$expr_l19_c35.line=19;
$expr_l19_c35.column=35;
function $assign_l19_c6(_event){
Var2 = $expr_l19_c35.apply(this, arguments);
};
$assign_l19_c6.tagname='assign';
$assign_l19_c6.line=19;
$assign_l19_c6.column=6;
function $cond_l22_c32(_event){
return Var2==1;
};
$cond_l22_c32.tagname='undefined';
$cond_l22_c32.line=22;
$cond_l22_c32.column=32;
function $cond_l28_c22(_event){
return Var1==1;
};
$cond_l28_c22.tagname='undefined';
$cond_l28_c22.line=28;
$cond_l28_c22.column=22;
function $expr_l33_c53(_event){
return 'pass';
};
$expr_l33_c53.tagname='undefined';
$expr_l33_c53.line=33;
$expr_l33_c53.column=53;
function $log_l33_c27(_event){
this.log("Outcome",$expr_l33_c53.apply(this, arguments));
};
$log_l33_c27.tagname='log';
$log_l33_c27.line=33;
$log_l33_c27.column=27;
function $expr_l34_c53(_event){
return 'fail';
};
$expr_l34_c53.tagname='undefined';
$expr_l34_c53.line=34;
$expr_l34_c53.column=53;
function $log_l34_c27(_event){
this.log("Outcome",$expr_l34_c53.apply(this, arguments));
};
$log_l34_c27.tagname='log';
$log_l34_c27.line=34;
$log_l34_c27.column=27;
function $data_l2_c24(_event){
return 0;
};
$data_l2_c24.tagname='undefined';
$data_l2_c24.line=2;
$data_l2_c24.column=24;
function $data_l3_c24(_event){
return 0;
};
$data_l3_c24.tagname='undefined';
$data_l3_c24.line=3;
$data_l3_c24.column=24;
function $datamodel_l1_c1(_event){
if(typeof Var1 === "undefined")  Var1 = $data_l2_c24.apply(this, arguments);
if(typeof Var2 === "undefined")  Var2 = $data_l3_c24.apply(this, arguments);
};
$datamodel_l1_c1.tagname='datamodel';
$datamodel_l1_c1.line=1;
$datamodel_l1_c1.column=1;
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "{http://www.w3.org/2000/xmlns/}conf": "http://www.w3.org/2005/scxml-conformance",
 "initial": "s1",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "s1",
   "$type": "state",
   "onEntry": [
    $raise_l8_c5,
    $raise_l9_c5
   ],
   "transitions": [
    {
     "target": "s2"
    }
   ]
  },
  {
   "id": "s2",
   "$type": "state",
   "onExit": [
    $assign_l16_c4
   ],
   "transitions": [
    {
     "event": "foo",
     "onTransition": $assign_l19_c6
    },
    {
     "event": "bar",
     "cond": $cond_l22_c32,
     "target": "s3"
    },
    {
     "event": "bar",
     "target": "fail"
    }
   ]
  },
  {
   "id": "s3",
   "$type": "state",
   "transitions": [
    {
     "cond": $cond_l28_c22,
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
    $log_l33_c27
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l34_c27
   ]
  }
 ],
 "onEntry": [
  $datamodel_l1_c1
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test503.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3Q1MDMudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFRSyx1Qzs7Ozs7O0FBQ0EsdUM7Ozs7OztBQU80QixXLENBQUssQyxDQUFFLEM7Ozs7OztBQUFwQyw0Qzs7Ozs7O0FBRytCLFcsQ0FBSyxDLENBQUUsQzs7Ozs7O0FBQXBDLDRDOzs7Ozs7QUFHMEIsV0FBSSxFQUFFLEM7Ozs7OztBQU1oQixXQUFJLEVBQUUsQzs7Ozs7O0FBS3lCLGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBQzBCLGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBaENILFE7Ozs7OztBQUNBLFE7Ozs7OztBQUZ2QjtBQUFBLDRFIn0=