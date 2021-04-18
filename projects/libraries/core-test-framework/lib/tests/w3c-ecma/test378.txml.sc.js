//Generated on 2017-9-20 12:41:06 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
var Var1;
function getDelayInMs(delayString){
    if(typeof delayString === 'string') {
        if (delayString.slice(-2) === "ms") {
            return parseFloat(delayString.slice(0, -2));
        } else if (delayString.slice(-1) === "s") {
            return parseFloat(delayString.slice(0, -1)) * 1000;
        } else if (delayString.slice(-1) === "m") {
            return parseFloat(delayString.slice(0, -1)) * 1000 * 60;
        } else {
            return parseFloat(delayString);
        }
    }else if (typeof delayString === 'number'){
        return delayString;
    }else{
        return 0;
    }
}
function $deserializeDatamodel($serializedDatamodel){
  Var1 = $serializedDatamodel["Var1"];
}
function $serializeDatamodel(){
   return {
  "Var1" : Var1
   };
}
function $senddata_l8_c5(_event){
return {
};
};
$senddata_l8_c5.tagname='send';
$senddata_l8_c5.line=8;
$senddata_l8_c5.column=5;
function $send_l8_c5(_event){
var _scionTargetRef = "baz";
     this.send(
{
  target: _scionTargetRef,
  name: "event1",
  data: $senddata_l8_c5.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs(null),
       });
};
$send_l8_c5.tagname='send';
$send_l8_c5.line=8;
$send_l8_c5.column=5;
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
function $cond_l18_c20(_event){
return Var1==2;
};
$cond_l18_c20.tagname='undefined';
$cond_l18_c20.line=18;
$cond_l18_c20.column=20;
function $expr_l22_c53(_event){
return 'pass';
};
$expr_l22_c53.tagname='undefined';
$expr_l22_c53.line=22;
$expr_l22_c53.column=53;
function $log_l22_c27(_event){
this.log("Outcome",$expr_l22_c53.apply(this, arguments));
};
$log_l22_c27.tagname='log';
$log_l22_c27.line=22;
$log_l22_c27.column=27;
function $expr_l23_c53(_event){
return 'fail';
};
$expr_l23_c53.tagname='undefined';
$expr_l23_c53.line=23;
$expr_l23_c53.column=53;
function $log_l23_c27(_event){
this.log("Outcome",$expr_l23_c53.apply(this, arguments));
};
$log_l23_c27.tagname='log';
$log_l23_c27.line=23;
$log_l23_c27.column=27;
function $data_l3_c24(_event){
return 1;
};
$data_l3_c24.tagname='undefined';
$data_l3_c24.line=3;
$data_l3_c24.column=24;
function $datamodel_l2_c1(_event){
if(typeof Var1 === "undefined")  Var1 = $data_l3_c24.apply(this, arguments);
};
$datamodel_l2_c1.tagname='datamodel';
$datamodel_l2_c1.line=2;
$datamodel_l2_c1.column=1;
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "{http://www.w3.org/2000/xmlns/}conf": "http://www.w3.org/2005/scxml-conformance",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "s0",
   "$type": "state",
   "onExit": [
    [
     $send_l8_c5
    ],
    [
     $assign_l11_c5
    ]
   ],
   "transitions": [
    {
     "target": "s1"
    }
   ]
  },
  {
   "id": "s1",
   "$type": "state",
   "transitions": [
    {
     "cond": $cond_l18_c20,
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
    $log_l22_c27
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l23_c27
   ]
  }
 ],
 "onEntry": [
  $datamodel_l2_c1
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test378.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QzNzgudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFRSztBQUFBLEM7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVOzs7Ozs7QUFHNkIsVyxDQUFLLEMsQ0FBRSxDOzs7Ozs7QUFBcEMsNEM7Ozs7OztBQU9lLFdBQUksRUFBRSxDOzs7Ozs7QUFJMkIsYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUFDMEIsYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUFwQkgsUTs7Ozs7O0FBRHZCLDRFIn0=