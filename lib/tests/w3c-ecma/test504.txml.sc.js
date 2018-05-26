//Generated on 2017-9-20 12:41:21 by the SCION SCXML compiler
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
function $raise_l11_c5(_event){
this.raise({ name:"foo", data : null});
};
$raise_l11_c5.tagname='raise';
$raise_l11_c5.line=11;
$raise_l11_c5.column=5;
function $raise_l12_c5(_event){
this.raise({ name:"bar", data : null});
};
$raise_l12_c5.tagname='raise';
$raise_l12_c5.line=12;
$raise_l12_c5.column=5;
function $expr_l19_c33(_event){
return Var5 + 1;
};
$expr_l19_c33.tagname='undefined';
$expr_l19_c33.line=19;
$expr_l19_c33.column=33;
function $assign_l19_c4(_event){
Var5 = $expr_l19_c33.apply(this, arguments);
};
$assign_l19_c4.tagname='assign';
$assign_l19_c4.line=19;
$assign_l19_c4.column=4;
function $expr_l24_c34(_event){
return Var1 + 1;
};
$expr_l24_c34.tagname='undefined';
$expr_l24_c34.line=24;
$expr_l24_c34.column=34;
function $assign_l24_c5(_event){
Var1 = $expr_l24_c34.apply(this, arguments);
};
$assign_l24_c5.tagname='assign';
$assign_l24_c5.line=24;
$assign_l24_c5.column=5;
function $expr_l27_c35(_event){
return Var4 + 1;
};
$expr_l27_c35.tagname='undefined';
$expr_l27_c35.line=27;
$expr_l27_c35.column=35;
function $assign_l27_c6(_event){
Var4 = $expr_l27_c35.apply(this, arguments);
};
$assign_l27_c6.tagname='assign';
$assign_l27_c6.line=27;
$assign_l27_c6.column=6;
function $cond_l31_c32(_event){
return Var4==1;
};
$cond_l31_c32.tagname='undefined';
$cond_l31_c32.line=31;
$cond_l31_c32.column=32;
function $expr_l36_c33(_event){
return Var2 + 1;
};
$expr_l36_c33.tagname='undefined';
$expr_l36_c33.line=36;
$expr_l36_c33.column=33;
function $assign_l36_c4(_event){
Var2 = $expr_l36_c33.apply(this, arguments);
};
$assign_l36_c4.tagname='assign';
$assign_l36_c4.line=36;
$assign_l36_c4.column=4;
function $expr_l41_c33(_event){
return Var3 + 1;
};
$expr_l41_c33.tagname='undefined';
$expr_l41_c33.line=41;
$expr_l41_c33.column=33;
function $assign_l41_c4(_event){
Var3 = $expr_l41_c33.apply(this, arguments);
};
$assign_l41_c4.tagname='assign';
$assign_l41_c4.line=41;
$assign_l41_c4.column=4;
function $cond_l49_c22(_event){
return Var1==2;
};
$cond_l49_c22.tagname='undefined';
$cond_l49_c22.line=49;
$cond_l49_c22.column=22;
function $cond_l55_c22(_event){
return Var2==2;
};
$cond_l55_c22.tagname='undefined';
$cond_l55_c22.line=55;
$cond_l55_c22.column=22;
function $cond_l61_c22(_event){
return Var3==2;
};
$cond_l61_c22.tagname='undefined';
$cond_l61_c22.line=61;
$cond_l61_c22.column=22;
function $cond_l67_c19(_event){
return Var5==1;
};
$cond_l67_c19.tagname='undefined';
$cond_l67_c19.line=67;
$cond_l67_c19.column=19;
function $expr_l71_c53(_event){
return 'pass';
};
$expr_l71_c53.tagname='undefined';
$expr_l71_c53.line=71;
$expr_l71_c53.column=53;
function $log_l71_c27(_event){
this.log("Outcome",$expr_l71_c53.apply(this, arguments));
};
$log_l71_c27.tagname='log';
$log_l71_c27.line=71;
$log_l71_c27.column=27;
function $expr_l72_c53(_event){
return 'fail';
};
$expr_l72_c53.tagname='undefined';
$expr_l72_c53.line=72;
$expr_l72_c53.column=53;
function $log_l72_c27(_event){
this.log("Outcome",$expr_l72_c53.apply(this, arguments));
};
$log_l72_c27.tagname='log';
$log_l72_c27.line=72;
$log_l72_c27.column=27;
function $data_l2_c24(_event){
return 0;
};
$data_l2_c24.tagname='undefined';
$data_l2_c24.line=2;
$data_l2_c24.column=24;
function $data_l3_c24(_event){
return 0;
};
$data_l3_c24.tagname='undefined';
$data_l3_c24.line=3;
$data_l3_c24.column=24;
function $data_l4_c24(_event){
return 0;
};
$data_l4_c24.tagname='undefined';
$data_l4_c24.line=4;
$data_l4_c24.column=24;
function $data_l5_c24(_event){
return 0;
};
$data_l5_c24.tagname='undefined';
$data_l5_c24.line=5;
$data_l5_c24.column=24;
function $data_l6_c24(_event){
return 0;
};
$data_l6_c24.tagname='undefined';
$data_l6_c24.line=6;
$data_l6_c24.column=24;
function $datamodel_l1_c1(_event){
if(typeof Var1 === "undefined")  Var1 = $data_l2_c24.apply(this, arguments);
if(typeof Var2 === "undefined")  Var2 = $data_l3_c24.apply(this, arguments);
if(typeof Var3 === "undefined")  Var3 = $data_l4_c24.apply(this, arguments);
if(typeof Var4 === "undefined")  Var4 = $data_l5_c24.apply(this, arguments);
if(typeof Var5 === "undefined")  Var5 = $data_l6_c24.apply(this, arguments);
};
$datamodel_l1_c1.tagname='datamodel';
$datamodel_l1_c1.line=1;
$datamodel_l1_c1.column=1;
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "{http://www.w3.org/2000/xmlns/}conf": "http://www.w3.org/2005/scxml-conformance",
 "initial": "s1",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "s1",
   "$type": "state",
   "onEntry": [
    $raise_l11_c5,
    $raise_l12_c5
   ],
   "transitions": [
    {
     "target": "p"
    }
   ]
  },
  {
   "id": "s2",
   "$type": "state",
   "onExit": [
    $assign_l19_c4
   ],
   "states": [
    {
     "id": "p",
     "$type": "parallel",
     "onExit": [
      $assign_l24_c5
     ],
     "transitions": [
      {
       "event": "foo",
       "target": "ps1",
       "onTransition": $assign_l27_c6
      },
      {
       "event": "bar",
       "cond": $cond_l31_c32,
       "target": "s3"
      },
      {
       "event": "bar",
       "target": "fail"
      }
     ],
     "states": [
      {
       "id": "ps1",
       "$type": "state",
       "onExit": [
        $assign_l36_c4
       ]
      },
      {
       "id": "ps2",
       "$type": "state",
       "onExit": [
        $assign_l41_c4
       ]
      }
     ]
    }
   ]
  },
  {
   "id": "s3",
   "$type": "state",
   "transitions": [
    {
     "cond": $cond_l49_c22,
     "target": "s4"
    },
    {
     "target": "fail"
    }
   ]
  },
  {
   "id": "s4",
   "$type": "state",
   "transitions": [
    {
     "cond": $cond_l55_c22,
     "target": "s5"
    },
    {
     "target": "fail"
    }
   ]
  },
  {
   "id": "s5",
   "$type": "state",
   "transitions": [
    {
     "cond": $cond_l61_c22,
     "target": "s6"
    },
    {
     "target": "fail"
    }
   ]
  },
  {
   "id": "s6",
   "$type": "state",
   "transitions": [
    {
     "cond": $cond_l67_c19,
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
    $log_l71_c27
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l72_c27
   ]
  }
 ],
 "onEntry": [
  $datamodel_l1_c1
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test504.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3Q1MDQudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFXSyx1Qzs7Ozs7O0FBQ0EsdUM7Ozs7OztBQU80QixXLENBQUssQyxDQUFFLEM7Ozs7OztBQUFwQyw0Qzs7Ozs7O0FBSzhCLFcsQ0FBSyxDLENBQUUsQzs7Ozs7O0FBQXBDLDRDOzs7Ozs7QUFHOEIsVyxDQUFLLEMsQ0FBRSxDOzs7Ozs7QUFBcEMsNEM7Ozs7OztBQUkwQixXQUFJLEVBQUUsQzs7Ozs7O0FBS0wsVyxDQUFLLEMsQ0FBRSxDOzs7Ozs7QUFBcEMsNEM7Ozs7OztBQUs2QixXLENBQUssQyxDQUFFLEM7Ozs7OztBQUFwQyw0Qzs7Ozs7O0FBUWtCLFdBQUksRUFBRSxDOzs7Ozs7QUFNTixXQUFJLEVBQUUsQzs7Ozs7O0FBTU4sV0FBSSxFQUFFLEM7Ozs7OztBQU1ULFdBQUksRUFBRSxDOzs7Ozs7QUFJNEIsYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUFDMEIsYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUF0RUgsUTs7Ozs7O0FBQ0EsUTs7Ozs7O0FBQ0EsUTs7Ozs7O0FBQ0EsUTs7Ozs7O0FBQ0EsUTs7Ozs7O0FBTHZCO0FBQUE7QUFBQTtBQUFBO0FBQUEsNEUifQ==