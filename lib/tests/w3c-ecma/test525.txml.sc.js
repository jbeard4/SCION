//Generated on 2017-9-20 12:41:33 by the SCION SCXML compiler
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
function $expr_l12_c34(_event){
return [].concat(Var1, [4]);
};
$expr_l12_c34.tagname='undefined';
$expr_l12_c34.line=12;
$expr_l12_c34.column=34;
function $assign_l12_c5(_event){
Var1 = $expr_l12_c34.apply(this, arguments);
};
$assign_l12_c5.tagname='assign';
$assign_l12_c5.line=12;
$assign_l12_c5.column=5;
function $expr_l13_c34(_event){
return Var2 + 1;
};
$expr_l13_c34.tagname='undefined';
$expr_l13_c34.line=13;
$expr_l13_c34.column=34;
function $assign_l13_c5(_event){
Var2 = $expr_l13_c34.apply(this, arguments);
};
$assign_l13_c5.tagname='assign';
$assign_l13_c5.line=13;
$assign_l13_c5.column=5;
function $foreach_l11_c3(_event){
var $i;
var $scionArray_21 = Var1;
if(Array.isArray($scionArray_21)){
    for($i = 0; $i < $scionArray_21.length;$i++){
       Var3 = $scionArray_21[$i];
       $assign_l12_c5.apply(this, arguments);
       $assign_l13_c5.apply(this, arguments);
       if($i === ($scionArray_21.length - 1)) break;
    }
} else if (typeof $scionArray_21 === "object"){
    for($i in $scionArray_21){
        if($scionArray_21.hasOwnProperty($i)){
           Var3 = $scionArray_21[$i];
           $assign_l12_c5.apply(this, arguments);
           $assign_l13_c5.apply(this, arguments);
        }
    }
} else {
   throw new Error("Variable Var1 does not contain a legal array value");
}
};
$foreach_l11_c3.tagname='foreach';
$foreach_l11_c3.line=11;
$foreach_l11_c3.column=3;
function $cond_l17_c21(_event){
return Var2==3;
};
$cond_l17_c21.tagname='undefined';
$cond_l17_c21.line=17;
$cond_l17_c21.column=21;
function $expr_l23_c53(_event){
return 'pass';
};
$expr_l23_c53.tagname='undefined';
$expr_l23_c53.line=23;
$expr_l23_c53.column=53;
function $log_l23_c27(_event){
this.log("Outcome",$expr_l23_c53.apply(this, arguments));
};
$log_l23_c27.tagname='log';
$log_l23_c27.line=23;
$log_l23_c27.column=27;
function $expr_l24_c53(_event){
return 'fail';
};
$expr_l24_c53.tagname='undefined';
$expr_l24_c53.line=24;
$expr_l24_c53.column=53;
function $log_l24_c27(_event){
this.log("Outcome",$expr_l24_c53.apply(this, arguments));
};
$log_l24_c27.tagname='log';
$log_l24_c27.line=24;
$log_l24_c27.column=27;
function $data_l3_c20(_event){
return [1,2,3];
};
$data_l3_c20.tagname='undefined';
$data_l3_c20.line=3;
$data_l3_c20.column=20;
function $data_l6_c26(_event){
return 0;
};
$data_l6_c26.tagname='undefined';
$data_l6_c26.line=6;
$data_l6_c26.column=26;
function $datamodel_l2_c3(_event){
if(typeof Var1 === "undefined")  Var1 = $data_l3_c20.apply(this, arguments);
if(typeof Var2 === "undefined")  Var2 = $data_l6_c26.apply(this, arguments);
};
$datamodel_l2_c3.tagname='datamodel';
$datamodel_l2_c3.line=2;
$datamodel_l2_c3.column=3;
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
    $foreach_l11_c3
   ],
   "transitions": [
    {
     "cond": $cond_l17_c21,
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
    $log_l23_c27
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l24_c27
   ]
  }
 ],
 "onEntry": [
  $datamodel_l2_c3
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test525.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3Q1MjUudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQVlrQyxRQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDLENBQUUsQ0FBQyxDQUFDLENBQUMsQzs7Ozs7O0FBQWhELDRDOzs7Ozs7QUFDNkIsVyxDQUFLLEMsQ0FBRSxDOzs7Ozs7QUFBcEMsNEM7Ozs7OztBQUZGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQzs7Ozs7O0FBTWtCLFdBQUksRUFBRSxDOzs7Ozs7QUFNMEIsYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUFDMEIsYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUFyQlAsUUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQzs7Ozs7O0FBR0EsUTs7Ozs7O0FBSnZCO0FBQUEsNEUifQ==