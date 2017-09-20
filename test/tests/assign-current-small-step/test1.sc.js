//Generated on 2017-9-20 12:42:12 by the SCION SCXML compiler
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
function $expr_l30_c39(_event){
return 0;
};
$expr_l30_c39.tagname='undefined';
$expr_l30_c39.line=30;
$expr_l30_c39.column=39;
function $assign_l30_c13(_event){
i = $expr_l30_c39.apply(this, arguments);
};
$assign_l30_c13.tagname='assign';
$assign_l30_c13.line=30;
$assign_l30_c13.column=13;
function $expr_l36_c39(_event){
return i + 1;
};
$expr_l36_c39.tagname='undefined';
$expr_l36_c39.line=36;
$expr_l36_c39.column=39;
function $assign_l36_c13(_event){
i = $expr_l36_c39.apply(this, arguments);
};
$assign_l36_c13.tagname='assign';
$assign_l36_c13.line=36;
$assign_l36_c13.column=13;
function $cond_l35_c37(_event){
return i < 100;
};
$cond_l35_c37.tagname='undefined';
$cond_l35_c37.line=35;
$cond_l35_c37.column=37;
function $cond_l38_c37(_event){
return i === 100;
};
$cond_l38_c37.tagname='undefined';
$cond_l38_c37.line=38;
$cond_l38_c37.column=37;
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "a",
   "$type": "state",
   "transitions": [
    {
     "target": "b",
     "event": "t",
     "onTransition": $assign_l30_c13
    }
   ]
  },
  {
   "id": "b",
   "$type": "state",
   "transitions": [
    {
     "target": "b",
     "cond": $cond_l35_c37,
     "onTransition": $assign_l36_c13
    },
    {
     "target": "c",
     "cond": $cond_l38_c37
    }
   ]
  },
  {
   "id": "c",
   "$type": "state"
  }
 ],
 "onEntry": [],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/assign-current-small-step/test1.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L2Fzc2lnbi1jdXJyZW50LXNtYWxsLXN0ZXAvdGVzdDEuc2N4bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQThCdUMsUTs7Ozs7O0FBQTFCLHlDOzs7Ozs7QUFNMEIsUSxDQUFFLEMsQ0FBRSxDOzs7Ozs7QUFBOUIseUM7Ozs7OztBQUR3QixRLENBQUUsQyxDQUFFLEc7Ozs7OztBQUdKLFEsQ0FBRSxHLENBQUksRyJ9