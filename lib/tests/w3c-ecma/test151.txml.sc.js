//Generated on 2017-9-20 12:40:44 by the SCION SCXML compiler
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
function $foreach_l13_c9(_event){
var $scionArray_11 = Var3;
if(Array.isArray($scionArray_11)){
    for(Var2 = 0; Var2 < $scionArray_11.length;Var2++){
       Var1 = $scionArray_11[Var2];

       if(Var2 === ($scionArray_11.length - 1)) break;
    }
} else if (typeof $scionArray_11 === "object"){
    for(Var2 in $scionArray_11){
        if($scionArray_11.hasOwnProperty(Var2)){
           Var1 = $scionArray_11[Var2];

        }
    }
} else {
   throw new Error("Variable Var3 does not contain a legal array value");
}
};
$foreach_l13_c9.tagname='foreach';
$foreach_l13_c9.line=13;
$foreach_l13_c9.column=9;
function $raise_l14_c9(_event){
this.raise({ name:"foo", data : null});
};
$raise_l14_c9.tagname='raise';
$raise_l14_c9.line=14;
$raise_l14_c9.column=9;
function $foreach_l23_c9(_event){
var $scionArray_31 = Var3;
if(Array.isArray($scionArray_31)){
    for(Var5 = 0; Var5 < $scionArray_31.length;Var5++){
       Var4 = $scionArray_31[Var5];

       if(Var5 === ($scionArray_31.length - 1)) break;
    }
} else if (typeof $scionArray_31 === "object"){
    for(Var5 in $scionArray_31){
        if($scionArray_31.hasOwnProperty(Var5)){
           Var4 = $scionArray_31[Var5];

        }
    }
} else {
   throw new Error("Variable Var3 does not contain a legal array value");
}
};
$foreach_l23_c9.tagname='foreach';
$foreach_l23_c9.line=23;
$foreach_l23_c9.column=9;
function $raise_l24_c9(_event){
this.raise({ name:"bar", data : null});
};
$raise_l24_c9.tagname='raise';
$raise_l24_c9.line=24;
$raise_l24_c9.column=9;
function $cond_l32_c20(_event){
return Var5;
};
$cond_l32_c20.tagname='undefined';
$cond_l32_c20.line=32;
$cond_l32_c20.column=20;
function $expr_l35_c56(_event){
return 'pass';
};
$expr_l35_c56.tagname='undefined';
$expr_l35_c56.line=35;
$expr_l35_c56.column=56;
function $log_l35_c30(_event){
this.log("Outcome",$expr_l35_c56.apply(this, arguments));
};
$log_l35_c30.tagname='log';
$log_l35_c30.line=35;
$log_l35_c30.column=30;
function $expr_l36_c56(_event){
return 'fail';
};
$expr_l36_c56.tagname='undefined';
$expr_l36_c56.line=36;
$expr_l36_c56.column=56;
function $log_l36_c30(_event){
this.log("Outcome",$expr_l36_c56.apply(this, arguments));
};
$log_l36_c30.tagname='log';
$log_l36_c30.line=36;
$log_l36_c30.column=30;
function $data_l5_c18(_event){
return [1,2,3];
};
$data_l5_c18.tagname='undefined';
$data_l5_c18.line=5;
$data_l5_c18.column=18;
function $datamodel_l2_c1(_event){
if(typeof Var3 === "undefined")  Var3 = $data_l5_c18.apply(this, arguments);
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
    $foreach_l13_c9,
    $raise_l14_c9
   ],
   "transitions": [
    {
     "event": "error",
     "target": "fail"
    },
    {
     "event": "*",
     "target": "s1"
    }
   ]
  },
  {
   "id": "s1",
   "$type": "state",
   "onEntry": [
    $foreach_l23_c9,
    $raise_l24_c9
   ],
   "transitions": [
    {
     "event": "error",
     "target": "fail"
    },
    {
     "event": "*",
     "target": "s2"
    }
   ]
  },
  {
   "id": "s2",
   "$type": "state",
   "transitions": [
    {
     "cond": $cond_l32_c20,
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
    $log_l35_c30
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l36_c30
   ]
  }
 ],
 "onEntry": [
  $datamodel_l2_c1
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test151.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QxNTEudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFhUztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEM7Ozs7OztBQUNBLHVDOzs7Ozs7QUFTQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEM7Ozs7OztBQUNBLHVDOzs7Ozs7QUFRVyxXOzs7Ozs7QUFHb0MsYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUFDMEIsYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUEvQlosUUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQzs7Ozs7O0FBSHZCLDRFIn0=