//Generated on 2017-9-20 12:39:59 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
var Var1, Var2, Var3, Var4, Var5;
function $deserializeDatamodel($serializedDatamodel){
  Var1 = $serializedDatamodel["Var1"];
  Var2 = $serializedDatamodel["Var2"];
  Var3 = $serializedDatamodel["Var3"];
  Var4 = $serializedDatamodel["Var4"];
  Var5 = $serializedDatamodel["Var5"];
}
function $serializeDatamodel(){
   return {
  "Var1" : Var1,
  "Var2" : Var2,
  "Var3" : Var3,
  "Var4" : Var4,
  "Var5" : Var5
   };
}
function $expr_l12_c33(_event){
return 3;
};
$expr_l12_c33.tagname='undefined';
$expr_l12_c33.line=12;
$expr_l12_c33.column=33;
function $assign_l12_c4(_event){
Var3 = $expr_l12_c33.apply(this, arguments);
};
$assign_l12_c4.tagname='assign';
$assign_l12_c4.line=12;
$assign_l12_c4.column=4;
function $script_l13_c4(_event){
var Var01 = 4;
var Var02 = 5;
Var1 = 1;
Var2 = 2;
var Var3;
Var4 = Var01;
Var5 = Var02;
};
$script_l13_c4.tagname='script';
$script_l13_c4.line=13;
$script_l13_c4.column=4;
function $cond_l23_c21(_event){
return Var1==1 && Var2==2 && Var3==3 && Var4==4 && Var5==5;
};
$cond_l23_c21.tagname='undefined';
$cond_l23_c21.line=23;
$cond_l23_c21.column=21;
function $expr_l27_c53(_event){
return 'pass';
};
$expr_l27_c53.tagname='undefined';
$expr_l27_c53.line=27;
$expr_l27_c53.column=53;
function $log_l27_c27(_event){
this.log("Outcome",$expr_l27_c53.apply(this, arguments));
};
$log_l27_c27.tagname='log';
$log_l27_c27.line=27;
$log_l27_c27.column=27;
function $expr_l28_c53(_event){
return 'fail';
};
$expr_l28_c53.tagname='undefined';
$expr_l28_c53.line=28;
$expr_l28_c53.column=53;
function $log_l28_c27(_event){
this.log("Outcome",$expr_l28_c53.apply(this, arguments));
};
$log_l28_c27.tagname='log';
$log_l28_c27.line=28;
$log_l28_c27.column=27;
function $data_l3_c22(_event){
return 0;
};
$data_l3_c22.tagname='undefined';
$data_l3_c22.line=3;
$data_l3_c22.column=22;
function $data_l4_c22(_event){
return 0;
};
$data_l4_c22.tagname='undefined';
$data_l4_c22.line=4;
$data_l4_c22.column=22;
function $data_l5_c22(_event){
return 0;
};
$data_l5_c22.tagname='undefined';
$data_l5_c22.line=5;
$data_l5_c22.column=22;
function $data_l6_c22(_event){
return 0;
};
$data_l6_c22.tagname='undefined';
$data_l6_c22.line=6;
$data_l6_c22.column=22;
function $data_l7_c22(_event){
return 0;
};
$data_l7_c22.tagname='undefined';
$data_l7_c22.line=7;
$data_l7_c22.column=22;
function $datamodel_l2_c1(_event){
if(typeof Var1 === "undefined")  Var1 = $data_l3_c22.apply(this, arguments);
if(typeof Var2 === "undefined")  Var2 = $data_l4_c22.apply(this, arguments);
if(typeof Var3 === "undefined")  Var3 = $data_l5_c22.apply(this, arguments);
if(typeof Var4 === "undefined")  Var4 = $data_l6_c22.apply(this, arguments);
if(typeof Var5 === "undefined")  Var5 = $data_l7_c22.apply(this, arguments);
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
   "$type": "state",
   "onEntry": [
    $assign_l12_c4,
    $script_l13_c4
   ],
   "transitions": [
    {
     "cond": $cond_l23_c21,
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
    $log_l27_c27
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l28_c27
   ]
  }
 ],
 "onEntry": [
  $datamodel_l2_c1
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test303-1.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QzMDMtMS50eG1sLnNjeG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVlpQyxROzs7Ozs7QUFBN0IsNEM7Ozs7OztBQUVFLEcsQ0FBSSxLLENBQUEsQyxDQUFRLENBQVosQztJQUNJLEssQ0FBQSxDLENBQVEsQztBQUNSLEksQ0FBQSxDLENBQU8sQztBQUNQLEksQ0FBQSxDLENBQU8sQztJQUNQLEk7QUFDQSxJLENBQUEsQyxDQUFPLEs7QUFDUCxJLENBQUEsQyxDQUFPLEs7Ozs7OztBQUdJLFdBQUksRUFBRSxDLENBQUUsRSxDQUFHLElBQUksRUFBRSxDLENBQUUsRSxDQUFHLElBQUksRUFBRSxDLENBQUUsRSxDQUFHLElBQUksRUFBRSxDLENBQUUsRSxDQUFHLElBQUksRUFBRSxDOzs7Ozs7QUFJbEIsYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUFDMEIsYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUF6QkwsUTs7Ozs7O0FBQ0EsUTs7Ozs7O0FBQ0EsUTs7Ozs7O0FBQ0EsUTs7Ozs7O0FBQ0EsUTs7Ozs7O0FBTHJCO0FBQUE7QUFBQTtBQUFBO0FBQUEsNEUifQ==