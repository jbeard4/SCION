//Generated on 2017-9-20 12:40:09 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
var Var1;
function $deserializeDatamodel($serializedDatamodel){
  Var1 = $serializedDatamodel["Var1"];
}
function $serializeDatamodel(){
   return {
  "Var1" : Var1
   };
}
function $cond_l9_c12(_event){
return false;
};
$cond_l9_c12.tagname='undefined';
$cond_l9_c12.line=9;
$cond_l9_c12.column=12;
function $raise_l10_c5(_event){
this.raise({ name:"foo", data : null});
};
$raise_l10_c5.tagname='raise';
$raise_l10_c5.line=10;
$raise_l10_c5.column=5;
function $expr_l11_c34(_event){
return Var1 + 1;
};
$expr_l11_c34.tagname='undefined';
$expr_l11_c34.line=11;
$expr_l11_c34.column=34;
function $assign_l11_c5(_event){
Var1 = $expr_l11_c34.apply(this, arguments);
};
$assign_l11_c5.tagname='assign';
$assign_l11_c5.line=11;
$assign_l11_c5.column=5;
function $cond_l12_c16(_event){
return false;
};
$cond_l12_c16.tagname='undefined';
$cond_l12_c16.line=12;
$cond_l12_c16.column=16;
function $raise_l13_c5(_event){
this.raise({ name:"bar", data : null});
};
$raise_l13_c5.tagname='raise';
$raise_l13_c5.line=13;
$raise_l13_c5.column=5;
function $expr_l14_c34(_event){
return Var1 + 1;
};
$expr_l14_c34.tagname='undefined';
$expr_l14_c34.line=14;
$expr_l14_c34.column=34;
function $assign_l14_c5(_event){
Var1 = $expr_l14_c34.apply(this, arguments);
};
$assign_l14_c5.tagname='assign';
$assign_l14_c5.line=14;
$assign_l14_c5.column=5;
function $raise_l16_c5(_event){
this.raise({ name:"baz", data : null});
};
$raise_l16_c5.tagname='raise';
$raise_l16_c5.line=16;
$raise_l16_c5.column=5;
function $expr_l17_c33(_event){
return Var1 + 1;
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
function $if_l9_c3(_event){
if($cond_l9_c12.apply(this, arguments)){
    $raise_l10_c5.apply(this, arguments);
    $assign_l11_c5.apply(this, arguments);
}else if($cond_l12_c16.apply(this, arguments)){
    $raise_l13_c5.apply(this, arguments);
    $assign_l14_c5.apply(this, arguments);
}else{
    $raise_l16_c5.apply(this, arguments);
    $assign_l17_c4.apply(this, arguments);
}
};
$if_l9_c3.tagname='if';
$if_l9_c3.line=9;
$if_l9_c3.column=3;
function $raise_l19_c4(_event){
this.raise({ name:"bat", data : null});
};
$raise_l19_c4.tagname='raise';
$raise_l19_c4.line=19;
$raise_l19_c4.column=4;
function $cond_l21_c32(_event){
return Var1==1;
};
$cond_l21_c32.tagname='undefined';
$cond_l21_c32.line=21;
$cond_l21_c32.column=32;
function $expr_l27_c56(_event){
return 'pass';
};
$expr_l27_c56.tagname='undefined';
$expr_l27_c56.line=27;
$expr_l27_c56.column=56;
function $log_l27_c30(_event){
this.log("Outcome",$expr_l27_c56.apply(this, arguments));
};
$log_l27_c30.tagname='log';
$log_l27_c30.line=27;
$log_l27_c30.column=30;
function $expr_l28_c56(_event){
return 'fail';
};
$expr_l28_c56.tagname='undefined';
$expr_l28_c56.line=28;
$expr_l28_c56.column=56;
function $log_l28_c30(_event){
this.log("Outcome",$expr_l28_c56.apply(this, arguments));
};
$log_l28_c30.tagname='log';
$log_l28_c30.line=28;
$log_l28_c30.column=30;
function $data_l4_c24(_event){
return 0;
};
$data_l4_c24.tagname='undefined';
$data_l4_c24.line=4;
$data_l4_c24.column=24;
function $datamodel_l3_c1(_event){
if(typeof Var1 === "undefined")  Var1 = $data_l4_c24.apply(this, arguments);
};
$datamodel_l3_c1.tagname='datamodel';
$datamodel_l3_c1.line=3;
$datamodel_l3_c1.column=1;
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
    $if_l9_c3,
    $raise_l19_c4
   ],
   "transitions": [
    {
     "event": "baz",
     "cond": $cond_l21_c32,
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
    $log_l27_c30
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l28_c30
   ]
  }
 ],
 "onEntry": [
  $datamodel_l3_c1
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test148.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QxNDgudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBU1ksWTs7Ozs7O0FBQ1AsdUM7Ozs7OztBQUM2QixXLENBQUssQyxDQUFFLEM7Ozs7OztBQUFwQyw0Qzs7Ozs7O0FBQ1csWTs7Ozs7O0FBQ1gsdUM7Ozs7OztBQUM2QixXLENBQUssQyxDQUFFLEM7Ozs7OztBQUFwQyw0Qzs7Ozs7O0FBRUEsdUM7Ozs7OztBQUM0QixXLENBQUssQyxDQUFFLEM7Ozs7OztBQUFwQyw0Qzs7Ozs7O0FBUkQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQzs7Ozs7O0FBVUMsdUM7Ozs7OztBQUU0QixXQUFJLEVBQUUsQzs7Ozs7O0FBTWtCLGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBQzBCLGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBeEJOLFE7Ozs7OztBQUR2Qiw0RSJ9