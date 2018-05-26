//Generated on 2017-9-20 12:40:55 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
function $deserializeDatamodel($serializedDatamodel){

}
function $serializeDatamodel(){
   return {

   };
}
function $cond_l6_c21(_event){
return In('s1');
};
$cond_l6_c21.tagname='undefined';
$cond_l6_c21.line=6;
$cond_l6_c21.column=21;
function $cond_l7_c21(_event){
return In('ps1');
};
$cond_l7_c21.tagname='undefined';
$cond_l7_c21.line=7;
$cond_l7_c21.column=21;
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
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "{http://www.w3.org/2000/xmlns/}conf": "http://www.w3.org/2005/scxml-conformance",
 "initial": "p",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "p",
   "$type": "parallel",
   "states": [
    {
     "id": "ps0",
     "$type": "state",
     "transitions": [
      {
       "cond": $cond_l6_c21,
       "target": "fail"
      },
      {
       "cond": $cond_l7_c21,
       "target": "pass"
      },
      {
       "target": "fail"
      }
     ]
    },
    {
     "id": "ps1",
     "$type": "state"
    }
   ]
  },
  {
   "id": "s1",
   "$type": "state"
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
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test436.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3Q0MzYudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFNcUIsU0FBRSxDQUFDLElBQUksQzs7Ozs7O0FBQ1AsU0FBRSxDQUFDLEtBQUssQzs7Ozs7O0FBU3dCLGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBQzBCLGE7Ozs7OztBQUExQix5RCJ9