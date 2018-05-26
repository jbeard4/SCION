//Generated on 2017-9-20 12:41:12 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
var var1;
function $deserializeDatamodel($serializedDatamodel){
  var1 = $serializedDatamodel["var1"];
}
function $serializeDatamodel(){
   return {
  "var1" : var1
   };
}
function $raise_l9_c4(_event){
this.raise({ name:"event1", data : null});
};
$raise_l9_c4.tagname='raise';
$raise_l9_c4.line=9;
$raise_l9_c4.column=4;
function $cond_l12_c36(_event){
return var1(2) == 3;
};
$cond_l12_c36.tagname='undefined';
$cond_l12_c36.line=12;
$cond_l12_c36.column=36;
function $expr_l16_c53(_event){
return 'pass';
};
$expr_l16_c53.tagname='undefined';
$expr_l16_c53.line=16;
$expr_l16_c53.column=53;
function $log_l16_c27(_event){
this.log("Outcome",$expr_l16_c53.apply(this, arguments));
};
$log_l16_c27.tagname='log';
$log_l16_c27.line=16;
$log_l16_c27.column=27;
function $expr_l17_c53(_event){
return 'fail';
};
$expr_l17_c53.tagname='undefined';
$expr_l17_c53.line=17;
$expr_l17_c53.column=53;
function $log_l17_c27(_event){
this.log("Outcome",$expr_l17_c53.apply(this, arguments));
};
$log_l17_c27.tagname='log';
$log_l17_c27.line=17;
$log_l17_c27.column=27;
function $data_l4_c25(_event){
return function(invar) {return invar + 1;};
};
$data_l4_c25.tagname='undefined';
$data_l4_c25.line=4;
$data_l4_c25.column=25;
function $datamodel_l3_c2(_event){
if(typeof var1 === "undefined")  var1 = $data_l4_c25.apply(this, arguments);
};
$datamodel_l3_c2.tagname='datamodel';
$datamodel_l3_c2.line=3;
$datamodel_l3_c2.column=2;
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "{http://www.w3.org/2000/xmlns/}conf": "http://www.w3.org/2005/scxml-conformance",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "s0",
   "$type": "state",
   "onEntry": [
    $raise_l9_c4
   ],
   "transitions": [
    {
     "event": "event1",
     "cond": $cond_l12_c36,
     "target": "pass"
    },
    {
     "event": "*",
     "target": "fail"
    }
   ]
  },
  {
   "id": "pass",
   "$type": "final",
   "onEntry": [
    $log_l16_c27
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l17_c27
   ]
  }
 ],
 "onEntry": [
  $datamodel_l3_c2
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test453.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3Q0NTMudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBU0ksMEM7Ozs7OztBQUdnQyxXQUFJLENBQUMsQ0FBQyxDLENBQUUsRSxDQUFHLEM7Ozs7OztBQUlNLGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBQzBCLGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBYkYsZUFBUSxDQUFDLEtBQUssQyxDQUFFLENBQUMsTSxDQUFPLEssQ0FBTSxDLENBQUUsQ0FBQyxDQUFDLEM7Ozs7OztBQUR6RCw0RSJ9