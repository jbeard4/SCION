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
function $expr_l12_c15(_event){
return 'unhandled input ' + JSON.stringify(_event);
};
$expr_l12_c15.tagname='undefined';
$expr_l12_c15.line=12;
$expr_l12_c15.column=15;
function $log_l12_c5(_event){
this.log("TEST",$expr_l12_c15.apply(this, arguments));
};
$log_l12_c5.tagname='log';
$log_l12_c5.line=12;
$log_l12_c5.column=5;
function $expr_l17_c17(_event){
return 'Starting session ' + _sessionid;
};
$expr_l17_c17.tagname='undefined';
$expr_l17_c17.line=17;
$expr_l17_c17.column=17;
function $log_l17_c7(_event){
this.log("TEST",$expr_l17_c17.apply(this, arguments));
};
$log_l17_c7.tagname='log';
$log_l17_c7.line=17;
$log_l17_c7.column=7;
function $script_l18_c7(_event){
throw new Error("Line 1: Unexpected end of input")
};
$script_l18_c7.tagname='script';
$script_l18_c7.line=18;
$script_l18_c7.column=7;
function $expr_l25_c15(_event){
return 'RESULT: pass';
};
$expr_l25_c15.tagname='undefined';
$expr_l25_c15.line=25;
$expr_l25_c15.column=15;
function $log_l25_c5(_event){
this.log("TEST",$expr_l25_c15.apply(this, arguments));
};
$log_l25_c5.tagname='log';
$log_l25_c5.line=25;
$log_l25_c5.column=5;
function $expr_l31_c15(_event){
return 'RESULT: fail';
};
$expr_l31_c15.tagname='undefined';
$expr_l31_c15.line=31;
$expr_l31_c15.column=15;
function $log_l31_c5(_event){
this.log("TEST",$expr_l31_c15.apply(this, arguments));
};
$log_l31_c5.tagname='log';
$log_l31_c5.line=31;
$log_l31_c5.column=5;
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
     "event": "error.execution",
     "target": "pass"
    },
    {
     "event": "*",
     "target": "fail",
     "onTransition": $log_l12_c5
    }
   ],
   "states": [
    {
     "id": "s1",
     "$type": "state",
     "onEntry": [
      $log_l17_c7,
      $script_l18_c7
     ]
    }
   ]
  },
  {
   "id": "pass",
   "$type": "final",
   "onEntry": [
    $log_l25_c5
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l31_c5
   ]
  }
 ],
 "onEntry": [],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/assign/assign_invalid.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L2Fzc2lnbi9hc3NpZ25faW52YWxpZC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBWWUseUIsQ0FBbUIsQyxDQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDOzs7Ozs7QUFBcEQsc0Q7Ozs7OztBQUtZLDBCLENBQW9CLEMsQ0FBRSxVOzs7Ozs7QUFBaEMsc0Q7Ozs7OztBQUNBLEssQ0FBTSxHLENBQUksS0FBSyxDQUFDLGlDQUFpQyxDOzs7Ozs7QUFPekMscUI7Ozs7OztBQUFWLHNEOzs7Ozs7QUFNVSxxQjs7Ozs7O0FBQVYsc0QifQ==