//Generated on 2017-9-20 12:41:21 by the SCION SCXML compiler
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
function $cond_l8_c21(_event){
return var1 instanceof Array;
};
$cond_l8_c21.tagname='undefined';
$cond_l8_c21.line=8;
$cond_l8_c21.column=21;
function $cond_l13_c21(_event){
return var2 instanceof Array;
};
$cond_l13_c21.tagname='undefined';
$cond_l13_c21.line=13;
$cond_l13_c21.column=21;
function $expr_l17_c53(_event){
return 'pass';
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
function $expr_l18_c53(_event){
return 'fail';
};
$expr_l18_c53.tagname='undefined';
$expr_l18_c53.line=18;
$expr_l18_c53.column=53;
function $log_l18_c27(_event){
this.log("Outcome",$expr_l18_c53.apply(this, arguments));
};
$log_l18_c27.tagname='log';
$log_l18_c27.line=18;
$log_l18_c27.column=27;
function $data_l3_c19(_event){
return [1, 2, 3];
};
$data_l3_c19.tagname='undefined';
$data_l3_c19.line=3;
$data_l3_c19.column=19;
function $data_l4_c2(_event){
return [1,2,3];
};
$data_l4_c2.tagname='undefined';
$data_l4_c2.line=4;
$data_l4_c2.column=2;
function $datamodel_l2_c2(_event){
if(typeof var1 === "undefined")  var1 = $data_l3_c19.apply(this, arguments);
if(typeof var2 === "undefined")  var2 = $data_l4_c2.apply(this, arguments);
};
$datamodel_l2_c2.tagname='datamodel';
$datamodel_l2_c2.line=2;
$datamodel_l2_c2.column=2;
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
   "transitions": [
    {
     "cond": $cond_l8_c21,
     "target": "s1"
    },
    {
     "target": "fail"
    }
   ]
  },
  {
   "id": "s1",
   "$type": "state",
   "transitions": [
    {
     "cond": $cond_l13_c21,
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
    $log_l17_c27
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l18_c27
   ]
  }
 ],
 "onEntry": [
  $datamodel_l2_c2
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test446.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3Q0NDYudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFRcUIsVyxDQUFLLFUsQ0FBVyxLOzs7Ozs7QUFLaEIsVyxDQUFLLFUsQ0FBVyxLOzs7Ozs7QUFJZ0IsYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUFDMEIsYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUFmUixRQUFDLENBQUMsQyxDQUFFLENBQUMsQyxDQUFFLENBQUMsQzs7Ozs7O0FBQ3pCLFFBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEM7Ozs7OztBQUZOO0FBQUEsMkUifQ==