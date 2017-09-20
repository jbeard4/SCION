//Generated on 2017-9-20 12:39:50 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
var o1;
function $deserializeDatamodel($serializedDatamodel){
  o1 = $serializedDatamodel["o1"];
}
function $serializeDatamodel(){
   return {
  "o1" : o1
   };
}
function $expr_l10_c15(_event){
return 'unhandled input ' + JSON.stringify(_event);
};
$expr_l10_c15.tagname='undefined';
$expr_l10_c15.line=10;
$expr_l10_c15.column=15;
function $log_l10_c5(_event){
this.log("TEST",$expr_l10_c15.apply(this, arguments));
};
$log_l10_c5.tagname='log';
$log_l10_c5.line=10;
$log_l10_c5.column=5;
function $expr_l16_c17(_event){
return 'Starting session ' + _sessionid;
};
$expr_l16_c17.tagname='undefined';
$expr_l16_c17.line=16;
$expr_l16_c17.column=17;
function $log_l16_c7(_event){
this.log("TEST",$expr_l16_c17.apply(this, arguments));
};
$log_l16_c7.tagname='log';
$log_l16_c7.line=16;
$log_l16_c7.column=7;
function $expr_l17_c34(_event){
return {p1: 'v1', p2: 'v2'};
};
$expr_l17_c34.tagname='undefined';
$expr_l17_c34.line=17;
$expr_l17_c34.column=34;
function $assign_l17_c7(_event){
o1 = $expr_l17_c34.apply(this, arguments);
};
$assign_l17_c7.tagname='assign';
$assign_l17_c7.line=17;
$assign_l17_c7.column=7;
function $expr_l24_c15(_event){
return 'RESULT: pass';
};
$expr_l24_c15.tagname='undefined';
$expr_l24_c15.line=24;
$expr_l24_c15.column=15;
function $log_l24_c5(_event){
this.log("TEST",$expr_l24_c15.apply(this, arguments));
};
$log_l24_c5.tagname='log';
$log_l24_c5.line=24;
$log_l24_c5.column=5;
function $expr_l30_c15(_event){
return 'RESULT: fail';
};
$expr_l30_c15.tagname='undefined';
$expr_l30_c15.line=30;
$expr_l30_c15.column=15;
function $log_l30_c5(_event){
this.log("TEST",$expr_l30_c15.apply(this, arguments));
};
$log_l30_c5.tagname='log';
$log_l30_c5.line=30;
$log_l30_c5.column=5;
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "initial": "s1",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "uber",
   "$type": "state",
   "transitions": [
    {
     "event": "*",
     "target": "fail",
     "onTransition": $log_l10_c5
    }
   ],
   "states": [
    {
     "id": "s1",
     "$type": "state",
     "transitions": [
      {
       "event": "pass",
       "target": "pass"
      }
     ],
     "onEntry": [
      $log_l16_c7,
      $assign_l17_c7
     ]
    }
   ]
  },
  {
   "id": "pass",
   "$type": "final",
   "onEntry": [
    $log_l24_c5
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l30_c5
   ]
  }
 ],
 "onEntry": [],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/assign/assign_obj_literal.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L2Fzc2lnbi9hc3NpZ25fb2JqX2xpdGVyYWwuc2N4bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQVVlLHlCLENBQW1CLEMsQ0FBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQzs7Ozs7O0FBQXBELHNEOzs7Ozs7QUFNWSwwQixDQUFvQixDLENBQUUsVTs7Ozs7O0FBQWhDLHNEOzs7Ozs7QUFDMkIsUUFBQyxFQUFFLEMsQ0FBRSxJQUFJLEMsQ0FBRSxFQUFFLEMsQ0FBRSxJQUFJLEM7Ozs7OztBQUE5QywwQzs7Ozs7O0FBT1EscUI7Ozs7OztBQUFWLHNEOzs7Ozs7QUFNVSxxQjs7Ozs7O0FBQVYsc0QifQ==