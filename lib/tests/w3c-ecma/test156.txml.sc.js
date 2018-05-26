//Generated on 2017-9-20 12:39:53 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
var Var1, Var2, Var3;
function $deserializeDatamodel($serializedDatamodel){
  Var1 = $serializedDatamodel["Var1"];
  Var2 = $serializedDatamodel["Var2"];
  Var3 = $serializedDatamodel["Var3"];
}
function $serializeDatamodel(){
   return {
  "Var1" : Var1,
  "Var2" : Var2,
  "Var3" : Var3
   };
}
function $expr_l14_c40(_event){
return Var1 + 1;
};
$expr_l14_c40.tagname='undefined';
$expr_l14_c40.line=14;
$expr_l14_c40.column=40;
function $assign_l14_c11(_event){
Var1 = $expr_l14_c40.apply(this, arguments);
};
$assign_l14_c11.tagname='assign';
$assign_l14_c11.line=14;
$assign_l14_c11.column=11;
function $script_l16_c11(_event){
throw new Error("Assignment to location not declared in the datamodel:Var5")
};
$script_l16_c11.tagname='script';
$script_l16_c11.line=16;
$script_l16_c11.column=11;
function $foreach_l13_c9(_event){
var $i;
var $scionArray_11 = Var3;
if(Array.isArray($scionArray_11)){
    for($i = 0; $i < $scionArray_11.length;$i++){
       Var2 = $scionArray_11[$i];
       $assign_l14_c11.apply(this, arguments);
       $script_l16_c11.apply(this, arguments);
       if($i === ($scionArray_11.length - 1)) break;
    }
} else if (typeof $scionArray_11 === "object"){
    for($i in $scionArray_11){
        if($scionArray_11.hasOwnProperty($i)){
           Var2 = $scionArray_11[$i];
           $assign_l14_c11.apply(this, arguments);
           $script_l16_c11.apply(this, arguments);
        }
    }
} else {
   throw new Error("Variable Var3 does not contain a legal array value");
}
};
$foreach_l13_c9.tagname='foreach';
$foreach_l13_c9.line=13;
$foreach_l13_c9.column=9;
function $cond_l20_c20(_event){
return Var1==1;
};
$cond_l20_c20.tagname='undefined';
$cond_l20_c20.line=20;
$cond_l20_c20.column=20;
function $expr_l24_c56(_event){
return 'pass';
};
$expr_l24_c56.tagname='undefined';
$expr_l24_c56.line=24;
$expr_l24_c56.column=56;
function $log_l24_c30(_event){
this.log("Outcome",$expr_l24_c56.apply(this, arguments));
};
$log_l24_c30.tagname='log';
$log_l24_c30.line=24;
$log_l24_c30.column=30;
function $expr_l25_c56(_event){
return 'fail';
};
$expr_l25_c56.tagname='undefined';
$expr_l25_c56.line=25;
$expr_l25_c56.column=56;
function $log_l25_c30(_event){
this.log("Outcome",$expr_l25_c56.apply(this, arguments));
};
$log_l25_c30.tagname='log';
$log_l25_c30.line=25;
$log_l25_c30.column=30;
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
function $datamodel_l3_c1(_event){
if(typeof Var1 === "undefined")  Var1 = $data_l4_c24.apply(this, arguments);
if(typeof Var3 === "undefined")  Var3 = $data_l6_c18.apply(this, arguments);
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
    $foreach_l13_c9
   ],
   "transitions": [
    {
     "cond": $cond_l20_c20,
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
    $log_l24_c30
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l25_c30
   ]
  }
 ],
 "onEntry": [
  $datamodel_l3_c1
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test156.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QxNTYudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQWN3QyxXLENBQUssQyxDQUFFLEM7Ozs7OztBQUFwQyw0Qzs7Ozs7O0FBRUEsSyxDQUFNLEcsQ0FBSSxLQUFLLENBQUMsMkRBQTJELEM7Ozs7OztBQUg3RTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEM7Ozs7OztBQU9XLFdBQUksRUFBRSxDOzs7Ozs7QUFJOEIsYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUFDMEIsYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUFyQk4sUTs7Ozs7O0FBRU4sUUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQzs7Ozs7O0FBSHZCO0FBQUEsNEUifQ==