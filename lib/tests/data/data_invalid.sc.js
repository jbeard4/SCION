//Generated on 2017-9-20 12:41:44 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
function $deserializeDatamodel($serializedDatamodel){

}
function $serializeDatamodel(){
   return {

   };
}
function $script_l5_c3(_event){
throw new Error("Line 1: Unexpected end of input")
};
$script_l5_c3.tagname='script';
$script_l5_c3.line=5;
$script_l5_c3.column=3;
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
      $log_l17_c7
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
 "onEntry": $script_l5_c3,
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/data/data_invalid.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L2RhdGEvZGF0YV9pbnZhbGlkLnNjeG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUtHLEssQ0FBTSxHLENBQUksS0FBSyxDQUFDLGlDQUFpQyxDOzs7Ozs7QUFPckMseUIsQ0FBbUIsQyxDQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDOzs7Ozs7QUFBcEQsc0Q7Ozs7OztBQUtZLDBCLENBQW9CLEMsQ0FBRSxVOzs7Ozs7QUFBaEMsc0Q7Ozs7OztBQU9RLHFCOzs7Ozs7QUFBVixzRDs7Ozs7O0FBTVUscUI7Ozs7OztBQUFWLHNEIn0=