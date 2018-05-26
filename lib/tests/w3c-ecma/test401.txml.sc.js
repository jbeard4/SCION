//Generated on 2017-9-20 12:40:06 by the SCION SCXML compiler
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
function $senddata_l7_c6(_event){
return {
};
};
$senddata_l7_c6.tagname='send';
$senddata_l7_c6.line=7;
$senddata_l7_c6.column=6;
function $send_l7_c6(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "foo",
  data: $senddata_l7_c6.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs(null),
       });
};
$send_l7_c6.tagname='send';
$send_l7_c6.line=7;
$send_l7_c6.column=6;
function $script_l9_c5(_event){
throw new Error("Assignment to location not declared in the datamodel:foo.bar.baz ")
};
$script_l9_c5.tagname='script';
$script_l9_c5.line=9;
$script_l9_c5.column=5;
function $expr_l18_c53(_event){
return 'pass';
};
$expr_l18_c53.tagname='undefined';
$expr_l18_c53.line=18;
$expr_l18_c53.column=53;
function $log_l18_c27(_event){
this.log("Outcome",$expr_l18_c53.apply(this, arguments));
};
$log_l18_c27.tagname='log';
$log_l18_c27.line=18;
$log_l18_c27.column=27;
function $expr_l19_c53(_event){
return 'fail';
};
$expr_l19_c53.tagname='undefined';
$expr_l19_c53.line=19;
$expr_l19_c53.column=53;
function $log_l19_c27(_event){
this.log("Outcome",$expr_l19_c53.apply(this, arguments));
};
$log_l19_c27.tagname='log';
$log_l19_c27.line=19;
$log_l19_c27.column=27;
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
    $send_l7_c6,
    $script_l9_c5
   ],
   "transitions": [
    {
     "event": "foo",
     "target": "fail"
    },
    {
     "event": "error",
     "target": "pass"
    }
   ]
  },
  {
   "id": "pass",
   "$type": "final",
   "onEntry": [
    $log_l18_c27
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l19_c27
   ]
  }
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test401.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3Q0MDEudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU9NO0FBQUEsQzs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFU7Ozs7OztBQUVELEssQ0FBTSxHLENBQUksS0FBSyxDQUFDLG1FQUFtRSxDOzs7Ozs7QUFTbkMsYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUFDMEIsYTs7Ozs7O0FBQTFCLHlEIn0=