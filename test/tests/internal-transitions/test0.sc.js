//Generated on 2017-9-20 12:41:50 by the SCION SCXML compiler
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
function $expr_l26_c29(_event){
return x;
};
$expr_l26_c29.tagname='undefined';
$expr_l26_c29.line=26;
$expr_l26_c29.column=29;
function $log_l26_c9(_event){
this.log("x",$expr_l26_c29.apply(this, arguments));
};
$log_l26_c9.tagname='log';
$log_l26_c9.line=26;
$log_l26_c9.column=9;
function $expr_l35_c39(_event){
return x + 1;
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
function $expr_l31_c39(_event){
return x + 1;
};
$expr_l31_c39.tagname='undefined';
$expr_l31_c39.line=31;
$expr_l31_c39.column=39;
function $assign_l31_c13(_event){
x = $expr_l31_c39.apply(this, arguments);
};
$assign_l31_c13.tagname='assign';
$assign_l31_c13.line=31;
$assign_l31_c13.column=13;
function $cond_l46_c65(_event){
return x === 1;
};
$cond_l46_c65.tagname='undefined';
$cond_l46_c65.line=46;
$cond_l46_c65.column=65;
function $cond_l43_c51(_event){
return x === 1;
};
$cond_l43_c51.tagname='undefined';
$cond_l43_c51.line=43;
$cond_l43_c51.column=51;
function $cond_l50_c48(_event){
return x === 2;
};
$cond_l50_c48.tagname='undefined';
$cond_l50_c48.line=50;
$cond_l50_c48.column=48;
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
 "transitions": [
  {
   "event": "*",
   "onTransition": $log_l26_c9
  }
 ],
 "states": [
  {
   "id": "a",
   "$type": "state",
   "onEntry": [
    $assign_l31_c13
   ],
   "onExit": [
    $assign_l35_c13
   ],
   "states": [
    {
     "id": "a1",
     "$type": "state"
    },
    {
     "id": "a2",
     "$type": "state",
     "transitions": [
      {
       "target": "b",
       "event": "t2",
       "cond": $cond_l43_c51
      }
     ]
    }
   ],
   "transitions": [
    {
     "target": "a2",
     "event": "t1",
     "type": "internal",
     "cond": $cond_l46_c65
    }
   ]
  },
  {
   "id": "b",
   "$type": "state",
   "transitions": [
    {
     "target": "c",
     "event": "t3",
     "cond": $cond_l50_c48
    }
   ]
  },
  {
   "id": "c",
   "$type": "state"
  }
 ],
 "onEntry": [
  $datamodel_l21_c5
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/internal-transitions/test0.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L2ludGVybmFsLXRyYW5zaXRpb25zL3Rlc3QwLnNjeG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUEwQjZCLFE7Ozs7OztBQUFwQixtRDs7Ozs7O0FBUzhCLFEsQ0FBRSxDLENBQUUsQzs7Ozs7O0FBQTlCLHlDOzs7Ozs7QUFKMEIsUSxDQUFFLEMsQ0FBRSxDOzs7Ozs7QUFBOUIseUM7Ozs7OztBQWVvRCxRLENBQUUsRyxDQUFJLEM7Ozs7OztBQUhwQixRLENBQUUsRyxDQUFJLEM7Ozs7OztBQU9ULFEsQ0FBRSxHLENBQUksQzs7Ozs7O0FBNUIzQixROzs7Ozs7QUFEdEIsdUUifQ==