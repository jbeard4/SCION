//Generated on 2017-9-20 12:41:16 by the SCION SCXML compiler
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
function $raise_l7_c4(_event){
this.raise({ name:"event1", data : null});
};
$raise_l7_c4.tagname='raise';
$raise_l7_c4.line=7;
$raise_l7_c4.column=4;
function $raise_l8_c4(_event){
this.raise({ name:"event2", data : null});
};
$raise_l8_c4.tagname='raise';
$raise_l8_c4.line=8;
$raise_l8_c4.column=4;
function $expr_l19_c56(_event){
return 'pass';
};
$expr_l19_c56.tagname='undefined';
$expr_l19_c56.line=19;
$expr_l19_c56.column=56;
function $log_l19_c30(_event){
this.log("Outcome",$expr_l19_c56.apply(this, arguments));
};
$log_l19_c30.tagname='log';
$log_l19_c30.line=19;
$log_l19_c30.column=30;
function $expr_l20_c56(_event){
return 'fail';
};
$expr_l20_c56.tagname='undefined';
$expr_l20_c56.line=20;
$expr_l20_c56.column=56;
function $log_l20_c30(_event){
this.log("Outcome",$expr_l20_c56.apply(this, arguments));
};
$log_l20_c30.tagname='log';
$log_l20_c30.line=20;
$log_l20_c30.column=30;
function $data_l2_c24(_event){
return 0;
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
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "s0",
   "$type": "state",
   "onEntry": [
    $raise_l7_c4,
    $raise_l8_c4
   ],
   "transitions": [
    {
     "event": "event1",
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
   "transitions": [
    {
     "event": "event2",
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
    $log_l19_c30
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l20_c30
   ]
  }
 ],
 "onEntry": [
  $datamodel_l1_c1
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test158.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QxNTgudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBT0ksMEM7Ozs7OztBQUNBLDBDOzs7Ozs7QUFXb0QsYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUFDMEIsYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUFsQk4sUTs7Ozs7O0FBRHZCLDRFIn0=