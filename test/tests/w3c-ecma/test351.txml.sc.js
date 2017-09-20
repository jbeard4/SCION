//Generated on 2017-9-20 12:40:28 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
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
function $senddata_l10_c6(_event){
return {
};
};
$senddata_l10_c6.tagname='send';
$senddata_l10_c6.line=10;
$senddata_l10_c6.column=6;
function $send_l10_c6(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "timeout",
  data: $senddata_l10_c6.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs("5s"),
       });
};
$send_l10_c6.tagname='send';
$send_l10_c6.line=10;
$send_l10_c6.column=6;
function $senddata_l11_c6(_event){
return {
};
};
$senddata_l11_c6.tagname='send';
$senddata_l11_c6.line=11;
$senddata_l11_c6.column=6;
function $send_l11_c6(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "s0Event",
  data: $senddata_l11_c6.apply(this, arguments),
  sendid: "send1",
  origin: _sessionid
}, 
       {
           delay: getDelayInMs(null),
  type: "http://www.w3.org/TR/scxml/#SCXMLEventProcessor",
       });
};
$send_l11_c6.tagname='send';
$send_l11_c6.line=11;
$send_l11_c6.column=6;
function $expr_l14_c34(_event){
return _event.sendid;
};
$expr_l14_c34.tagname='undefined';
$expr_l14_c34.line=14;
$expr_l14_c34.column=34;
function $assign_l14_c5(_event){
Var1 = $expr_l14_c34.apply(this, arguments);
};
$assign_l14_c5.tagname='assign';
$assign_l14_c5.line=14;
$assign_l14_c5.column=5;
function $cond_l22_c20(_event){
return Var1=='send1';
};
$cond_l22_c20.tagname='undefined';
$cond_l22_c20.line=22;
$cond_l22_c20.column=20;
function $senddata_l29_c6(_event){
return {
};
};
$senddata_l29_c6.tagname='send';
$senddata_l29_c6.line=29;
$senddata_l29_c6.column=6;
function $send_l29_c6(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "timeout",
  data: $senddata_l29_c6.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs("5s"),
       });
};
$send_l29_c6.tagname='send';
$send_l29_c6.line=29;
$send_l29_c6.column=6;
function $senddata_l30_c7(_event){
return {
};
};
$senddata_l30_c7.tagname='send';
$senddata_l30_c7.line=30;
$senddata_l30_c7.column=7;
function $send_l30_c7(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "s0Event2",
  data: $senddata_l30_c7.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs(null),
       });
};
$send_l30_c7.tagname='send';
$send_l30_c7.line=30;
$send_l30_c7.column=7;
function $expr_l33_c34(_event){
return _event.sendid;
};
$expr_l33_c34.tagname='undefined';
$expr_l33_c34.line=33;
$expr_l33_c34.column=34;
function $assign_l33_c5(_event){
Var2 = $expr_l33_c34.apply(this, arguments);
};
$assign_l33_c5.tagname='assign';
$assign_l33_c5.line=33;
$assign_l33_c5.column=5;
function $cond_l39_c20(_event){
return !Var2;
};
$cond_l39_c20.tagname='undefined';
$cond_l39_c20.line=39;
$cond_l39_c20.column=20;
function $expr_l44_c56(_event){
return 'pass';
};
$expr_l44_c56.tagname='undefined';
$expr_l44_c56.line=44;
$expr_l44_c56.column=56;
function $log_l44_c30(_event){
this.log("Outcome",$expr_l44_c56.apply(this, arguments));
};
$log_l44_c30.tagname='log';
$log_l44_c30.line=44;
$log_l44_c30.column=30;
function $expr_l45_c56(_event){
return 'fail';
};
$expr_l45_c56.tagname='undefined';
$expr_l45_c56.line=45;
$expr_l45_c56.column=56;
function $log_l45_c30(_event){
this.log("Outcome",$expr_l45_c56.apply(this, arguments));
};
$log_l45_c30.tagname='log';
$log_l45_c30.line=45;
$log_l45_c30.column=30;
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
    $send_l10_c6,
    $send_l11_c6
   ],
   "transitions": [
    {
     "event": "s0Event",
     "target": "s1",
     "onTransition": $assign_l14_c5
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
     "target": "s2"
    },
    {
     "target": "fail"
    }
   ]
  },
  {
   "id": "s2",
   "$type": "state",
   "onEntry": [
    $send_l29_c6,
    $send_l30_c7
   ],
   "transitions": [
    {
     "event": "s0Event2",
     "target": "s3",
     "onTransition": $assign_l33_c5
    },
    {
     "event": "*",
     "target": "fail"
    }
   ]
  },
  {
   "id": "s3",
   "$type": "state",
   "transitions": [
    {
     "cond": $cond_l39_c20,
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
    $log_l44_c30
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l45_c30
   ]
  }
 ],
 "onEntry": [],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test351.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QzNTEudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVVNO0FBQUEsQzs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFU7Ozs7OztBQUNBO0FBQUEsQzs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVTs7Ozs7O0FBRzRCLGFBQU0sQ0FBQyxNOzs7Ozs7QUFBcEMsNEM7Ozs7OztBQVFlLFdBQUksRUFBRSxPOzs7Ozs7QUFPcEI7QUFBQSxDOzs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVTs7Ozs7O0FBQ0M7QUFBQSxDOzs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVTs7Ozs7O0FBRzJCLGFBQU0sQ0FBQyxNOzs7Ozs7QUFBcEMsNEM7Ozs7OztBQU1lLFFBQUMsSTs7Ozs7O0FBS21DLGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBQzBCLGE7Ozs7OztBQUExQix5RCJ9