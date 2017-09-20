//Generated on 2017-9-20 12:41:46 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
var i;
function $deserializeDatamodel($serializedDatamodel){
  i = $serializedDatamodel["i"];
}
function $serializeDatamodel(){
   return {
  "i" : i
   };
}
function $expr_l27_c39(_event){
return i * 2;
};
$expr_l27_c39.tagname='undefined';
$expr_l27_c39.line=27;
$expr_l27_c39.column=39;
function $assign_l27_c13(_event){
i = $expr_l27_c39.apply(this, arguments);
};
$assign_l27_c13.tagname='assign';
$assign_l27_c13.line=27;
$assign_l27_c13.column=13;
function $cond_l36_c40(_event){
return i === 8;
};
$cond_l36_c40.tagname='undefined';
$cond_l36_c40.line=36;
$cond_l36_c40.column=40;
function $expr_l32_c43(_event){
return Math.pow(i,3);
};
$expr_l32_c43.tagname='undefined';
$expr_l32_c43.line=32;
$expr_l32_c43.column=43;
function $assign_l32_c17(_event){
i = $expr_l32_c43.apply(this, arguments);
};
$assign_l32_c17.tagname='assign';
$assign_l32_c17.line=32;
$assign_l32_c17.column=17;
function $data_l22_c27(_event){
return 1;
};
$data_l22_c27.tagname='undefined';
$data_l22_c27.line=22;
$data_l22_c27.column=27;
function $datamodel_l21_c5(_event){
if(typeof i === "undefined")  i = $data_l22_c27.apply(this, arguments);
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
   "id": "A",
   "$type": "state",
   "transitions": [
    {
     "event": "foo",
     "onTransition": $assign_l27_c13
    },
    {
     "target": "done",
     "cond": $cond_l36_c40
    }
   ],
   "states": [
    {
     "id": "a",
     "$type": "state",
     "transitions": [
      {
       "event": "bar",
       "onTransition": $assign_l32_c17
      }
     ]
    }
   ]
  },
  {
   "id": "done",
   "$type": "state"
  }
 ],
 "onEntry": [
  $datamodel_l21_c5
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/targetless-transition/test1.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3RhcmdldGxlc3MtdHJhbnNpdGlvbi90ZXN0MS5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBMkJ1QyxRLENBQUUsQyxDQUFFLEM7Ozs7OztBQUE5Qix5Qzs7Ozs7O0FBUzJCLFEsQ0FBRSxHLENBQUksQzs7Ozs7O0FBSkgsV0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDOzs7Ozs7QUFBdEMseUM7Ozs7OztBQVZVLFE7Ozs7OztBQUR0Qix1RSJ9