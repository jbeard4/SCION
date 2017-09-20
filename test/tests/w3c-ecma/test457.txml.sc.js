//Generated on 2017-9-20 12:40:16 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
var Var1, Var2, Var3, Var4, Var5, Var6;
function $deserializeDatamodel($serializedDatamodel){
  Var1 = $serializedDatamodel["Var1"];
  Var2 = $serializedDatamodel["Var2"];
  Var3 = $serializedDatamodel["Var3"];
  Var4 = $serializedDatamodel["Var4"];
  Var5 = $serializedDatamodel["Var5"];
  Var6 = $serializedDatamodel["Var6"];
}
function $serializeDatamodel(){
   return {
  "Var1" : Var1,
  "Var2" : Var2,
  "Var3" : Var3,
  "Var4" : Var4,
  "Var5" : Var5,
  "Var6" : Var6
   };
}
function $expr_l15_c40(_event){
return Var1 + 1;
};
$expr_l15_c40.tagname='undefined';
$expr_l15_c40.line=15;
$expr_l15_c40.column=40;
function $assign_l15_c11(_event){
Var1 = $expr_l15_c40.apply(this, arguments);
};
$assign_l15_c11.tagname='assign';
$assign_l15_c11.line=15;
$assign_l15_c11.column=11;
function $foreach_l14_c9(_event){
var $scionArray_11 = Var4;
if(Array.isArray($scionArray_11)){
    for(Var3 = 0; Var3 < $scionArray_11.length;Var3++){
       Var2 = $scionArray_11[Var3];
       $assign_l15_c11.apply(this, arguments);
       if(Var3 === ($scionArray_11.length - 1)) break;
    }
} else if (typeof $scionArray_11 === "object"){
    for(Var3 in $scionArray_11){
        if($scionArray_11.hasOwnProperty(Var3)){
           Var2 = $scionArray_11[Var3];
           $assign_l15_c11.apply(this, arguments);
        }
    }
} else {
   throw new Error("Variable Var4 does not contain a legal array value");
}
};
$foreach_l14_c9.tagname='foreach';
$foreach_l14_c9.line=14;
$foreach_l14_c9.column=9;
function $raise_l17_c9(_event){
this.raise({ name:"foo", data : null});
};
$raise_l17_c9.tagname='raise';
$raise_l17_c9.line=17;
$raise_l17_c9.column=9;
function $script_l26_c9(_event){
throw new Error("Illegal identifier: 'continue'")
};
$script_l26_c9.tagname='script';
$script_l26_c9.line=26;
$script_l26_c9.column=9;
function $raise_l29_c9(_event){
this.raise({ name:"bar", data : null});
};
$raise_l29_c9.tagname='raise';
$raise_l29_c9.line=29;
$raise_l29_c9.column=9;
function $cond_l37_c20(_event){
return Var1==0;
};
$cond_l37_c20.tagname='undefined';
$cond_l37_c20.line=37;
$cond_l37_c20.column=20;
function $expr_l45_c32(_event){
return 0;
};
$expr_l45_c32.tagname='undefined';
$expr_l45_c32.line=45;
$expr_l45_c32.column=32;
function $assign_l45_c3(_event){
Var6 = $expr_l45_c32.apply(this, arguments);
};
$assign_l45_c3.tagname='assign';
$assign_l45_c3.line=45;
$assign_l45_c3.column=3;
function $expr_l47_c33(_event){
return Var6 + Var2;
};
$expr_l47_c33.tagname='undefined';
$expr_l47_c33.line=47;
$expr_l47_c33.column=33;
function $assign_l47_c4(_event){
Var6 = $expr_l47_c33.apply(this, arguments);
};
$assign_l47_c4.tagname='assign';
$assign_l47_c4.line=47;
$assign_l47_c4.column=4;
function $foreach_l46_c5(_event){
var $i;
var $scionArray_11 = Var5;
if(Array.isArray($scionArray_11)){
    for($i = 0; $i < $scionArray_11.length;$i++){
       Var2 = $scionArray_11[$i];
       $assign_l47_c4.apply(this, arguments);
       if($i === ($scionArray_11.length - 1)) break;
    }
} else if (typeof $scionArray_11 === "object"){
    for($i in $scionArray_11){
        if($scionArray_11.hasOwnProperty($i)){
           Var2 = $scionArray_11[$i];
           $assign_l47_c4.apply(this, arguments);
        }
    }
} else {
   throw new Error("Variable Var5 does not contain a legal array value");
}
};
$foreach_l46_c5.tagname='foreach';
$foreach_l46_c5.line=46;
$foreach_l46_c5.column=5;
function $cond_l50_c21(_event){
return Var6==6;
};
$cond_l50_c21.tagname='undefined';
$cond_l50_c21.line=50;
$cond_l50_c21.column=21;
function $expr_l53_c56(_event){
return 'pass';
};
$expr_l53_c56.tagname='undefined';
$expr_l53_c56.line=53;
$expr_l53_c56.column=56;
function $log_l53_c30(_event){
this.log("Outcome",$expr_l53_c56.apply(this, arguments));
};
$log_l53_c30.tagname='log';
$log_l53_c30.line=53;
$log_l53_c30.column=30;
function $expr_l54_c56(_event){
return 'fail';
};
$expr_l54_c56.tagname='undefined';
$expr_l54_c56.line=54;
$expr_l54_c56.column=56;
function $log_l54_c30(_event){
this.log("Outcome",$expr_l54_c56.apply(this, arguments));
};
$log_l54_c30.tagname='log';
$log_l54_c30.line=54;
$log_l54_c30.column=30;
function $data_l3_c24(_event){
return 0;
};
$data_l3_c24.tagname='undefined';
$data_l3_c24.line=3;
$data_l3_c24.column=24;
function $data_l6_c24(_event){
return 7;
};
$data_l6_c24.tagname='undefined';
$data_l6_c24.line=6;
$data_l6_c24.column=24;
function $data_l7_c24(_event){
return [1,2,3];
};
$data_l7_c24.tagname='undefined';
$data_l7_c24.line=7;
$data_l7_c24.column=24;
function $datamodel_l2_c1(_event){
if(typeof Var1 === "undefined")  Var1 = $data_l3_c24.apply(this, arguments);
if(typeof Var4 === "undefined")  Var4 = $data_l6_c24.apply(this, arguments);
if(typeof Var5 === "undefined")  Var5 = $data_l7_c24.apply(this, arguments);
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
    $foreach_l14_c9,
    $raise_l17_c9
   ],
   "transitions": [
    {
     "event": "error.execution",
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
   "onEntry": [
    $script_l26_c9,
    $raise_l29_c9
   ],
   "transitions": [
    {
     "event": "error.execution",
     "target": "s2"
    },
    {
     "event": "bar",
     "target": "fail"
    }
   ]
  },
  {
   "id": "s2",
   "$type": "state",
   "transitions": [
    {
     "cond": $cond_l37_c20,
     "target": "s3"
    },
    {
     "target": "fail"
    }
   ]
  },
  {
   "id": "s3",
   "$type": "state",
   "onEntry": [
    $assign_l45_c3,
    $foreach_l46_c5
   ],
   "transitions": [
    {
     "cond": $cond_l50_c21,
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
    $log_l53_c30
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l54_c30
   ]
  }
 ],
 "onEntry": [
  $datamodel_l2_c1
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test457.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3Q0NTcudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWV3QyxXLENBQUssQyxDQUFFLEM7Ozs7OztBQUFwQyw0Qzs7Ozs7O0FBREY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxDOzs7Ozs7QUFHQSx1Qzs7Ozs7O0FBU0EsSyxDQUFNLEcsQ0FBSSxLQUFLLENBQUMsZ0NBQWdDLEM7Ozs7OztBQUdoRCx1Qzs7Ozs7O0FBUVcsV0FBSSxFQUFFLEM7Ozs7OztBQVFNLFE7Ozs7OztBQUE3Qiw0Qzs7Ozs7O0FBRThCLFcsQ0FBSyxDLENBQUUsSTs7Ozs7O0FBQXBDLDRDOzs7Ozs7QUFEQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQzs7Ozs7O0FBSWdCLFdBQUksRUFBRSxDOzs7Ozs7QUFHNkIsYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUFDMEIsYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUFuRE4sUTs7Ozs7O0FBR0EsUTs7Ozs7O0FBQ0EsUUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQzs7Ozs7O0FBTDdCO0FBQUE7QUFBQSw0RSJ9