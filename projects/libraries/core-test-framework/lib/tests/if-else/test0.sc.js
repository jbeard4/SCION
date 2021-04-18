//Generated on 2017-9-20 12:42:11 by the SCION SCXML compiler
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
function $expr_l45_c33(_event){
return x;
};
$expr_l45_c33.tagname='undefined';
$expr_l45_c33.line=45;
$expr_l45_c33.column=33;
function $log_l45_c13(_event){
this.log("x",$expr_l45_c33.apply(this, arguments));
};
$log_l45_c13.tagname='log';
$log_l45_c13.line=45;
$log_l45_c13.column=13;
function $cond_l46_c22(_event){
return x !== 10;
};
$cond_l46_c22.tagname='undefined';
$cond_l46_c22.line=46;
$cond_l46_c22.column=22;
function $expr_l47_c43(_event){
return x * 3;
};
$expr_l47_c43.tagname='undefined';
$expr_l47_c43.line=47;
$expr_l47_c43.column=43;
function $assign_l47_c17(_event){
x = $expr_l47_c43.apply(this, arguments);
};
$assign_l47_c17.tagname='assign';
$assign_l47_c17.line=47;
$assign_l47_c17.column=17;
function $expr_l49_c43(_event){
return x * 2;
};
$expr_l49_c43.tagname='undefined';
$expr_l49_c43.line=49;
$expr_l49_c43.column=43;
function $assign_l49_c17(_event){
x = $expr_l49_c43.apply(this, arguments);
};
$assign_l49_c17.tagname='assign';
$assign_l49_c17.line=49;
$assign_l49_c17.column=17;
function $if_l46_c13(_event){
if($cond_l46_c22.apply(this, arguments)){
    $assign_l47_c17.apply(this, arguments);
}else{
    $assign_l49_c17.apply(this, arguments);
}
};
$if_l46_c13.tagname='if';
$if_l46_c13.line=46;
$if_l46_c13.column=13;
function $expr_l51_c33(_event){
return x;
};
$expr_l51_c33.tagname='undefined';
$expr_l51_c33.line=51;
$expr_l51_c33.column=33;
function $log_l51_c13(_event){
this.log("x",$expr_l51_c33.apply(this, arguments));
};
$log_l51_c13.tagname='log';
$log_l51_c13.line=51;
$log_l51_c13.column=13;
function $expr_l28_c33(_event){
return x;
};
$expr_l28_c33.tagname='undefined';
$expr_l28_c33.line=28;
$expr_l28_c33.column=33;
function $log_l28_c13(_event){
this.log("x",$expr_l28_c33.apply(this, arguments));
};
$log_l28_c13.tagname='log';
$log_l28_c13.line=28;
$log_l28_c13.column=13;
function $cond_l29_c22(_event){
return x === 0;
};
$cond_l29_c22.tagname='undefined';
$cond_l29_c22.line=29;
$cond_l29_c22.column=22;
function $expr_l30_c43(_event){
return 10;
};
$expr_l30_c43.tagname='undefined';
$expr_l30_c43.line=30;
$expr_l30_c43.column=43;
function $assign_l30_c17(_event){
x = $expr_l30_c43.apply(this, arguments);
};
$assign_l30_c17.tagname='assign';
$assign_l30_c17.line=30;
$assign_l30_c17.column=17;
function $cond_l31_c30(_event){
return x === 10;
};
$cond_l31_c30.tagname='undefined';
$cond_l31_c30.line=31;
$cond_l31_c30.column=30;
function $expr_l32_c43(_event){
return 20;
};
$expr_l32_c43.tagname='undefined';
$expr_l32_c43.line=32;
$expr_l32_c43.column=43;
function $assign_l32_c17(_event){
x = $expr_l32_c43.apply(this, arguments);
};
$assign_l32_c17.tagname='assign';
$assign_l32_c17.line=32;
$assign_l32_c17.column=17;
function $expr_l34_c43(_event){
return 30;
};
$expr_l34_c43.tagname='undefined';
$expr_l34_c43.line=34;
$expr_l34_c43.column=43;
function $assign_l34_c17(_event){
x = $expr_l34_c43.apply(this, arguments);
};
$assign_l34_c17.tagname='assign';
$assign_l34_c17.line=34;
$assign_l34_c17.column=17;
function $if_l29_c13(_event){
if($cond_l29_c22.apply(this, arguments)){
    $assign_l30_c17.apply(this, arguments);
}else if($cond_l31_c30.apply(this, arguments)){
    $assign_l32_c17.apply(this, arguments);
}else{
    $assign_l34_c17.apply(this, arguments);
}
};
$if_l29_c13.tagname='if';
$if_l29_c13.line=29;
$if_l29_c13.column=13;
function $expr_l36_c33(_event){
return x;
};
$expr_l36_c33.tagname='undefined';
$expr_l36_c33.line=36;
$expr_l36_c33.column=33;
function $log_l36_c13(_event){
this.log("x",$expr_l36_c33.apply(this, arguments));
};
$log_l36_c13.tagname='log';
$log_l36_c13.line=36;
$log_l36_c13.column=13;
function $expr_l40_c39(_event){
return x + 1;
};
$expr_l40_c39.tagname='undefined';
$expr_l40_c39.line=40;
$expr_l40_c39.column=39;
function $assign_l40_c13(_event){
x = $expr_l40_c39.apply(this, arguments);
};
$assign_l40_c13.tagname='assign';
$assign_l40_c13.line=40;
$assign_l40_c13.column=13;
function $cond_l39_c48(_event){
return x === 10;
};
$cond_l39_c48.tagname='undefined';
$cond_l39_c48.line=39;
$cond_l39_c48.column=48;
function $expr_l58_c33(_event){
return x;
};
$expr_l58_c33.tagname='undefined';
$expr_l58_c33.line=58;
$expr_l58_c33.column=33;
function $log_l58_c13(_event){
this.log("x",$expr_l58_c33.apply(this, arguments));
};
$log_l58_c13.tagname='log';
$log_l58_c13.line=58;
$log_l58_c13.column=13;
function $cond_l59_c22(_event){
return x === 0;
};
$cond_l59_c22.tagname='undefined';
$cond_l59_c22.line=59;
$cond_l59_c22.column=22;
function $expr_l60_c43(_event){
return 100;
};
$expr_l60_c43.tagname='undefined';
$expr_l60_c43.line=60;
$expr_l60_c43.column=43;
function $assign_l60_c17(_event){
x = $expr_l60_c43.apply(this, arguments);
};
$assign_l60_c17.tagname='assign';
$assign_l60_c17.line=60;
$assign_l60_c17.column=17;
function $cond_l61_c30(_event){
return x === 21;
};
$cond_l61_c30.tagname='undefined';
$cond_l61_c30.line=61;
$cond_l61_c30.column=30;
function $expr_l62_c43(_event){
return x + 2;
};
$expr_l62_c43.tagname='undefined';
$expr_l62_c43.line=62;
$expr_l62_c43.column=43;
function $assign_l62_c17(_event){
x = $expr_l62_c43.apply(this, arguments);
};
$assign_l62_c17.tagname='assign';
$assign_l62_c17.line=62;
$assign_l62_c17.column=17;
function $expr_l63_c43(_event){
return x + 3;
};
$expr_l63_c43.tagname='undefined';
$expr_l63_c43.line=63;
$expr_l63_c43.column=43;
function $assign_l63_c17(_event){
x = $expr_l63_c43.apply(this, arguments);
};
$assign_l63_c17.tagname='assign';
$assign_l63_c17.line=63;
$assign_l63_c17.column=17;
function $expr_l65_c43(_event){
return 200;
};
$expr_l65_c43.tagname='undefined';
$expr_l65_c43.line=65;
$expr_l65_c43.column=43;
function $assign_l65_c17(_event){
x = $expr_l65_c43.apply(this, arguments);
};
$assign_l65_c17.tagname='assign';
$assign_l65_c17.line=65;
$assign_l65_c17.column=17;
function $if_l59_c13(_event){
if($cond_l59_c22.apply(this, arguments)){
    $assign_l60_c17.apply(this, arguments);
}else if($cond_l61_c30.apply(this, arguments)){
    $assign_l62_c17.apply(this, arguments);
    $assign_l63_c17.apply(this, arguments);
}else{
    $assign_l65_c17.apply(this, arguments);
}
};
$if_l59_c13.tagname='if';
$if_l59_c13.line=59;
$if_l59_c13.column=13;
function $cond_l68_c22(_event){
return x === 26;
};
$cond_l68_c22.tagname='undefined';
$cond_l68_c22.line=68;
$cond_l68_c22.column=22;
function $expr_l69_c43(_event){
return x + 1;
};
$expr_l69_c43.tagname='undefined';
$expr_l69_c43.line=69;
$expr_l69_c43.column=43;
function $assign_l69_c17(_event){
x = $expr_l69_c43.apply(this, arguments);
};
$assign_l69_c17.tagname='assign';
$assign_l69_c17.line=69;
$assign_l69_c17.column=17;
function $if_l68_c13(_event){
if($cond_l68_c22.apply(this, arguments)){
    $assign_l69_c17.apply(this, arguments);
}
};
$if_l68_c13.tagname='if';
$if_l68_c13.line=68;
$if_l68_c13.column=13;
function $cond_l72_c22(_event){
return x === 26;
};
$cond_l72_c22.tagname='undefined';
$cond_l72_c22.line=72;
$cond_l72_c22.column=22;
function $cond_l73_c30(_event){
return x === 27;
};
$cond_l73_c30.tagname='undefined';
$cond_l73_c30.line=73;
$cond_l73_c30.column=30;
function $expr_l74_c43(_event){
return x + 1;
};
$expr_l74_c43.tagname='undefined';
$expr_l74_c43.line=74;
$expr_l74_c43.column=43;
function $assign_l74_c17(_event){
x = $expr_l74_c43.apply(this, arguments);
};
$assign_l74_c17.tagname='assign';
$assign_l74_c17.line=74;
$assign_l74_c17.column=17;
function $expr_l76_c43(_event){
return x + 10;
};
$expr_l76_c43.tagname='undefined';
$expr_l76_c43.line=76;
$expr_l76_c43.column=43;
function $assign_l76_c17(_event){
x = $expr_l76_c43.apply(this, arguments);
};
$assign_l76_c17.tagname='assign';
$assign_l76_c17.line=76;
$assign_l76_c17.column=17;
function $if_l72_c13(_event){
if($cond_l72_c22.apply(this, arguments)){
}else if($cond_l73_c30.apply(this, arguments)){
    $assign_l74_c17.apply(this, arguments);
}else{
    $assign_l76_c17.apply(this, arguments);
}
};
$if_l72_c13.tagname='if';
$if_l72_c13.line=72;
$if_l72_c13.column=13;
function $cond_l79_c22(_event){
return x === 28;
};
$cond_l79_c22.tagname='undefined';
$cond_l79_c22.line=79;
$cond_l79_c22.column=22;
function $expr_l80_c43(_event){
return x + 12;
};
$expr_l80_c43.tagname='undefined';
$expr_l80_c43.line=80;
$expr_l80_c43.column=43;
function $assign_l80_c17(_event){
x = $expr_l80_c43.apply(this, arguments);
};
$assign_l80_c17.tagname='assign';
$assign_l80_c17.line=80;
$assign_l80_c17.column=17;
function $cond_l81_c26(_event){
return x === 40;
};
$cond_l81_c26.tagname='undefined';
$cond_l81_c26.line=81;
$cond_l81_c26.column=26;
function $expr_l82_c47(_event){
return x + 10;
};
$expr_l82_c47.tagname='undefined';
$expr_l82_c47.line=82;
$expr_l82_c47.column=47;
function $assign_l82_c21(_event){
x = $expr_l82_c47.apply(this, arguments);
};
$assign_l82_c21.tagname='assign';
$assign_l82_c21.line=82;
$assign_l82_c21.column=21;
function $if_l81_c17(_event){
if($cond_l81_c26.apply(this, arguments)){
    $assign_l82_c21.apply(this, arguments);
}
};
$if_l81_c17.tagname='if';
$if_l81_c17.line=81;
$if_l81_c17.column=17;
function $if_l79_c13(_event){
if($cond_l79_c22.apply(this, arguments)){
    $assign_l80_c17.apply(this, arguments);
    $if_l81_c17.apply(this, arguments);
}
};
$if_l79_c13.tagname='if';
$if_l79_c13.line=79;
$if_l79_c13.column=13;
function $cond_l86_c22(_event){
return x === 50;
};
$cond_l86_c22.tagname='undefined';
$cond_l86_c22.line=86;
$cond_l86_c22.column=22;
function $expr_l87_c43(_event){
return x + 1;
};
$expr_l87_c43.tagname='undefined';
$expr_l87_c43.line=87;
$expr_l87_c43.column=43;
function $assign_l87_c17(_event){
x = $expr_l87_c43.apply(this, arguments);
};
$assign_l87_c17.tagname='assign';
$assign_l87_c17.line=87;
$assign_l87_c17.column=17;
function $cond_l88_c26(_event){
return x !== 51;
};
$cond_l88_c26.tagname='undefined';
$cond_l88_c26.line=88;
$cond_l88_c26.column=26;
function $expr_l90_c47(_event){
return x + 20;
};
$expr_l90_c47.tagname='undefined';
$expr_l90_c47.line=90;
$expr_l90_c47.column=47;
function $assign_l90_c21(_event){
x = $expr_l90_c47.apply(this, arguments);
};
$assign_l90_c21.tagname='assign';
$assign_l90_c21.line=90;
$assign_l90_c21.column=21;
function $if_l88_c17(_event){
if($cond_l88_c26.apply(this, arguments)){
}else{
    $assign_l90_c21.apply(this, arguments);
}
};
$if_l88_c17.tagname='if';
$if_l88_c17.line=88;
$if_l88_c17.column=17;
function $if_l86_c13(_event){
if($cond_l86_c22.apply(this, arguments)){
    $assign_l87_c17.apply(this, arguments);
    $if_l88_c17.apply(this, arguments);
}
};
$if_l86_c13.tagname='if';
$if_l86_c13.line=86;
$if_l86_c13.column=13;
function $expr_l94_c33(_event){
return x;
};
$expr_l94_c33.tagname='undefined';
$expr_l94_c33.line=94;
$expr_l94_c33.column=33;
function $log_l94_c13(_event){
this.log("x",$expr_l94_c33.apply(this, arguments));
};
$log_l94_c13.tagname='log';
$log_l94_c13.line=94;
$log_l94_c13.column=13;
function $cond_l97_c37(_event){
return x === 71;
};
$cond_l97_c37.tagname='undefined';
$cond_l97_c37.line=97;
$cond_l97_c37.column=37;
function $data_l22_c27(_event){
return 0;
};
$data_l22_c27.tagname='undefined';
$data_l22_c27.line=22;
$data_l22_c27.column=27;
function $datamodel_l21_c5(_event){
if(typeof x === "undefined")  x = $data_l22_c27.apply(this, arguments);
};
$datamodel_l21_c5.tagname='datamodel';
$datamodel_l21_c5.line=21;
$datamodel_l21_c5.column=5;
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "a",
   "$type": "state",
   "onEntry": [
    $log_l28_c13,
    $if_l29_c13,
    $log_l36_c13
   ],
   "transitions": [
    {
     "event": "t",
     "target": "b",
     "cond": $cond_l39_c48,
     "onTransition": $assign_l40_c13
    }
   ],
   "onExit": [
    $log_l45_c13,
    $if_l46_c13,
    $log_l51_c13
   ]
  },
  {
   "id": "b",
   "$type": "state",
   "onEntry": [
    $log_l58_c13,
    $if_l59_c13,
    $if_l68_c13,
    $if_l72_c13,
    $if_l79_c13,
    $if_l86_c13,
    $log_l94_c13
   ],
   "transitions": [
    {
     "target": "c",
     "cond": $cond_l97_c37
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
 "onEntry": [
  $datamodel_l21_c5
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/if-else/test0.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L2lmLWVsc2UvdGVzdDAuc2N4bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQTZDaUMsUTs7Ozs7O0FBQXBCLG1EOzs7Ozs7QUFDUyxRLENBQUUsRyxDQUFJLEU7Ozs7OztBQUNlLFEsQ0FBRSxDLENBQUUsQzs7Ozs7O0FBQTlCLHlDOzs7Ozs7QUFFMEIsUSxDQUFFLEMsQ0FBRSxDOzs7Ozs7QUFBOUIseUM7Ozs7OztBQUhKO0FBQUE7QUFBQTtBQUFBO0FBQUEsQzs7Ozs7O0FBS29CLFE7Ozs7OztBQUFwQixtRDs7Ozs7O0FBdkJvQixROzs7Ozs7QUFBcEIsbUQ7Ozs7OztBQUNTLFEsQ0FBRSxHLENBQUksQzs7Ozs7O0FBQ2UsUzs7Ozs7O0FBQTFCLHlDOzs7Ozs7QUFDYSxRLENBQUUsRyxDQUFJLEU7Ozs7OztBQUNPLFM7Ozs7OztBQUExQix5Qzs7Ozs7O0FBRTBCLFM7Ozs7OztBQUExQix5Qzs7Ozs7O0FBTEo7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQzs7Ozs7O0FBT29CLFE7Ozs7OztBQUFwQixtRDs7Ozs7O0FBSTBCLFEsQ0FBRSxDLENBQUUsQzs7Ozs7O0FBQTlCLHlDOzs7Ozs7QUFEbUMsUSxDQUFFLEcsQ0FBSSxFOzs7Ozs7QUFtQnJCLFE7Ozs7OztBQUFwQixtRDs7Ozs7O0FBQ1MsUSxDQUFFLEcsQ0FBSSxDOzs7Ozs7QUFDZSxVOzs7Ozs7QUFBMUIseUM7Ozs7OztBQUNhLFEsQ0FBRSxHLENBQUksRTs7Ozs7O0FBQ08sUSxDQUFFLEMsQ0FBRSxDOzs7Ozs7QUFBOUIseUM7Ozs7OztBQUMwQixRLENBQUUsQyxDQUFFLEM7Ozs7OztBQUE5Qix5Qzs7Ozs7O0FBRTBCLFU7Ozs7OztBQUExQix5Qzs7Ozs7O0FBTko7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxDOzs7Ozs7QUFTUyxRLENBQUUsRyxDQUFJLEU7Ozs7OztBQUNlLFEsQ0FBRSxDLENBQUUsQzs7Ozs7O0FBQTlCLHlDOzs7Ozs7QUFESjtBQUFBO0FBQUEsQzs7Ozs7O0FBSVMsUSxDQUFFLEcsQ0FBSSxFOzs7Ozs7QUFDRSxRLENBQUUsRyxDQUFJLEU7Ozs7OztBQUNPLFEsQ0FBRSxDLENBQUUsQzs7Ozs7O0FBQTlCLHlDOzs7Ozs7QUFFMEIsUSxDQUFFLEMsQ0FBRSxFOzs7Ozs7QUFBOUIseUM7Ozs7OztBQUpKO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxDOzs7Ozs7QUFPUyxRLENBQUUsRyxDQUFJLEU7Ozs7OztBQUNlLFEsQ0FBRSxDLENBQUUsRTs7Ozs7O0FBQTlCLHlDOzs7Ozs7QUFDUyxRLENBQUUsRyxDQUFJLEU7Ozs7OztBQUNlLFEsQ0FBRSxDLENBQUUsRTs7Ozs7O0FBQTlCLHlDOzs7Ozs7QUFESjtBQUFBO0FBQUEsQzs7Ozs7O0FBRko7QUFBQTtBQUFBO0FBQUEsQzs7Ozs7O0FBT1MsUSxDQUFFLEcsQ0FBSSxFOzs7Ozs7QUFDZSxRLENBQUUsQyxDQUFFLEM7Ozs7OztBQUE5Qix5Qzs7Ozs7O0FBQ1MsUSxDQUFFLEcsQ0FBSSxFOzs7Ozs7QUFFZSxRLENBQUUsQyxDQUFFLEU7Ozs7OztBQUE5Qix5Qzs7Ozs7O0FBRko7QUFBQTtBQUFBO0FBQUEsQzs7Ozs7O0FBRko7QUFBQTtBQUFBO0FBQUEsQzs7Ozs7O0FBUW9CLFE7Ozs7OztBQUFwQixtRDs7Ozs7O0FBR3dCLFEsQ0FBRSxHLENBQUksRTs7Ozs7O0FBM0VoQixROzs7Ozs7QUFEdEIsdUUifQ==