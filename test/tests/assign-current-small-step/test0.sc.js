//Generated on 2017-9-20 12:42:14 by the SCION SCXML compiler
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
function $expr_l28_c39(_event){
return -1;
};
$expr_l28_c39.tagname='undefined';
$expr_l28_c39.line=28;
$expr_l28_c39.column=39;
function $assign_l28_c13(_event){
x = $expr_l28_c39.apply(this, arguments);
};
$assign_l28_c13.tagname='assign';
$assign_l28_c13.line=28;
$assign_l28_c13.column=13;
function $expr_l29_c39(_event){
return 99;
};
$expr_l29_c39.tagname='undefined';
$expr_l29_c39.line=29;
$expr_l29_c39.column=39;
function $assign_l29_c13(_event){
x = $expr_l29_c39.apply(this, arguments);
};
$assign_l29_c13.tagname='assign';
$assign_l29_c13.line=29;
$assign_l29_c13.column=13;
function $expr_l34_c39(_event){
return x + 1;
};
$expr_l34_c39.tagname='undefined';
$expr_l34_c39.line=34;
$expr_l34_c39.column=39;
function $assign_l34_c13(_event){
x = $expr_l34_c39.apply(this, arguments);
};
$assign_l34_c13.tagname='assign';
$assign_l34_c13.line=34;
$assign_l34_c13.column=13;
function $cond_l33_c48(_event){
return x === 99;
};
$cond_l33_c48.tagname='undefined';
$cond_l33_c48.line=33;
$cond_l33_c48.column=48;
function $script_l41_c13(_event){

                x *= 2;
};
$script_l41_c13.tagname='script';
$script_l41_c13.line=41;
$script_l41_c13.column=13;
function $cond_l46_c37(_event){
return x === 200;
};
$cond_l46_c37.tagname='undefined';
$cond_l46_c37.line=46;
$cond_l46_c37.column=37;
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "a",
   "$type": "state",
   "onEntry": [
    $assign_l28_c13,
    $assign_l29_c13
   ],
   "transitions": [
    {
     "event": "t",
     "target": "b",
     "cond": $cond_l33_c48,
     "onTransition": $assign_l34_c13
    }
   ]
  },
  {
   "id": "b",
   "$type": "state",
   "onEntry": [
    $script_l41_c13
   ],
   "transitions": [
    {
     "target": "c",
     "cond": $cond_l46_c37
    },
    {
     "target": "f"
    }
   ]
  },
  {
   "id": "c",
   "$type": "state"
  },
  {
   "id": "f",
   "$type": "state"
  }
 ],
 "onEntry": [],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/assign-current-small-step/test0.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L2Fzc2lnbi1jdXJyZW50LXNtYWxsLXN0ZXAvdGVzdDAuc2N4bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQTRCdUMsUUFBQyxDOzs7Ozs7QUFBM0IseUM7Ozs7OztBQUMwQixTOzs7Ozs7QUFBMUIseUM7Ozs7OztBQUswQixRLENBQUUsQyxDQUFFLEM7Ozs7OztBQUE5Qix5Qzs7Ozs7O0FBRG1DLFEsQ0FBRSxHLENBQUksRTs7Ozs7OztnQkFTdEMsQyxDQUFFLEUsQ0FBRyxDQUFDLEM7Ozs7OztBQUllLFEsQ0FBRSxHLENBQUksRyJ9