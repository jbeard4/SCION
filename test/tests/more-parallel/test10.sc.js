//Generated on 2017-9-20 12:41:56 by the SCION SCXML compiler
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
function $expr_l30_c39(_event){
return x + 1;
};
$expr_l30_c39.tagname='undefined';
$expr_l30_c39.line=30;
$expr_l30_c39.column=39;
function $assign_l30_c13(_event){
x = $expr_l30_c39.apply(this, arguments);
};
$assign_l30_c13.tagname='assign';
$assign_l30_c13.line=30;
$assign_l30_c13.column=13;
function $expr_l27_c39(_event){
return x +1;
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
function $cond_l49_c48(_event){
return x === 4;
};
$cond_l49_c48.tagname='undefined';
$cond_l49_c48.line=49;
$cond_l49_c48.column=48;
function $expr_l38_c43(_event){
return x + 1;
};
$expr_l38_c43.tagname='undefined';
$expr_l38_c43.line=38;
$expr_l38_c43.column=43;
function $assign_l38_c17(_event){
x = $expr_l38_c43.apply(this, arguments);
};
$assign_l38_c17.tagname='assign';
$assign_l38_c17.line=38;
$assign_l38_c17.column=17;
function $expr_l35_c43(_event){
return x + 1;
};
$expr_l35_c43.tagname='undefined';
$expr_l35_c43.line=35;
$expr_l35_c43.column=43;
function $assign_l35_c17(_event){
x = $expr_l35_c43.apply(this, arguments);
};
$assign_l35_c17.tagname='assign';
$assign_l35_c17.line=35;
$assign_l35_c17.column=17;
function $cond_l43_c52(_event){
return x === 2;
};
$cond_l43_c52.tagname='undefined';
$cond_l43_c52.line=43;
$cond_l43_c52.column=52;
function $cond_l54_c48(_event){
return x === 6;
};
$cond_l54_c48.tagname='undefined';
$cond_l54_c48.line=54;
$cond_l54_c48.column=48;
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
    $assign_l30_c13
   ],
   "states": [
    {
     "id": "a",
     "$type": "state",
     "onEntry": [
      $assign_l35_c17
     ],
     "onExit": [
      $assign_l38_c17
     ],
     "transitions": [
      {
       "target": "a",
       "event": "t1",
       "cond": $cond_l43_c52
      }
     ]
    },
    {
     "id": "b",
     "$type": "state"
    }
   ],
   "transitions": [
    {
     "target": "c",
     "event": "t2",
     "cond": $cond_l49_c48
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
     "cond": $cond_l54_c48
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
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/more-parallel/test10.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L21vcmUtcGFyYWxsZWwvdGVzdDEwLnNjeG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUE4QnVDLFEsQ0FBRSxDLENBQUUsQzs7Ozs7O0FBQTlCLHlDOzs7Ozs7QUFIMEIsUSxDQUFFLENBQUMsQzs7Ozs7O0FBQTdCLHlDOzs7Ozs7QUFzQm1DLFEsQ0FBRSxHLENBQUksQzs7Ozs7O0FBWFgsUSxDQUFFLEMsQ0FBRSxDOzs7Ozs7QUFBOUIseUM7Ozs7OztBQUgwQixRLENBQUUsQyxDQUFFLEM7Ozs7OztBQUE5Qix5Qzs7Ozs7O0FBUW1DLFEsQ0FBRSxHLENBQUksQzs7Ozs7O0FBV1YsUSxDQUFFLEcsQ0FBSSxDOzs7Ozs7QUFoQzNCLFE7Ozs7OztBQUR0Qix1RSJ9