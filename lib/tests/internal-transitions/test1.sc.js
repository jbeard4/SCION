//Generated on 2017-9-20 12:41:49 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
var x;
function $deserializeDatamodel($serializedDatamodel){
  x = $serializedDatamodel["x"];
}
function $serializeDatamodel(){
   return {
  "x" : x
   };
}
function $expr_l31_c39(_event){
return x + 1;
};
$expr_l31_c39.tagname='undefined';
$expr_l31_c39.line=31;
$expr_l31_c39.column=39;
function $assign_l31_c13(_event){
x = $expr_l31_c39.apply(this, arguments);
};
$assign_l31_c13.tagname='assign';
$assign_l31_c13.line=31;
$assign_l31_c13.column=13;
function $expr_l27_c39(_event){
return x + 1;
};
$expr_l27_c39.tagname='undefined';
$expr_l27_c39.line=27;
$expr_l27_c39.column=39;
function $assign_l27_c13(_event){
x = $expr_l27_c39.apply(this, arguments);
};
$assign_l27_c13.tagname='assign';
$assign_l27_c13.line=27;
$assign_l27_c13.column=13;
function $expr_l40_c43(_event){
return x + 1;
};
$expr_l40_c43.tagname='undefined';
$expr_l40_c43.line=40;
$expr_l40_c43.column=43;
function $assign_l40_c17(_event){
x = $expr_l40_c43.apply(this, arguments);
};
$assign_l40_c17.tagname='assign';
$assign_l40_c17.line=40;
$assign_l40_c17.column=17;
function $expr_l36_c43(_event){
return x + 1;
};
$expr_l36_c43.tagname='undefined';
$expr_l36_c43.line=36;
$expr_l36_c43.column=43;
function $assign_l36_c17(_event){
x = $expr_l36_c43.apply(this, arguments);
};
$assign_l36_c17.tagname='assign';
$assign_l36_c17.line=36;
$assign_l36_c17.column=17;
function $cond_l67_c69(_event){
return x === 3;
};
$cond_l67_c69.tagname='undefined';
$cond_l67_c69.line=67;
$cond_l67_c69.column=69;
function $expr_l49_c47(_event){
return x + 1;
};
$expr_l49_c47.tagname='undefined';
$expr_l49_c47.line=49;
$expr_l49_c47.column=47;
function $assign_l49_c21(_event){
x = $expr_l49_c47.apply(this, arguments);
};
$assign_l49_c21.tagname='assign';
$assign_l49_c21.line=49;
$assign_l49_c21.column=21;
function $expr_l45_c47(_event){
return x + 1;
};
$expr_l45_c47.tagname='undefined';
$expr_l45_c47.line=45;
$expr_l45_c47.column=47;
function $assign_l45_c21(_event){
x = $expr_l45_c47.apply(this, arguments);
};
$assign_l45_c21.tagname='assign';
$assign_l45_c21.line=45;
$assign_l45_c21.column=21;
function $expr_l59_c47(_event){
return x + 1;
};
$expr_l59_c47.tagname='undefined';
$expr_l59_c47.line=59;
$expr_l59_c47.column=47;
function $assign_l59_c21(_event){
x = $expr_l59_c47.apply(this, arguments);
};
$assign_l59_c21.tagname='assign';
$assign_l59_c21.line=59;
$assign_l59_c21.column=21;
function $expr_l55_c47(_event){
return x + 1;
};
$expr_l55_c47.tagname='undefined';
$expr_l55_c47.line=55;
$expr_l55_c47.column=47;
function $assign_l55_c21(_event){
x = $expr_l55_c47.apply(this, arguments);
};
$assign_l55_c21.tagname='assign';
$assign_l55_c21.line=55;
$assign_l55_c21.column=21;
function $cond_l63_c56(_event){
return x === 5;
};
$cond_l63_c56.tagname='undefined';
$cond_l63_c56.line=63;
$cond_l63_c56.column=56;
function $cond_l82_c48(_event){
return x === 8;
};
$cond_l82_c48.tagname='undefined';
$cond_l82_c48.line=82;
$cond_l82_c48.column=48;
function $data_l22_c27(_event){
return 0;
};
$data_l22_c27.tagname='undefined';
$data_l22_c27.line=22;
$data_l22_c27.column=27;
function $datamodel_l21_c5(_event){
if(typeof x === "undefined")  x = $data_l22_c27.apply(this, arguments);
};
$datamodel_l21_c5.tagname='datamodel';
$datamodel_l21_c5.line=21;
$datamodel_l21_c5.column=5;
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "p",
   "$type": "parallel",
   "onEntry": [
    $assign_l27_c13
   ],
   "onExit": [
    $assign_l31_c13
   ],
   "states": [
    {
     "id": "a",
     "$type": "state",
     "onEntry": [
      $assign_l36_c17
     ],
     "onExit": [
      $assign_l40_c17
     ],
     "states": [
      {
       "id": "a1",
       "$type": "state",
       "onEntry": [
        $assign_l45_c21
       ],
       "onExit": [
        $assign_l49_c21
       ]
      },
      {
       "id": "a2",
       "$type": "state",
       "onEntry": [
        $assign_l55_c21
       ],
       "onExit": [
        $assign_l59_c21
       ],
       "transitions": [
        {
         "target": "c",
         "event": "t2",
         "cond": $cond_l63_c56
        }
       ]
      }
     ],
     "transitions": [
      {
       "target": "a2",
       "event": "t1",
       "type": "internal",
       "cond": $cond_l67_c69
      }
     ]
    },
    {
     "id": "b",
     "$type": "state",
     "states": [
      {
       "id": "b1",
       "$type": "state"
      },
      {
       "id": "b2",
       "$type": "state"
      }
     ]
    }
   ]
  },
  {
   "id": "c",
   "$type": "state",
   "transitions": [
    {
     "target": "d",
     "event": "t3",
     "cond": $cond_l82_c48
    }
   ]
  },
  {
   "id": "d",
   "$type": "state"
  }
 ],
 "onEntry": [
  $datamodel_l21_c5
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/internal-transitions/test1.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L2ludGVybmFsLXRyYW5zaXRpb25zL3Rlc3QxLnNjeG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUErQnVDLFEsQ0FBRSxDLENBQUUsQzs7Ozs7O0FBQTlCLHlDOzs7Ozs7QUFKMEIsUSxDQUFFLEMsQ0FBRSxDOzs7Ozs7QUFBOUIseUM7Ozs7OztBQWE4QixRLENBQUUsQyxDQUFFLEM7Ozs7OztBQUE5Qix5Qzs7Ozs7O0FBSjBCLFEsQ0FBRSxDLENBQUUsQzs7Ozs7O0FBQTlCLHlDOzs7Ozs7QUErQm9ELFEsQ0FBRSxHLENBQUksQzs7Ozs7O0FBbEI1QixRLENBQUUsQyxDQUFFLEM7Ozs7OztBQUE5Qix5Qzs7Ozs7O0FBSjBCLFEsQ0FBRSxDLENBQUUsQzs7Ozs7O0FBQTlCLHlDOzs7Ozs7QUFjMEIsUSxDQUFFLEMsQ0FBRSxDOzs7Ozs7QUFBOUIseUM7Ozs7OztBQUowQixRLENBQUUsQyxDQUFFLEM7Ozs7OztBQUE5Qix5Qzs7Ozs7O0FBUW1DLFEsQ0FBRSxHLENBQUksQzs7Ozs7O0FBbUJkLFEsQ0FBRSxHLENBQUksQzs7Ozs7O0FBNUQzQixROzs7Ozs7QUFEdEIsdUUifQ==