//Generated on 2017-9-20 12:40:33 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
var foo;

    function testobject() {
this.bar = 0;}
function $deserializeDatamodel($serializedDatamodel){
  foo = $serializedDatamodel["foo"];
}
function $serializeDatamodel(){
   return {
  "foo" : foo
   };
}
function $expr_l11_c32(_event){
return new testobject();;
};
$expr_l11_c32.tagname='undefined';
$expr_l11_c32.line=11;
$expr_l11_c32.column=32;
function $assign_l11_c4(_event){
foo = $expr_l11_c32.apply(this, arguments);
};
$assign_l11_c4.tagname='assign';
$assign_l11_c4.line=11;
$assign_l11_c4.column=4;
function $expr_l13_c36(_event){
return 1;
};
$expr_l13_c36.tagname='undefined';
$expr_l13_c36.line=13;
$expr_l13_c36.column=36;
function $assign_l13_c4(_event){
foo.bar = $expr_l13_c36.apply(this, arguments);
};
$assign_l13_c4.tagname='assign';
$assign_l13_c4.line=13;
$assign_l13_c4.column=4;
function $raise_l14_c4(_event){
this.raise({ name:"event1", data : null});
};
$raise_l14_c4.tagname='raise';
$raise_l14_c4.line=14;
$raise_l14_c4.column=4;
function $cond_l17_c36(_event){
return foo.bar == 1;
};
$cond_l17_c36.tagname='undefined';
$cond_l17_c36.line=17;
$cond_l17_c36.column=36;
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
function $data_l3_c24(_event){
return 0;
};
$data_l3_c24.tagname='undefined';
$data_l3_c24.line=3;
$data_l3_c24.column=24;
function $datamodel_l2_c2(_event){
if(typeof foo === "undefined")  foo = $data_l3_c24.apply(this, arguments);
};
$datamodel_l2_c2.tagname='datamodel';
$datamodel_l2_c2.line=2;
$datamodel_l2_c2.column=2;
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "{http://www.w3.org/2000/xmlns/}conf": "http://www.w3.org/2005/scxml-conformance",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "s0",
   "$type": "state",
   "onEntry": [
    $assign_l11_c4,
    $assign_l13_c4,
    $raise_l14_c4
   ],
   "transitions": [
    {
     "event": "event1",
     "cond": $cond_l17_c36,
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
 "onEntry": [
  $datamodel_l2_c2
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test452.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3Q0NTIudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztJQU1JLFEsQ0FBUyxVQUFVLENBQUMsQyxDQUFFLEM7QUFDdEIsSUFBSSxDQUFDLEcsQ0FBSSxDLENBQUUsQ0FBQyxDQUFDLEM7Ozs7Ozs7Ozs7QUFJZSxVLENBQUksVUFBVSxDQUFDLENBQUMsQzs7Ozs7O0FBQTVDLDJDOzs7Ozs7QUFFZ0MsUTs7Ozs7O0FBQWhDLCtDOzs7Ozs7QUFDQSwwQzs7Ozs7O0FBR2dDLFVBQUcsQ0FBQyxHLENBQUksRSxDQUFHLEM7Ozs7OztBQUlNLGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBQzBCLGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBbkJILFE7Ozs7OztBQUR0QiwwRSJ9