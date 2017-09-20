//Generated on 2017-9-20 12:42:13 by the SCION SCXML compiler
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
function $expr_l49_c39(_event){
return i * 2;
};
$expr_l49_c39.tagname='undefined';
$expr_l49_c39.line=49;
$expr_l49_c39.column=39;
function $assign_l49_c13(_event){
i = $expr_l49_c39.apply(this, arguments);
};
$assign_l49_c13.tagname='assign';
$assign_l49_c13.line=49;
$assign_l49_c13.column=13;
function $cond_l48_c37(_event){
return i === 100;
};
$cond_l48_c37.tagname='undefined';
$cond_l48_c37.line=48;
$cond_l48_c37.column=37;
function $expr_l38_c43(_event){
return i + 1;
};
$expr_l38_c43.tagname='undefined';
$expr_l38_c43.line=38;
$expr_l38_c43.column=43;
function $assign_l38_c17(_event){
i = $expr_l38_c43.apply(this, arguments);
};
$assign_l38_c17.tagname='assign';
$assign_l38_c17.line=38;
$assign_l38_c17.column=17;
function $cond_l37_c41(_event){
return i < 100;
};
$cond_l37_c41.tagname='undefined';
$cond_l37_c41.line=37;
$cond_l37_c41.column=41;
function $expr_l44_c43(_event){
return i + 1;
};
$expr_l44_c43.tagname='undefined';
$expr_l44_c43.line=44;
$expr_l44_c43.column=43;
function $assign_l44_c17(_event){
i = $expr_l44_c43.apply(this, arguments);
};
$assign_l44_c17.tagname='assign';
$assign_l44_c17.line=44;
$assign_l44_c17.column=17;
function $cond_l43_c41(_event){
return i < 100;
};
$cond_l43_c41.tagname='undefined';
$cond_l43_c41.line=43;
$cond_l43_c41.column=41;
function $cond_l55_c37(_event){
return i === 200;
};
$cond_l55_c37.tagname='undefined';
$cond_l55_c37.line=55;
$cond_l55_c37.column=37;
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
   "id": "A",
   "$type": "state",
   "states": [
    {
     "id": "b",
     "$type": "state",
     "transitions": [
      {
       "target": "c",
       "cond": $cond_l37_c41,
       "onTransition": $assign_l38_c17
      }
     ]
    },
    {
     "id": "c",
     "$type": "state",
     "transitions": [
      {
       "target": "b",
       "cond": $cond_l43_c41,
       "onTransition": $assign_l44_c17
      }
     ]
    }
   ],
   "transitions": [
    {
     "target": "d",
     "cond": $cond_l48_c37,
     "onTransition": $assign_l49_c13
    }
   ]
  },
  {
   "id": "d",
   "$type": "state",
   "transitions": [
    {
     "target": "e",
     "cond": $cond_l55_c37
    },
    {
     "target": "f"
    }
   ]
  },
  {
   "id": "e",
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
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/assign-current-small-step/test2.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L2Fzc2lnbi1jdXJyZW50LXNtYWxsLXN0ZXAvdGVzdDIuc2N4bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQThCdUMsUTs7Ozs7O0FBQTFCLHlDOzs7Ozs7QUFtQjBCLFEsQ0FBRSxDLENBQUUsQzs7Ozs7O0FBQTlCLHlDOzs7Ozs7QUFEd0IsUSxDQUFFLEcsQ0FBSSxHOzs7Ozs7QUFWQSxRLENBQUUsQyxDQUFFLEM7Ozs7OztBQUE5Qix5Qzs7Ozs7O0FBRHdCLFEsQ0FBRSxDLENBQUUsRzs7Ozs7O0FBT0YsUSxDQUFFLEMsQ0FBRSxDOzs7Ozs7QUFBOUIseUM7Ozs7OztBQUR3QixRLENBQUUsQyxDQUFFLEc7Ozs7OztBQVlSLFEsQ0FBRSxHLENBQUksRyJ9