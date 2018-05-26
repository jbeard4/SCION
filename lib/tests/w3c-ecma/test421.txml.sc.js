//Generated on 2017-9-20 12:40:02 by the SCION SCXML compiler
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
function $senddata_l5_c7(_event){
return {
};
};
$senddata_l5_c7.tagname='send';
$senddata_l5_c7.line=5;
$senddata_l5_c7.column=7;
function $send_l5_c7(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "externalEvent",
  data: $senddata_l5_c7.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs(null),
       });
};
$send_l5_c7.tagname='send';
$send_l5_c7.line=5;
$send_l5_c7.column=7;
function $raise_l6_c6(_event){
this.raise({ name:"internalEvent1", data : null});
};
$raise_l6_c6.tagname='raise';
$raise_l6_c6.line=6;
$raise_l6_c6.column=6;
function $raise_l7_c6(_event){
this.raise({ name:"internalEvent2", data : null});
};
$raise_l7_c6.tagname='raise';
$raise_l7_c6.line=7;
$raise_l7_c6.column=6;
function $raise_l8_c6(_event){
this.raise({ name:"internalEvent3", data : null});
};
$raise_l8_c6.tagname='raise';
$raise_l8_c6.line=8;
$raise_l8_c6.column=6;
function $raise_l9_c6(_event){
this.raise({ name:"internalEvent4", data : null});
};
$raise_l9_c6.tagname='raise';
$raise_l9_c6.line=9;
$raise_l9_c6.column=6;
function $expr_l25_c53(_event){
return 'pass';
};
$expr_l25_c53.tagname='undefined';
$expr_l25_c53.line=25;
$expr_l25_c53.column=53;
function $log_l25_c27(_event){
this.log("Outcome",$expr_l25_c53.apply(this, arguments));
};
$log_l25_c27.tagname='log';
$log_l25_c27.line=25;
$log_l25_c27.column=27;
function $expr_l26_c53(_event){
return 'fail';
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
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "{http://www.w3.org/2000/xmlns/}conf": "http://www.w3.org/2005/scxml-conformance",
 "initial": "s1",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "s1",
   "initial": "s11",
   "$type": "state",
   "onEntry": [
    $send_l5_c7,
    $raise_l6_c6,
    $raise_l7_c6,
    $raise_l8_c6,
    $raise_l9_c6
   ],
   "transitions": [
    {
     "event": "externalEvent",
     "target": "fail"
    }
   ],
   "states": [
    {
     "id": "s11",
     "$type": "state",
     "transitions": [
      {
       "event": "internalEvent3",
       "target": "s12"
      }
     ]
    },
    {
     "id": "s12",
     "$type": "state",
     "transitions": [
      {
       "event": "internalEvent4",
       "target": "pass"
      }
     ]
    }
   ]
  },
  {
   "id": "pass",
   "$type": "final",
   "onEntry": [
    $log_l25_c27
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l26_c27
   ]
  }
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test421.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3Q0MjEudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUtPO0FBQUEsQzs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFU7Ozs7OztBQUNELGtEOzs7Ozs7QUFDQSxrRDs7Ozs7O0FBQ0Esa0Q7Ozs7OztBQUNBLGtEOzs7Ozs7QUFnQitDLGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBQzBCLGE7Ozs7OztBQUExQix5RCJ9