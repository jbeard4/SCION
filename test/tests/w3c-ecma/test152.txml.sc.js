//Generated on 2017-9-20 12:40:59 by the SCION SCXML compiler
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
function $expr_l16_c40(_event){
return Var1 + 1;
};
$expr_l16_c40.tagname='undefined';
$expr_l16_c40.line=16;
$expr_l16_c40.column=40;
function $assign_l16_c11(_event){
Var1 = $expr_l16_c40.apply(this, arguments);
};
$assign_l16_c11.tagname='assign';
$assign_l16_c11.line=16;
$assign_l16_c11.column=11;
function $foreach_l15_c9(_event){
var $scionArray_11 = Var4;
if(Array.isArray($scionArray_11)){
    for(Var3 = 0; Var3 < $scionArray_11.length;Var3++){
       Var2 = $scionArray_11[Var3];
       $assign_l16_c11.apply(this, arguments);
       if(Var3 === ($scionArray_11.length - 1)) break;
    }
} else if (typeof $scionArray_11 === "object"){
    for(Var3 in $scionArray_11){
        if($scionArray_11.hasOwnProperty(Var3)){
           Var2 = $scionArray_11[Var3];
           $assign_l16_c11.apply(this, arguments);
        }
    }
} else {
   throw new Error("Variable Var4 does not contain a legal array value");
}
};
$foreach_l15_c9.tagname='foreach';
$foreach_l15_c9.line=15;
$foreach_l15_c9.column=9;
function $raise_l18_c9(_event){
this.raise({ name:"foo", data : null});
};
$raise_l18_c9.tagname='raise';
$raise_l18_c9.line=18;
$raise_l18_c9.column=9;
function $script_l27_c9(_event){
throw new Error("Illegal identifier: 'continue'")
};
$script_l27_c9.tagname='script';
$script_l27_c9.line=27;
$script_l27_c9.column=9;
function $raise_l30_c9(_event){
this.raise({ name:"bar", data : null});
};
$raise_l30_c9.tagname='raise';
$raise_l30_c9.line=30;
$raise_l30_c9.column=9;
function $cond_l38_c20(_event){
return Var1==0;
};
$cond_l38_c20.tagname='undefined';
$cond_l38_c20.line=38;
$cond_l38_c20.column=20;
function $expr_l42_c56(_event){
return 'pass';
};
$expr_l42_c56.tagname='undefined';
$expr_l42_c56.line=42;
$expr_l42_c56.column=56;
function $log_l42_c30(_event){
this.log("Outcome",$expr_l42_c56.apply(this, arguments));
};
$log_l42_c30.tagname='log';
$log_l42_c30.line=42;
$log_l42_c30.column=30;
function $expr_l43_c56(_event){
return 'fail';
};
$expr_l43_c56.tagname='undefined';
$expr_l43_c56.line=43;
$expr_l43_c56.column=56;
function $log_l43_c30(_event){
this.log("Outcome",$expr_l43_c56.apply(this, arguments));
};
$log_l43_c30.tagname='log';
$log_l43_c30.line=43;
$log_l43_c30.column=30;
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
function $data_l7_c18(_event){
return [1,2,3];
};
$data_l7_c18.tagname='undefined';
$data_l7_c18.line=7;
$data_l7_c18.column=18;
function $datamodel_l2_c1(_event){
if(typeof Var1 === "undefined")  Var1 = $data_l3_c24.apply(this, arguments);
if(typeof Var4 === "undefined")  Var4 = $data_l6_c24.apply(this, arguments);
if(typeof Var5 === "undefined")  Var5 = $data_l7_c18.apply(this, arguments);
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
    $foreach_l15_c9,
    $raise_l18_c9
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
    $script_l27_c9,
    $raise_l30_c9
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
     "cond": $cond_l38_c20,
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
    $log_l42_c30
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l43_c30
   ]
  }
 ],
 "onEntry": [
  $datamodel_l2_c1
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test152.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QxNTIudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQndDLFcsQ0FBSyxDLENBQUUsQzs7Ozs7O0FBQXBDLDRDOzs7Ozs7QUFERjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEM7Ozs7OztBQUdBLHVDOzs7Ozs7QUFTQSxLLENBQU0sRyxDQUFJLEtBQUssQ0FBQyxnQ0FBZ0MsQzs7Ozs7O0FBR2hELHVDOzs7Ozs7QUFRVyxXQUFJLEVBQUUsQzs7Ozs7O0FBSThCLGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBQzBCLGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBeENOLFE7Ozs7OztBQUdBLFE7Ozs7OztBQUNOLFFBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEM7Ozs7OztBQUx2QjtBQUFBO0FBQUEsNEUifQ==