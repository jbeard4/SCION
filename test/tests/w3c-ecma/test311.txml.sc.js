//Generated on 2017-9-20 12:40:30 by the SCION SCXML compiler
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
function $senddata_l5_c4(_event){
return {
};
};
$senddata_l5_c4.tagname='send';
$senddata_l5_c4.line=5;
$senddata_l5_c4.column=4;
function $send_l5_c4(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "timeout",
  data: $senddata_l5_c4.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs("1s"),
       });
};
$send_l5_c4.tagname='send';
$send_l5_c4.line=5;
$send_l5_c4.column=4;
function $script_l6_c4(_event){
throw new Error("Assignment to location not declared in the datamodel:foo.bar.baz ")
};
$script_l6_c4.tagname='script';
$script_l6_c4.line=6;
$script_l6_c4.column=4;
function $expr_l12_c53(_event){
return 'pass';
};
$expr_l12_c53.tagname='undefined';
$expr_l12_c53.line=12;
$expr_l12_c53.column=53;
function $log_l12_c27(_event){
this.log("Outcome",$expr_l12_c53.apply(this, arguments));
};
$log_l12_c27.tagname='log';
$log_l12_c27.line=12;
$log_l12_c27.column=27;
function $expr_l13_c53(_event){
return 'fail';
};
$expr_l13_c53.tagname='undefined';
$expr_l13_c53.line=13;
$expr_l13_c53.column=53;
function $log_l13_c27(_event){
this.log("Outcome",$expr_l13_c53.apply(this, arguments));
};
$log_l13_c27.tagname='log';
$log_l13_c27.line=13;
$log_l13_c27.column=27;
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
    $send_l5_c4,
    $script_l6_c4
   ],
   "transitions": [
    {
     "event": "error.execution",
     "target": "pass"
    },
    {
     "event": ".*",
     "target": "fail"
    }
   ]
  },
  {
   "id": "pass",
   "$type": "final",
   "onEntry": [
    $log_l12_c27
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l13_c27
   ]
  }
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test311.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QzMTEudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUtJO0FBQUEsQzs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFU7Ozs7OztBQUNBLEssQ0FBTSxHLENBQUksS0FBSyxDQUFDLG1FQUFtRSxDOzs7Ozs7QUFNbEMsYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUFDMEIsYTs7Ozs7O0FBQTFCLHlEIn0=