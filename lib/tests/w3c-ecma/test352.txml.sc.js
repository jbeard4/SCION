//Generated on 2017-9-20 12:40:04 by the SCION SCXML compiler
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
  name: "timeout",
  data: $senddata_l8_c6.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs("5s"),
       });
};
$send_l8_c6.tagname='send';
$send_l8_c6.line=8;
$send_l8_c6.column=6;
function $senddata_l9_c5(_event){
return {
};
};
$senddata_l9_c5.tagname='send';
$senddata_l9_c5.line=9;
$senddata_l9_c5.column=5;
function $send_l9_c5(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "s0Event",
  data: $senddata_l9_c5.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs(null),
  type: "http://www.w3.org/TR/scxml/#SCXMLEventProcessor",
       });
};
$send_l9_c5.tagname='send';
$send_l9_c5.line=9;
$send_l9_c5.column=5;
function $expr_l12_c34(_event){
return _event.origintype;
};
$expr_l12_c34.tagname='undefined';
$expr_l12_c34.line=12;
$expr_l12_c34.column=34;
function $assign_l12_c5(_event){
Var1 = $expr_l12_c34.apply(this, arguments);
};
$assign_l12_c5.tagname='assign';
$assign_l12_c5.line=12;
$assign_l12_c5.column=5;
function $cond_l20_c20(_event){
return Var1=='http://www.w3.org/TR/scxml/#SCXMLEventProcessor';
};
$cond_l20_c20.tagname='undefined';
$cond_l20_c20.line=20;
$cond_l20_c20.column=20;
function $expr_l25_c56(_event){
return 'pass';
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
function $expr_l26_c56(_event){
return 'fail';
};
$expr_l26_c56.tagname='undefined';
$expr_l26_c56.line=26;
$expr_l26_c56.column=56;
function $log_l26_c30(_event){
this.log("Outcome",$expr_l26_c56.apply(this, arguments));
};
$log_l26_c30.tagname='log';
$log_l26_c30.line=26;
$log_l26_c30.column=30;
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
    $send_l8_c6,
    $send_l9_c5
   ],
   "transitions": [
    {
     "event": "s0Event",
     "target": "s1",
     "onTransition": $assign_l12_c5
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
     "cond": $cond_l20_c20,
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
    $log_l25_c30
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l26_c30
   ]
  }
 ],
 "onEntry": [],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test352.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QzNTIudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFRTTtBQUFBLEM7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVOzs7Ozs7QUFDRDtBQUFBLEM7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFU7Ozs7OztBQUc2QixhQUFNLENBQUMsVTs7Ozs7O0FBQXBDLDRDOzs7Ozs7QUFRZSxXQUFJLEVBQUUsaUQ7Ozs7OztBQUs4QixhOzs7Ozs7QUFBMUIseUQ7Ozs7OztBQUMwQixhOzs7Ozs7QUFBMUIseUQifQ==