//Generated on 2017-9-20 12:42:07 by the SCION SCXML compiler
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
function $expr_l32_c39(_event){
return x * 3;
};
$expr_l32_c39.tagname='undefined';
$expr_l32_c39.line=32;
$expr_l32_c39.column=39;
function $assign_l32_c13(_event){
x = $expr_l32_c39.apply(this, arguments);
};
$assign_l32_c13.tagname='assign';
$assign_l32_c13.line=32;
$assign_l32_c13.column=13;
function $expr_l33_c23(_event){
return 'b, x:' + x;
};
$expr_l33_c23.tagname='undefined';
$expr_l33_c23.line=33;
$expr_l33_c23.column=23;
function $log_l33_c13(_event){
this.log(null,$expr_l33_c23.apply(this, arguments));
};
$log_l33_c13.tagname='log';
$log_l33_c13.line=33;
$log_l33_c13.column=13;
function $cond_l60_c54(_event){
return x === 4410;
};
$cond_l60_c54.tagname='undefined';
$cond_l60_c54.line=60;
$cond_l60_c54.column=54;
function $cond_l62_c58(_event){
return x === 1470;
};
$cond_l62_c58.tagname='undefined';
$cond_l62_c58.line=62;
$cond_l62_c58.column=58;
function $expr_l44_c43(_event){
return x * 5;
};
$expr_l44_c43.tagname='undefined';
$expr_l44_c43.line=44;
$expr_l44_c43.column=43;
function $assign_l44_c17(_event){
x = $expr_l44_c43.apply(this, arguments);
};
$assign_l44_c17.tagname='assign';
$assign_l44_c17.line=44;
$assign_l44_c17.column=17;
function $expr_l45_c27(_event){
return 'b2, x:' + x;
};
$expr_l45_c27.tagname='undefined';
$expr_l45_c27.line=45;
$expr_l45_c27.column=27;
function $log_l45_c17(_event){
this.log(null,$expr_l45_c27.apply(this, arguments));
};
$log_l45_c17.tagname='log';
$log_l45_c17.line=45;
$log_l45_c17.column=17;
function $expr_l52_c43(_event){
return x * 7;
};
$expr_l52_c43.tagname='undefined';
$expr_l52_c43.line=52;
$expr_l52_c43.column=43;
function $assign_l52_c17(_event){
x = $expr_l52_c43.apply(this, arguments);
};
$assign_l52_c17.tagname='assign';
$assign_l52_c17.line=52;
$assign_l52_c17.column=17;
function $expr_l53_c27(_event){
return 'b3, x:' + x;
};
$expr_l53_c27.tagname='undefined';
$expr_l53_c27.line=53;
$expr_l53_c27.column=27;
function $log_l53_c17(_event){
this.log(null,$expr_l53_c27.apply(this, arguments));
};
$log_l53_c17.tagname='log';
$log_l53_c17.line=53;
$log_l53_c17.column=17;
function $data_l23_c27(_event){
return 2;
};
$data_l23_c27.tagname='undefined';
$data_l23_c27.line=23;
$data_l23_c27.column=27;
function $datamodel_l22_c5(_event){
if(typeof x === "undefined")  x = $data_l23_c27.apply(this, arguments);
};
$datamodel_l22_c5.tagname='datamodel';
$datamodel_l22_c5.line=22;
$datamodel_l22_c5.column=5;
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "initial": "a",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "a",
   "$type": "state",
   "transitions": [
    {
     "target": "h",
     "event": "t1"
    }
   ]
  },
  {
   "id": "b",
   "initial": "b1",
   "$type": "state",
   "onEntry": [
    $assign_l32_c13,
    $log_l33_c13
   ],
   "states": [
    {
     "id": "h",
     "$type": "history",
     "transitions": [
      {
       "target": "b2"
      }
     ]
    },
    {
     "id": "b1",
     "$type": "state"
    },
    {
     "id": "b2",
     "$type": "state",
     "onEntry": [
      $assign_l44_c17,
      $log_l45_c17
     ],
     "transitions": [
      {
       "event": "t2",
       "target": "b3"
      }
     ]
    },
    {
     "id": "b3",
     "$type": "state",
     "onEntry": [
      $assign_l52_c17,
      $log_l53_c17
     ],
     "transitions": [
      {
       "event": "t3",
       "target": "a"
      }
     ]
    }
   ],
   "transitions": [
    {
     "event": "t4",
     "target": "success",
     "cond": $cond_l60_c54
    },
    {
     "event": "t4",
     "target": "really-fail",
     "cond": $cond_l62_c58
    },
    {
     "event": "t4",
     "target": "fail"
    }
   ]
  },
  {
   "id": "success",
   "$type": "state"
  },
  {
   "id": "fail",
   "$type": "state"
  },
  {
   "id": "really-fail",
   "$type": "state"
  }
 ],
 "onEntry": [
  $datamodel_l22_c5
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/history/history6.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L2hpc3RvcnkvaGlzdG9yeTYuc2N4bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQWdDdUMsUSxDQUFFLEMsQ0FBRSxDOzs7Ozs7QUFBOUIseUM7Ozs7OztBQUNVLGMsQ0FBUSxDLENBQUUsQzs7Ozs7O0FBQXBCLG9EOzs7Ozs7QUEyQnlDLFEsQ0FBRSxHLENBQUksSTs7Ozs7O0FBRUYsUSxDQUFFLEcsQ0FBSSxJOzs7Ozs7QUFsQnJCLFEsQ0FBRSxDLENBQUUsQzs7Ozs7O0FBQTlCLHlDOzs7Ozs7QUFDVSxlLENBQVMsQyxDQUFFLEM7Ozs7OztBQUFyQixvRDs7Ozs7O0FBTzBCLFEsQ0FBRSxDLENBQUUsQzs7Ozs7O0FBQTlCLHlDOzs7Ozs7QUFDVSxlLENBQVMsQyxDQUFFLEM7Ozs7OztBQUFyQixvRDs7Ozs7O0FBOUJVLFE7Ozs7OztBQUR0Qix1RSJ9