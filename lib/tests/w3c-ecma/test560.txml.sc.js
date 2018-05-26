//Generated on 2017-9-20 12:41:31 by the SCION SCXML compiler
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
function $expr_l7_c31(_event){
return 1;
};
$expr_l7_c31.tagname='undefined';
$expr_l7_c31.line=7;
$expr_l7_c31.column=31;
function $senddata_l6_c5(_event){
return {
"aParam":$expr_l7_c31.apply(this, arguments)};
};
$senddata_l6_c5.tagname='send';
$senddata_l6_c5.line=6;
$senddata_l6_c5.column=5;
function $send_l6_c5(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "foo",
  data: $senddata_l6_c5.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs(null),
       });
};
$send_l6_c5.tagname='send';
$send_l6_c5.line=6;
$send_l6_c5.column=5;
function $cond_l10_c32(_event){
return _event.data.aParam == 1;
};
$cond_l10_c32.tagname='undefined';
$cond_l10_c32.line=10;
$cond_l10_c32.column=32;
function $expr_l15_c53(_event){
return 'pass';
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
function $expr_l16_c53(_event){
return 'fail';
};
$expr_l16_c53.tagname='undefined';
$expr_l16_c53.line=16;
$expr_l16_c53.column=53;
function $log_l16_c27(_event){
this.log("Outcome",$expr_l16_c53.apply(this, arguments));
};
$log_l16_c27.tagname='log';
$log_l16_c27.line=16;
$log_l16_c27.column=27;
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
    $send_l6_c5
   ],
   "transitions": [
    {
     "event": "foo",
     "cond": $cond_l10_c32,
     "target": "pass"
    },
    {
     "event": "*",
     "target": "fail"
    }
   ]
  },
  {
   "id": "pass",
   "$type": "final",
   "onEntry": [
    $log_l15_c27
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l16_c27
   ]
  }
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test560.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3Q1NjAudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU8rQixROzs7Ozs7QUFEMUI7QUFBQSw2Qzs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFU7Ozs7OztBQUkyQixhQUFNLENBQUMsSUFBSSxDQUFDLE0sQ0FBTyxFLENBQUcsQzs7Ozs7O0FBS0QsYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUFDMEIsYTs7Ozs7O0FBQTFCLHlEIn0=