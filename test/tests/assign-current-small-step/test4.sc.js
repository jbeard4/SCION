//Generated on 2017-9-20 12:42:12 by the SCION SCXML compiler
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
function $expr_l27_c39(_event){
return 2;
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
function $expr_l35_c39(_event){
return x * 3;
};
$expr_l35_c39.tagname='undefined';
$expr_l35_c39.line=35;
$expr_l35_c39.column=39;
function $assign_l35_c13(_event){
x = $expr_l35_c39.apply(this, arguments);
};
$assign_l35_c13.tagname='assign';
$assign_l35_c13.line=35;
$assign_l35_c13.column=13;
function $expr_l36_c23(_event){
return 'b, x:' + x;
};
$expr_l36_c23.tagname='undefined';
$expr_l36_c23.line=36;
$expr_l36_c23.column=23;
function $log_l36_c13(_event){
this.log(null,$expr_l36_c23.apply(this, arguments));
};
$log_l36_c13.tagname='log';
$log_l36_c13.line=36;
$log_l36_c13.column=13;
function $cond_l53_c37(_event){
return x === 30;
};
$cond_l53_c37.tagname='undefined';
$cond_l53_c37.line=53;
$cond_l53_c37.column=37;
function $expr_l41_c43(_event){
return x * 5;
};
$expr_l41_c43.tagname='undefined';
$expr_l41_c43.line=41;
$expr_l41_c43.column=43;
function $assign_l41_c17(_event){
x = $expr_l41_c43.apply(this, arguments);
};
$assign_l41_c17.tagname='assign';
$assign_l41_c17.line=41;
$assign_l41_c17.column=17;
function $expr_l42_c27(_event){
return 'b1, x:' + x;
};
$expr_l42_c27.tagname='undefined';
$expr_l42_c27.line=42;
$expr_l42_c27.column=27;
function $log_l42_c17(_event){
this.log(null,$expr_l42_c27.apply(this, arguments));
};
$log_l42_c17.tagname='log';
$log_l42_c17.line=42;
$log_l42_c17.column=17;
function $expr_l48_c43(_event){
return x * 7;
};
$expr_l48_c43.tagname='undefined';
$expr_l48_c43.line=48;
$expr_l48_c43.column=43;
function $assign_l48_c17(_event){
x = $expr_l48_c43.apply(this, arguments);
};
$assign_l48_c17.tagname='assign';
$assign_l48_c17.line=48;
$assign_l48_c17.column=17;
function $expr_l49_c27(_event){
return 'b2, x:' + x;
};
$expr_l49_c27.tagname='undefined';
$expr_l49_c27.line=49;
$expr_l49_c27.column=27;
function $log_l49_c17(_event){
this.log(null,$expr_l49_c27.apply(this, arguments));
};
$log_l49_c17.tagname='log';
$log_l49_c17.line=49;
$log_l49_c17.column=17;
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "a",
   "$type": "state",
   "onEntry": [
    $assign_l27_c13
   ],
   "transitions": [
    {
     "event": "t",
     "target": "b1"
    }
   ]
  },
  {
   "id": "b",
   "$type": "state",
   "onEntry": [
    $assign_l35_c13,
    $log_l36_c13
   ],
   "states": [
    {
     "id": "b1",
     "$type": "state",
     "onEntry": [
      $assign_l41_c17,
      $log_l42_c17
     ]
    },
    {
     "id": "b2",
     "$type": "state",
     "onEntry": [
      $assign_l48_c17,
      $log_l49_c17
     ]
    }
   ],
   "transitions": [
    {
     "target": "c",
     "cond": $cond_l53_c37
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
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/assign-current-small-step/test4.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L2Fzc2lnbi1jdXJyZW50LXNtYWxsLXN0ZXAvdGVzdDQuc2N4bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQTJCdUMsUTs7Ozs7O0FBQTFCLHlDOzs7Ozs7QUFRMEIsUSxDQUFFLEMsQ0FBRSxDOzs7Ozs7QUFBOUIseUM7Ozs7OztBQUNVLGMsQ0FBUSxDLENBQUUsQzs7Ozs7O0FBQXBCLG9EOzs7Ozs7QUFpQndCLFEsQ0FBRSxHLENBQUksRTs7Ozs7O0FBWkEsUSxDQUFFLEMsQ0FBRSxDOzs7Ozs7QUFBOUIseUM7Ozs7OztBQUNVLGUsQ0FBUyxDLENBQUUsQzs7Ozs7O0FBQXJCLG9EOzs7Ozs7QUFNMEIsUSxDQUFFLEMsQ0FBRSxDOzs7Ozs7QUFBOUIseUM7Ozs7OztBQUNVLGUsQ0FBUyxDLENBQUUsQzs7Ozs7O0FBQXJCLG9EIn0=