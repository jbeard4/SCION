//Generated on 2017-9-20 12:40:12 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
function $deserializeDatamodel($serializedDatamodel){

}
function $serializeDatamodel(){
   return {

   };
}
function $script_l3_c6(_event){
throw new Error("Line 1: Unexpected token return")
};
$script_l3_c6.tagname='script';
$script_l3_c6.line=3;
$script_l3_c6.column=6;
function $raise_l8_c5(_event){
this.raise({ name:"foo", data : null});
};
$raise_l8_c5.tagname='raise';
$raise_l8_c5.line=8;
$raise_l8_c5.column=5;
function $cond_l11_c45(_event){
return typeof Var1 === 'undefined';
};
$cond_l11_c45.tagname='undefined';
$cond_l11_c45.line=11;
$cond_l11_c45.column=45;
function $expr_l17_c33(_event){
return 1;
};
$expr_l17_c33.tagname='undefined';
$expr_l17_c33.line=17;
$expr_l17_c33.column=33;
function $assign_l17_c4(_event){
Var1 = $expr_l17_c33.apply(this, arguments);
};
$assign_l17_c4.tagname='assign';
$assign_l17_c4.line=17;
$assign_l17_c4.column=4;
function $cond_l19_c21(_event){
return Var1==1;
};
$cond_l19_c21.tagname='undefined';
$cond_l19_c21.line=19;
$cond_l19_c21.column=21;
function $expr_l24_c56(_event){
return 'pass';
};
$expr_l24_c56.tagname='undefined';
$expr_l24_c56.line=24;
$expr_l24_c56.column=56;
function $log_l24_c30(_event){
this.log("Outcome",$expr_l24_c56.apply(this, arguments));
};
$log_l24_c30.tagname='log';
$log_l24_c30.line=24;
$log_l24_c30.column=30;
function $expr_l25_c56(_event){
return 'fail';
};
$expr_l25_c56.tagname='undefined';
$expr_l25_c56.line=25;
$expr_l25_c56.column=56;
function $log_l25_c30(_event){
this.log("Outcome",$expr_l25_c56.apply(this, arguments));
};
$log_l25_c30.tagname='log';
$log_l25_c30.line=25;
$log_l25_c30.column=30;
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "{http://www.w3.org/2000/xmlns/}conf": "http://www.w3.org/2005/scxml-conformance",
 "initial": "s0",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "s0",
   "$type": "state",
   "onEntry": [
    $raise_l8_c5
   ],
   "transitions": [
    {
     "event": "error.execution",
     "cond": $cond_l11_c45,
     "target": "s1"
    },
    {
     "event": "*",
     "target": "fail"
    }
   ]
  },
  {
   "id": "s1",
   "$type": "state",
   "onEntry": [
    $assign_l17_c4
   ],
   "transitions": [
    {
     "cond": $cond_l19_c21,
     "target": "pass"
    },
    {
     "target": "fail"
    }
   ]
  },
  {
   "id": "pass",
   "$type": "final",
   "onEntry": [
    $log_l24_c30
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l25_c30
   ]
  }
 ],
 "onEntry": $script_l3_c6,
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test277.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QyNzcudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFHTSxLLENBQU0sRyxDQUFJLEtBQUssQ0FBQyxpQ0FBaUMsQzs7Ozs7O0FBS2xELHVDOzs7Ozs7QUFHd0MsYSxDQUFPLEksQ0FBSyxHLENBQUksVzs7Ozs7O0FBTTVCLFE7Ozs7OztBQUE3Qiw0Qzs7Ozs7O0FBRWlCLFdBQUksRUFBRSxDOzs7Ozs7QUFLNkIsYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUFDMEIsYTs7Ozs7O0FBQTFCLHlEIn0=