//Generated on 2017-9-20 12:41:20 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
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
function $cond_l15_c19(_event){
return Var1<Var2;
};
$cond_l15_c19.tagname='undefined';
$cond_l15_c19.line=15;
$cond_l15_c19.column=19;
function $expr_l16_c39(_event){
return Var2;
};
$expr_l16_c39.tagname='undefined';
$expr_l16_c39.line=16;
$expr_l16_c39.column=39;
function $assign_l16_c10(_event){
Var1 = $expr_l16_c39.apply(this, arguments);
};
$assign_l16_c10.tagname='assign';
$assign_l16_c10.line=16;
$assign_l16_c10.column=10;
function $expr_l19_c39(_event){
return 0;
};
$expr_l19_c39.tagname='undefined';
$expr_l19_c39.line=19;
$expr_l19_c39.column=39;
function $assign_l19_c10(_event){
Var4 = $expr_l19_c39.apply(this, arguments);
};
$assign_l19_c10.tagname='assign';
$assign_l19_c10.line=19;
$assign_l19_c10.column=10;
function $if_l15_c10(_event){
if($cond_l15_c19.apply(this, arguments)){
    $assign_l16_c10.apply(this, arguments);
}else{
    $assign_l19_c10.apply(this, arguments);
}
};
$if_l15_c10.tagname='if';
$if_l15_c10.line=15;
$if_l15_c10.column=10;
function $foreach_l14_c9(_event){
var $i;
var $scionArray_11 = Var3;
if(Array.isArray($scionArray_11)){
    for($i = 0; $i < $scionArray_11.length;$i++){
       Var2 = $scionArray_11[$i];
       $if_l15_c10.apply(this, arguments);
       if($i === ($scionArray_11.length - 1)) break;
    }
} else if (typeof $scionArray_11 === "object"){
    for($i in $scionArray_11){
        if($scionArray_11.hasOwnProperty($i)){
           Var2 = $scionArray_11[$i];
           $if_l15_c10.apply(this, arguments);
        }
    }
} else {
   throw new Error("Variable Var3 does not contain a legal array value");
}
};
$foreach_l14_c9.tagname='foreach';
$foreach_l14_c9.line=14;
$foreach_l14_c9.column=9;
function $cond_l25_c20(_event){
return Var4==0;
};
$cond_l25_c20.tagname='undefined';
$cond_l25_c20.line=25;
$cond_l25_c20.column=20;
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
function $data_l4_c24(_event){
return 0;
};
$data_l4_c24.tagname='undefined';
$data_l4_c24.line=4;
$data_l4_c24.column=24;
function $data_l6_c18(_event){
return [1,2,3];
};
$data_l6_c18.tagname='undefined';
$data_l6_c18.line=6;
$data_l6_c18.column=18;
function $data_l9_c24(_event){
return 1;
};
$data_l9_c24.tagname='undefined';
$data_l9_c24.line=9;
$data_l9_c24.column=24;
function $datamodel_l3_c1(_event){
if(typeof Var1 === "undefined")  Var1 = $data_l4_c24.apply(this, arguments);
if(typeof Var3 === "undefined")  Var3 = $data_l6_c18.apply(this, arguments);
if(typeof Var4 === "undefined")  Var4 = $data_l9_c24.apply(this, arguments);
};
$datamodel_l3_c1.tagname='datamodel';
$datamodel_l3_c1.line=3;
$datamodel_l3_c1.column=1;
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
    $foreach_l14_c9
   ],
   "transitions": [
    {
     "cond": $cond_l25_c20,
     "target": "fail"
    },
    {
     "target": "pass"
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
  $datamodel_l3_c1
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test153.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QxNTMudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZW1CLFdBQUksQ0FBQyxJOzs7Ozs7QUFDZSxXOzs7Ozs7QUFBN0IsNEM7Ozs7OztBQUc2QixROzs7Ozs7QUFBN0IsNEM7Ozs7OztBQUpBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQzs7Ozs7O0FBREQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEM7Ozs7OztBQVdXLFdBQUksRUFBRSxDOzs7Ozs7QUFJOEIsYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUFDMEIsYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUExQk4sUTs7Ozs7O0FBRU4sUUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQzs7Ozs7O0FBR0EsUTs7Ozs7O0FBTnZCO0FBQUE7QUFBQSw0RSJ9