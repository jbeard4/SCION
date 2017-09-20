//Generated on 2017-9-20 12:40:03 by the SCION SCXML compiler
function machineNameConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'machineName';
var Var1, Var2;
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
  Var2 = $serializedDatamodel["Var2"];
}
function $serializeDatamodel(){
   return {
  "Var1" : Var1,
  "Var2" : Var2
   };
}
function $eventexpr_l8_c22(_event){
return Var1;
};
$eventexpr_l8_c22.tagname='undefined';
$eventexpr_l8_c22.line=8;
$eventexpr_l8_c22.column=22;
function $senddata_l8_c6(_event){
return {
};
};
$senddata_l8_c6.tagname='send';
$senddata_l8_c6.line=8;
$senddata_l8_c6.column=6;
function $send_l8_c6(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: $eventexpr_l8_c22.apply(this, arguments),
  data: $senddata_l8_c6.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs(null),
       });
};
$send_l8_c6.tagname='send';
$send_l8_c6.line=8;
$send_l8_c6.column=6;
function $expr_l11_c36(_event){
return _event.name;
};
$expr_l11_c36.tagname='undefined';
$expr_l11_c36.line=11;
$expr_l11_c36.column=36;
function $assign_l11_c7(_event){
Var2 = $expr_l11_c36.apply(this, arguments);
};
$assign_l11_c7.tagname='assign';
$assign_l11_c7.line=11;
$assign_l11_c7.column=7;
function $cond_l17_c20(_event){
return Var1===Var2;
};
$cond_l17_c20.tagname='undefined';
$cond_l17_c20.line=17;
$cond_l17_c20.column=20;
function $expr_l21_c56(_event){
return 'pass';
};
$expr_l21_c56.tagname='undefined';
$expr_l21_c56.line=21;
$expr_l21_c56.column=56;
function $log_l21_c30(_event){
this.log("Outcome",$expr_l21_c56.apply(this, arguments));
};
$log_l21_c30.tagname='log';
$log_l21_c30.line=21;
$log_l21_c30.column=30;
function $expr_l22_c56(_event){
return 'fail';
};
$expr_l22_c56.tagname='undefined';
$expr_l22_c56.line=22;
$expr_l22_c56.column=56;
function $log_l22_c30(_event){
this.log("Outcome",$expr_l22_c56.apply(this, arguments));
};
$log_l22_c30.tagname='log';
$log_l22_c30.line=22;
$log_l22_c30.column=30;
function $data_l2_c25(_event){
return 'foo';
};
$data_l2_c25.tagname='undefined';
$data_l2_c25.line=2;
$data_l2_c25.column=25;
function $datamodel_l1_c2(_event){
if(typeof Var1 === "undefined")  Var1 = $data_l2_c25.apply(this, arguments);
};
$datamodel_l1_c2.tagname='datamodel';
$datamodel_l1_c2.line=1;
$datamodel_l1_c2.column=2;
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "{http://www.w3.org/2000/xmlns/}conf": "http://www.w3.org/2005/scxml-conformance",
 "initial": "s0",
 "name": "machineName",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "s0",
   "$type": "state",
   "onEntry": [
    $send_l8_c6
   ],
   "transitions": [
    {
     "event": "foo",
     "target": "s1",
     "onTransition": $assign_l11_c7
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
   "transitions": [
    {
     "cond": $cond_l17_c20,
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
    $log_l21_c30
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l22_c30
   ]
  }
 ],
 "onEntry": [
  $datamodel_l1_c2
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test342.txml.scxml"
};
}
module.exports = machineNameConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QzNDIudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVFzQixXOzs7Ozs7QUFBaEI7QUFBQSxDOzs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVTs7Ozs7O0FBRzhCLGFBQU0sQ0FBQyxJOzs7Ozs7QUFBcEMsNEM7Ozs7OztBQU1hLFdBQUksR0FBRyxJOzs7Ozs7QUFJNkIsYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUFDMEIsYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUFwQkwsWTs7Ozs7O0FBRHZCLDRFIn0=