//Generated on 2017-9-20 12:40:14 by the SCION SCXML compiler
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
function $raise_l4_c6(_event){
this.raise({ name:"internalEvent", data : null});
};
$raise_l4_c6.tagname='raise';
$raise_l4_c6.line=4;
$raise_l4_c6.column=6;
function $senddata_l5_c6(_event){
return {
};
};
$senddata_l5_c6.tagname='send';
$senddata_l5_c6.line=5;
$senddata_l5_c6.column=6;
function $send_l5_c6(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "externalEvent",
  data: $senddata_l5_c6.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs(null),
       });
};
$send_l5_c6.tagname='send';
$send_l5_c6.line=5;
$send_l5_c6.column=6;
function $expr_l14_c53(_event){
return 'pass';
};
$expr_l14_c53.tagname='undefined';
$expr_l14_c53.line=14;
$expr_l14_c53.column=53;
function $log_l14_c27(_event){
this.log("Outcome",$expr_l14_c53.apply(this, arguments));
};
$log_l14_c27.tagname='log';
$log_l14_c27.line=14;
$log_l14_c27.column=27;
function $expr_l15_c53(_event){
return 'fail';
};
$expr_l15_c53.tagname='undefined';
$expr_l15_c53.line=15;
$expr_l15_c53.column=53;
function $log_l15_c27(_event){
this.log("Outcome",$expr_l15_c53.apply(this, arguments));
};
$log_l15_c27.tagname='log';
$log_l15_c27.line=15;
$log_l15_c27.column=27;
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "{http://www.w3.org/2000/xmlns/}conf": "http://www.w3.org/2005/scxml-conformance",
 "initial": "s1",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "s1",
   "$type": "state",
   "onEntry": [
    $raise_l4_c6,
    $send_l5_c6
   ],
   "transitions": [
    {
     "event": "*",
     "target": "fail"
    },
    {
     "target": "pass"
    }
   ]
  },
  {
   "id": "pass",
   "$type": "final",
   "onEntry": [
    $log_l14_c27
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l15_c27
   ]
  }
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test419.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3Q0MTkudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUlNLGlEOzs7Ozs7QUFDQTtBQUFBLEM7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVOzs7Ozs7QUFTK0MsYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUFDMEIsYTs7Ozs7O0FBQTFCLHlEIn0=