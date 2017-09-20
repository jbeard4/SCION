//Generated on 2017-9-20 12:41:33 by the SCION SCXML compiler
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
function $senddata_l7_c4(_event){
return {
};
};
$senddata_l7_c4.tagname='send';
$senddata_l7_c4.line=7;
$senddata_l7_c4.column=4;
function $send_l7_c4(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "timeout",
  data: $senddata_l7_c4.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs("1s"),
       });
};
$send_l7_c4.tagname='send';
$send_l7_c4.line=7;
$send_l7_c4.column=4;
function $script_lundefined_cundefined(_event){
throw new Error("Param references location not declared in the datamodel:foo.bar.baz ")
};
$script_lundefined_cundefined.tagname='script';
$script_lundefined_cundefined.line=undefined;
$script_lundefined_cundefined.column=undefined;
function $expr_l23_c53(_event){
return 'pass';
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
function $expr_l24_c53(_event){
return 'fail';
};
$expr_l24_c53.tagname='undefined';
$expr_l24_c53.line=24;
$expr_l24_c53.column=53;
function $log_l24_c27(_event){
this.log("Outcome",$expr_l24_c53.apply(this, arguments));
};
$log_l24_c27.tagname='log';
$log_l24_c27.line=24;
$log_l24_c27.column=27;
function $data_l2_c29(_event){
return 0;
};
$data_l2_c29.tagname='undefined';
$data_l2_c29.line=2;
$data_l2_c29.column=29;
function $datamodel_l1_c2(_event){
if(typeof Var1 === "undefined")  Var1 = $data_l2_c29.apply(this, arguments);
};
$datamodel_l1_c2.tagname='datamodel';
$datamodel_l1_c2.line=1;
$datamodel_l1_c2.column=2;
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "{http://www.w3.org/2000/xmlns/}conf": "http://www.w3.org/2005/scxml-conformance",
 "initial": "s0",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "s0",
   "initial": "s01",
   "$type": "state",
   "onEntry": [
    $send_l7_c4
   ],
   "transitions": [
    {
     "event": "error.execution",
     "target": "pass"
    },
    {
     "event": "*",
     "target": "fail"
    }
   ],
   "states": [
    {
     "id": "s01",
     "$type": "state",
     "transitions": [
      {
       "target": "s02"
      }
     ]
    },
    {
     "id": "s02",
     "$type": "final",
     "onEntry": $script_lundefined_cundefined
    }
   ]
  },
  {
   "id": "pass",
   "$type": "final",
   "onEntry": [
    $log_l23_c27
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l24_c27
   ]
  }
 ],
 "onEntry": [
  $datamodel_l1_c2
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test298.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QyOTgudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFPSTtBQUFBLEM7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVOzs7Ozs7Ozs7Ozs7QUFnQmlELGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBQzBCLGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBdEJFLFE7Ozs7OztBQUQzQiw0RSJ9