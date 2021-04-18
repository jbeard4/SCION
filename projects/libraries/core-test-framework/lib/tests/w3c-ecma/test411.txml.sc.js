//Generated on 2017-9-20 12:39:54 by the SCION SCXML compiler
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
function $senddata_l8_c5(_event){
return {
};
};
$senddata_l8_c5.tagname='send';
$senddata_l8_c5.line=8;
$senddata_l8_c5.column=5;
function $send_l8_c5(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "timeout",
  data: $senddata_l8_c5.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs("1s"),
       });
};
$send_l8_c5.tagname='send';
$send_l8_c5.line=8;
$send_l8_c5.column=5;
function $cond_l9_c14(_event){
return In('s01');
};
$cond_l9_c14.tagname='undefined';
$cond_l9_c14.line=9;
$cond_l9_c14.column=14;
function $raise_l10_c7(_event){
this.raise({ name:"event1", data : null});
};
$raise_l10_c7.tagname='raise';
$raise_l10_c7.line=10;
$raise_l10_c7.column=7;
function $if_l9_c5(_event){
if($cond_l9_c14.apply(this, arguments)){
    $raise_l10_c7.apply(this, arguments);
}
};
$if_l9_c5.tagname='if';
$if_l9_c5.line=9;
$if_l9_c5.column=5;
function $cond_l20_c15(_event){
return In('s01');
};
$cond_l20_c15.tagname='undefined';
$cond_l20_c15.line=20;
$cond_l20_c15.column=15;
function $raise_l21_c8(_event){
this.raise({ name:"event2", data : null});
};
$raise_l21_c8.tagname='raise';
$raise_l21_c8.line=21;
$raise_l21_c8.column=8;
function $if_l20_c6(_event){
if($cond_l20_c15.apply(this, arguments)){
    $raise_l21_c8.apply(this, arguments);
}
};
$if_l20_c6.tagname='if';
$if_l20_c6.line=20;
$if_l20_c6.column=6;
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
    $send_l8_c5,
    $if_l9_c5
   ],
   "transitions": [
    {
     "event": "timeout",
     "target": "fail"
    },
    {
     "event": "event1",
     "target": "fail"
    },
    {
     "event": "event2",
     "target": "pass"
    }
   ],
   "states": [
    {
     "id": "s01",
     "$type": "state",
     "onEntry": [
      $if_l20_c6
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
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test411.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3Q0MTEudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVFLO0FBQUEsQzs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFU7Ozs7OztBQUNTLFNBQUUsQ0FBQyxLQUFLLEM7Ozs7OztBQUNmLDBDOzs7Ozs7QUFERjtBQUFBO0FBQUEsQzs7Ozs7O0FBV1UsU0FBRSxDQUFDLEtBQUssQzs7Ozs7O0FBQ2YsMEM7Ozs7OztBQURGO0FBQUE7QUFBQSxDOzs7Ozs7QUFRK0MsYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUFDMEIsYTs7Ozs7O0FBQTFCLHlEIn0=