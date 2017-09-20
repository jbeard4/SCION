//Generated on 2017-9-20 12:41:06 by the SCION SCXML compiler
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
function $script_l14_c5(_event){
throw new Error("You can't change system variables: _sessionid")
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
function $cond_l24_c21(_event){
return Var1==_sessionid;
};
$cond_l24_c21.tagname='undefined';
$cond_l24_c21.line=24;
$cond_l24_c21.column=21;
function $expr_l29_c56(_event){
return 'pass';
};
$expr_l29_c56.tagname='undefined';
$expr_l29_c56.line=29;
$expr_l29_c56.column=56;
function $log_l29_c30(_event){
this.log("Outcome",$expr_l29_c56.apply(this, arguments));
};
$log_l29_c30.tagname='log';
$log_l29_c30.line=29;
$log_l29_c30.column=30;
function $expr_l30_c56(_event){
return 'fail';
};
$expr_l30_c56.tagname='undefined';
$expr_l30_c56.line=30;
$expr_l30_c56.column=56;
function $log_l30_c30(_event){
this.log("Outcome",$expr_l30_c56.apply(this, arguments));
};
$log_l30_c30.tagname='log';
$log_l30_c30.line=30;
$log_l30_c30.column=30;
function $data_l3_c24(_event){
return _sessionid;
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
 "name": "machineName",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "s0",
   "$type": "state",
   "transitions": [
    {
     "target": "s1"
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
   "transitions": [
    {
     "cond": $cond_l24_c21,
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
    $log_l29_c30
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l30_c30
   ]
  }
 ],
 "onEntry": [
  $datamodel_l2_c1
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test322.txml.scxml"
};
}
module.exports = machineNameConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QzMjIudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFjSyxLLENBQU0sRyxDQUFJLEtBQUssQ0FBQywrQ0FBK0MsQzs7Ozs7O0FBQy9ELHVDOzs7Ozs7QUFTZ0IsV0FBSSxFQUFFLFU7Ozs7OztBQUs2QixhOzs7Ozs7QUFBMUIseUQ7Ozs7OztBQUMwQixhOzs7Ozs7QUFBMUIseUQ7Ozs7OztBQTNCTixpQjs7Ozs7O0FBRHZCLDRFIn0=