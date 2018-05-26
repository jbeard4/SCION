//Generated on 2017-9-20 12:40:15 by the SCION SCXML compiler
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
function $script_l20_c6(_event){
throw new Error("Line 1: Unexpected token return")
};
$script_l20_c6.tagname='script';
$script_l20_c6.line=20;
$script_l20_c6.column=6;
function $raise_l21_c7(_event){
this.raise({ name:"foo", data : null});
};
$raise_l21_c7.tagname='raise';
$raise_l21_c7.line=21;
$raise_l21_c7.column=7;
function $expr_l29_c53(_event){
return 'pass';
};
$expr_l29_c53.tagname='undefined';
$expr_l29_c53.line=29;
$expr_l29_c53.column=53;
function $log_l29_c27(_event){
this.log("Outcome",$expr_l29_c53.apply(this, arguments));
};
$log_l29_c27.tagname='log';
$log_l29_c27.line=29;
$log_l29_c27.column=27;
function $expr_l30_c53(_event){
return 'fail';
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
function $data_l3_c24(_event){
return 1;
};
$data_l3_c24.tagname='undefined';
$data_l3_c24.line=3;
$data_l3_c24.column=24;
function $datamodel_l2_c1(_event){
if(typeof Var1 === "undefined")  Var1 = $data_l3_c24.apply(this, arguments);
};
$datamodel_l2_c1.tagname='datamodel';
$datamodel_l2_c1.line=2;
$datamodel_l2_c1.column=1;
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
     "$type": "state",
     "transitions": [
      {
       "target": "s03"
      }
     ]
    },
    {
     "id": "s03",
     "$type": "state",
     "onEntry": [
      $script_l20_c6,
      $raise_l21_c7
     ],
     "transitions": [
      {
       "event": "error.execution",
       "target": "pass"
      },
      {
       "event": ".*",
       "target": "fail"
      }
     ]
    }
   ]
  },
  {
   "id": "pass",
   "$type": "final",
   "onEntry": [
    $log_l29_c27
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l30_c27
   ]
  }
 ],
 "onEntry": [
  $datamodel_l2_c1
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test314.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QzMTQudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBb0JNLEssQ0FBTSxHLENBQUksS0FBSyxDQUFDLGlDQUFpQyxDOzs7Ozs7QUFDaEQsdUM7Ozs7OztBQVE4QyxhOzs7Ozs7QUFBMUIseUQ7Ozs7OztBQUMwQixhOzs7Ozs7QUFBMUIseUQ7Ozs7OztBQTNCSCxROzs7Ozs7QUFEdkIsNEUifQ==