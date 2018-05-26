//Generated on 2017-9-20 12:40:58 by the SCION SCXML compiler
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
function $expr_l9_c32(_event){
return 1;
};
$expr_l9_c32.tagname='undefined';
$expr_l9_c32.line=9;
$expr_l9_c32.column=32;
function $senddata_l8_c4(_event){
return {
"aParam":$expr_l9_c32.apply(this, arguments)};
};
$senddata_l8_c4.tagname='send';
$senddata_l8_c4.line=8;
$senddata_l8_c4.column=4;
function $send_l8_c4(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "event1",
  data: $senddata_l8_c4.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs(null),
       });
};
$send_l8_c4.tagname='send';
$send_l8_c4.line=8;
$send_l8_c4.column=4;
function $senddata_l11_c4(_event){
return {
};
};
$senddata_l11_c4.tagname='send';
$senddata_l11_c4.line=11;
$senddata_l11_c4.column=4;
function $send_l11_c4(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "timeout",
  data: $senddata_l11_c4.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs(null),
       });
};
$send_l11_c4.tagname='send';
$send_l11_c4.line=11;
$send_l11_c4.column=4;
function $expr_l16_c35(_event){
return _event.data.aParam;
};
$expr_l16_c35.tagname='undefined';
$expr_l16_c35.line=16;
$expr_l16_c35.column=35;
function $assign_l16_c6(_event){
Var1 = $expr_l16_c35.apply(this, arguments);
};
$assign_l16_c6.tagname='assign';
$assign_l16_c6.line=16;
$assign_l16_c6.column=6;
function $cond_l22_c20(_event){
return Var1==1;
};
$cond_l22_c20.tagname='undefined';
$cond_l22_c20.line=22;
$cond_l22_c20.column=20;
function $expr_l26_c53(_event){
return 'pass';
};
$expr_l26_c53.tagname='undefined';
$expr_l26_c53.line=26;
$expr_l26_c53.column=53;
function $log_l26_c27(_event){
this.log("Outcome",$expr_l26_c53.apply(this, arguments));
};
$log_l26_c27.tagname='log';
$log_l26_c27.line=26;
$log_l26_c27.column=27;
function $expr_l27_c53(_event){
return 'fail';
};
$expr_l27_c53.tagname='undefined';
$expr_l27_c53.line=27;
$expr_l27_c53.column=53;
function $log_l27_c27(_event){
this.log("Outcome",$expr_l27_c53.apply(this, arguments));
};
$log_l27_c27.tagname='log';
$log_l27_c27.line=27;
$log_l27_c27.column=27;
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
    $send_l8_c4,
    $send_l11_c4
   ],
   "transitions": [
    {
     "event": "event1",
     "target": "s1",
     "onTransition": $assign_l16_c6
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
     "cond": $cond_l22_c20,
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
    $log_l26_c27
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l27_c27
   ]
  }
 ],
 "onEntry": [],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test205.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QyMDUudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFTZ0MsUTs7Ozs7O0FBRDVCO0FBQUEsNkM7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVOzs7Ozs7QUFHQTtBQUFBLEM7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVOzs7Ozs7QUFLK0IsYUFBTSxDQUFDLElBQUksQ0FBQyxNOzs7Ozs7QUFBekMsNEM7Ozs7OztBQU1jLFdBQUksRUFBRSxDOzs7Ozs7QUFJMkIsYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUFDMEIsYTs7Ozs7O0FBQTFCLHlEIn0=