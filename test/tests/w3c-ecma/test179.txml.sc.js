//Generated on 2017-9-20 12:40:23 by the SCION SCXML compiler
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
function $content_l6_c12(_event){
return 123;
};
$content_l6_c12.tagname='undefined';
$content_l6_c12.line=6;
$content_l6_c12.column=12;
function $send_l5_c4(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "event1",
  data: $content_l6_c12.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs(null),
       });
};
$send_l5_c4.tagname='send';
$send_l5_c4.line=5;
$send_l5_c4.column=4;
function $cond_l10_c35(_event){
return _event.data == 123;
};
$cond_l10_c35.tagname='undefined';
$cond_l10_c35.line=10;
$cond_l10_c35.column=35;
function $expr_l14_c56(_event){
return 'pass';
};
$expr_l14_c56.tagname='undefined';
$expr_l14_c56.line=14;
$expr_l14_c56.column=56;
function $log_l14_c30(_event){
this.log("Outcome",$expr_l14_c56.apply(this, arguments));
};
$log_l14_c30.tagname='log';
$log_l14_c30.line=14;
$log_l14_c30.column=30;
function $expr_l15_c56(_event){
return 'fail';
};
$expr_l15_c56.tagname='undefined';
$expr_l15_c56.line=15;
$expr_l15_c56.column=56;
function $log_l15_c30(_event){
this.log("Outcome",$expr_l15_c56.apply(this, arguments));
};
$log_l15_c30.tagname='log';
$log_l15_c30.line=15;
$log_l15_c30.column=30;
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
    $send_l5_c4
   ],
   "transitions": [
    {
     "event": "event1",
     "cond": $cond_l10_c35,
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
    $log_l14_c30
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l15_c30
   ]
  }
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test179.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QxNzkudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU1ZLFU7Ozs7OztBQURSO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVOzs7Ozs7QUFLK0IsYUFBTSxDQUFDLEksQ0FBSyxFLENBQUcsRzs7Ozs7O0FBSU0sYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUFDMEIsYTs7Ozs7O0FBQTFCLHlEIn0=