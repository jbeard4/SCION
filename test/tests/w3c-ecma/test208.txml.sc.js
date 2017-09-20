//Generated on 2017-9-20 12:39:59 by the SCION SCXML compiler
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
function $senddata_l6_c4(_event){
return {
};
};
$senddata_l6_c4.tagname='send';
$senddata_l6_c4.line=6;
$senddata_l6_c4.column=4;
function $delayexpr_l6_c44(_event){
return '1s';
};
$delayexpr_l6_c44.tagname='undefined';
$delayexpr_l6_c44.line=6;
$delayexpr_l6_c44.column=44;
function $send_l6_c4(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "event1",
  data: $senddata_l6_c4.apply(this, arguments),
  sendid: "foo",
  origin: _sessionid
}, 
       {
           delay: getDelayInMs($delayexpr_l6_c44.apply(this, arguments)),
       });
};
$send_l6_c4.tagname='send';
$send_l6_c4.line=6;
$send_l6_c4.column=4;
function $senddata_l7_c4(_event){
return {
};
};
$senddata_l7_c4.tagname='send';
$senddata_l7_c4.line=7;
$senddata_l7_c4.column=4;
function $delayexpr_l7_c35(_event){
return '1.5s';
};
$delayexpr_l7_c35.tagname='undefined';
$delayexpr_l7_c35.line=7;
$delayexpr_l7_c35.column=35;
function $send_l7_c4(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "event2",
  data: $senddata_l7_c4.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs($delayexpr_l7_c35.apply(this, arguments)),
       });
};
$send_l7_c4.tagname='send';
$send_l7_c4.line=7;
$send_l7_c4.column=4;
function $cancel_l8_c4(_event){
this.cancel("foo");
};
$cancel_l8_c4.tagname='cancel';
$cancel_l8_c4.line=8;
$cancel_l8_c4.column=4;
function $expr_l17_c53(_event){
return 'pass';
};
$expr_l17_c53.tagname='undefined';
$expr_l17_c53.line=17;
$expr_l17_c53.column=53;
function $log_l17_c27(_event){
this.log("Outcome",$expr_l17_c53.apply(this, arguments));
};
$log_l17_c27.tagname='log';
$log_l17_c27.line=17;
$log_l17_c27.column=27;
function $expr_l18_c53(_event){
return 'fail';
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
    $send_l6_c4,
    $send_l7_c4,
    $cancel_l8_c4
   ],
   "transitions": [
    {
     "event": "event2",
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
    $log_l17_c27
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l18_c27
   ]
  }
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test208.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QyMDgudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU1JO0FBQUEsQzs7Ozs7O0FBQXdDLFc7Ozs7OztBQUF4QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVTs7Ozs7O0FBQ0E7QUFBQSxDOzs7Ozs7QUFBK0IsYTs7Ozs7O0FBQS9CO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVOzs7Ozs7QUFDQSxtQjs7Ozs7O0FBU2lELGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBQzBCLGE7Ozs7OztBQUExQix5RCJ9