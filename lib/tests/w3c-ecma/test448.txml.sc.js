//Generated on 2017-9-20 12:41:26 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
var var1, var2;
function $deserializeDatamodel($serializedDatamodel){
  var1 = $serializedDatamodel["var1"];
  var2 = $serializedDatamodel["var2"];
}
function $serializeDatamodel(){
   return {
  "var1" : var1,
  "var2" : var2
   };
}
function $cond_l5_c20(_event){
return var1==1;
};
$cond_l5_c20.tagname='undefined';
$cond_l5_c20.line=5;
$cond_l5_c20.column=20;
function $cond_l17_c29(_event){
return var2==1;
};
$cond_l17_c29.tagname='undefined';
$cond_l17_c29.line=17;
$cond_l17_c29.column=29;
function $expr_l28_c53(_event){
return 'pass';
};
$expr_l28_c53.tagname='undefined';
$expr_l28_c53.line=28;
$expr_l28_c53.column=53;
function $log_l28_c27(_event){
this.log("Outcome",$expr_l28_c53.apply(this, arguments));
};
$log_l28_c27.tagname='log';
$log_l28_c27.line=28;
$log_l28_c27.column=27;
function $expr_l29_c53(_event){
return 'fail';
};
$expr_l29_c53.tagname='undefined';
$expr_l29_c53.line=29;
$expr_l29_c53.column=53;
function $log_l29_c27(_event){
this.log("Outcome",$expr_l29_c53.apply(this, arguments));
};
$log_l29_c27.tagname='log';
$log_l29_c27.line=29;
$log_l29_c27.column=27;
function $data_l9_c28(_event){
return 1;
};
$data_l9_c28.tagname='undefined';
$data_l9_c28.line=9;
$data_l9_c28.column=28;
function $datamodel_l8_c5(_event){
if(typeof var1 === "undefined")  var1 = $data_l9_c28.apply(this, arguments);
};
$datamodel_l8_c5.tagname='datamodel';
$datamodel_l8_c5.line=8;
$datamodel_l8_c5.column=5;
function $data_l22_c33(_event){
return 1;
};
$data_l22_c33.tagname='undefined';
$data_l22_c33.line=22;
$data_l22_c33.column=33;
function $datamodel_l21_c12(_event){
if(typeof var2 === "undefined")  var2 = $data_l22_c33.apply(this, arguments);
};
$datamodel_l21_c12.tagname='datamodel';
$datamodel_l21_c12.line=21;
$datamodel_l21_c12.column=12;
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "{http://www.w3.org/2000/xmlns/}conf": "http://www.w3.org/2005/scxml-conformance",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "s0",
   "$type": "state",
   "transitions": [
    {
     "cond": $cond_l5_c20,
     "target": "s1"
    },
    {
     "target": "fail"
    }
   ],
   "states": [
    {
     "id": "s01",
     "$type": "state"
    }
   ]
  },
  {
   "id": "s1",
   "initial": "s01p",
   "$type": "state",
   "states": [
    {
     "id": "s01p",
     "$type": "parallel",
     "states": [
      {
       "id": "s01p1",
       "$type": "state",
       "transitions": [
        {
         "cond": $cond_l17_c29,
         "target": "pass"
        },
        {
         "target": "fail"
        }
       ]
      },
      {
       "id": "s01p2",
       "$type": "state"
      }
     ]
    }
   ]
  },
  {
   "id": "pass",
   "$type": "final",
   "onEntry": [
    $log_l28_c27
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l29_c27
   ]
  }
 ],
 "onEntry": [
  $datamodel_l8_c5,
  $datamodel_l21_c12
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test448.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3Q0NDgudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFLb0IsV0FBSSxFQUFFLEM7Ozs7OztBQVlHLFdBQUksRUFBRSxDOzs7Ozs7QUFXa0IsYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUFDMEIsYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUFwQkMsUTs7Ozs7O0FBRHZCLDRFOzs7Ozs7QUFjNEIsUTs7Ozs7O0FBRHJCLDZFIn0=