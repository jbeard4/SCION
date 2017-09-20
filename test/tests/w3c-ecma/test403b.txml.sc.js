//Generated on 2017-9-20 12:40:44 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
var Var1;
function $deserializeDatamodel($serializedDatamodel){
  Var1 = $serializedDatamodel["Var1"];
}
function $serializeDatamodel(){
   return {
  "Var1" : Var1
   };
}
function $expr_l10_c34(_event){
return Var1 + 1;
};
$expr_l10_c34.tagname='undefined';
$expr_l10_c34.line=10;
$expr_l10_c34.column=34;
function $assign_l10_c5(_event){
Var1 = $expr_l10_c34.apply(this, arguments);
};
$assign_l10_c5.tagname='assign';
$assign_l10_c5.line=10;
$assign_l10_c5.column=5;
function $raise_l18_c6(_event){
this.raise({ name:"event1", data : null});
};
$raise_l18_c6.tagname='raise';
$raise_l18_c6.line=18;
$raise_l18_c6.column=6;
function $raise_l19_c6(_event){
this.raise({ name:"event2", data : null});
};
$raise_l19_c6.tagname='raise';
$raise_l19_c6.line=19;
$raise_l19_c6.column=6;
function $expr_l24_c36(_event){
return Var1 + 1;
};
$expr_l24_c36.tagname='undefined';
$expr_l24_c36.line=24;
$expr_l24_c36.column=36;
function $assign_l24_c7(_event){
Var1 = $expr_l24_c36.apply(this, arguments);
};
$assign_l24_c7.tagname='assign';
$assign_l24_c7.line=24;
$assign_l24_c7.column=7;
function $cond_l28_c36(_event){
return Var1==1;
};
$cond_l28_c36.tagname='undefined';
$cond_l28_c36.line=28;
$cond_l28_c36.column=36;
function $expr_l37_c53(_event){
return 'pass';
};
$expr_l37_c53.tagname='undefined';
$expr_l37_c53.line=37;
$expr_l37_c53.column=53;
function $log_l37_c27(_event){
this.log("Outcome",$expr_l37_c53.apply(this, arguments));
};
$log_l37_c27.tagname='log';
$log_l37_c27.line=37;
$log_l37_c27.column=27;
function $expr_l38_c53(_event){
return 'fail';
};
$expr_l38_c53.tagname='undefined';
$expr_l38_c53.line=38;
$expr_l38_c53.column=53;
function $log_l38_c27(_event){
this.log("Outcome",$expr_l38_c53.apply(this, arguments));
};
$log_l38_c27.tagname='log';
$log_l38_c27.line=38;
$log_l38_c27.column=27;
function $data_l3_c25(_event){
return 0;
};
$data_l3_c25.tagname='undefined';
$data_l3_c25.line=3;
$data_l3_c25.column=25;
function $datamodel_l2_c3(_event){
if(typeof Var1 === "undefined")  Var1 = $data_l3_c25.apply(this, arguments);
};
$datamodel_l2_c3.tagname='datamodel';
$datamodel_l2_c3.line=2;
$datamodel_l2_c3.column=3;
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "{http://www.w3.org/2000/xmlns/}conf": "http://www.w3.org/2005/scxml-conformance",
 "initial": "s0",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "s0",
   "initial": "p0",
   "$type": "state",
   "transitions": [
    {
     "event": "event1",
     "onTransition": $assign_l10_c5
    }
   ],
   "states": [
    {
     "id": "p0",
     "$type": "parallel",
     "onEntry": [
      $raise_l18_c6,
      $raise_l19_c6
     ],
     "transitions": [
      {
       "event": "event1",
       "onTransition": $assign_l24_c7
      }
     ],
     "states": [
      {
       "id": "p0s1",
       "$type": "state",
       "transitions": [
        {
         "event": "event2",
         "cond": $cond_l28_c36,
         "target": "pass"
        },
        {
         "event": "event2",
         "target": "fail"
        }
       ]
      },
      {
       "id": "p0s2",
       "$type": "state"
      }
     ]
    }
   ]
  },
  {
   "id": "pass",
   "$type": "final",
   "onEntry": [
    $log_l37_c27
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l38_c27
   ]
  }
 ],
 "onEntry": [
  $datamodel_l2_c3
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test403b.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3Q0MDNiLnR4bWwuc2N4bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQVVrQyxXLENBQUssQyxDQUFFLEM7Ozs7OztBQUFwQyw0Qzs7Ozs7O0FBUUMsMEM7Ozs7OztBQUNBLDBDOzs7Ozs7QUFLOEIsVyxDQUFLLEMsQ0FBRSxDOzs7Ozs7QUFBcEMsNEM7Ozs7OztBQUk2QixXQUFJLEVBQUUsQzs7Ozs7O0FBU1csYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUFDMEIsYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUFuQ0YsUTs7Ozs7O0FBRHRCLDRFIn0=