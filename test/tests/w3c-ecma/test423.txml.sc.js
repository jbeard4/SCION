//Generated on 2017-9-20 12:40:07 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
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

}
function $serializeDatamodel(){
   return {

   };
}
function $senddata_l5_c5(_event){
return {
};
};
$senddata_l5_c5.tagname='send';
$senddata_l5_c5.line=5;
$senddata_l5_c5.column=5;
function $send_l5_c5(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "externalEvent1",
  data: $senddata_l5_c5.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs(null),
       });
};
$send_l5_c5.tagname='send';
$send_l5_c5.line=5;
$send_l5_c5.column=5;
function $senddata_l6_c5(_event){
return {
};
};
$senddata_l6_c5.tagname='send';
$senddata_l6_c5.line=6;
$senddata_l6_c5.column=5;
function $delayexpr_l6_c44(_event){
return '1s';
};
$delayexpr_l6_c44.tagname='undefined';
$delayexpr_l6_c44.line=6;
$delayexpr_l6_c44.column=44;
function $send_l6_c5(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "externalEvent2",
  data: $senddata_l6_c5.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs($delayexpr_l6_c44.apply(this, arguments)),
       });
};
$send_l6_c5.tagname='send';
$send_l6_c5.line=6;
$send_l6_c5.column=5;
function $raise_l7_c5(_event){
this.raise({ name:"internalEvent", data : null});
};
$raise_l7_c5.tagname='raise';
$raise_l7_c5.line=7;
$raise_l7_c5.column=5;
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
    $send_l5_c5,
    $send_l6_c5,
    $raise_l7_c5
   ],
   "transitions": [
    {
     "event": "internalEvent",
     "target": "s1"
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
     "event": "externalEvent2",
     "target": "pass"
    },
    {
     "event": "internalEvent",
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
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test423.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3Q0MjMudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUtLO0FBQUEsQzs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFU7Ozs7OztBQUNBO0FBQUEsQzs7Ozs7O0FBQXVDLFc7Ozs7OztBQUF2QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVTs7Ozs7O0FBQ0EsaUQ7Ozs7OztBQWNtRCxhOzs7Ozs7QUFBMUIseUQ7Ozs7OztBQUMwQixhOzs7Ozs7QUFBMUIseUQifQ==