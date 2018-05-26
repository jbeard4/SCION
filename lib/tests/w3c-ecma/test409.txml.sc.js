//Generated on 2017-9-20 12:40:26 by the SCION SCXML compiler
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
function $senddata_l7_c5(_event){
return {
};
};
$senddata_l7_c5.tagname='send';
$senddata_l7_c5.line=7;
$senddata_l7_c5.column=5;
function $delayexpr_l7_c37(_event){
return '1s';
};
$delayexpr_l7_c37.tagname='undefined';
$delayexpr_l7_c37.line=7;
$delayexpr_l7_c37.column=37;
function $send_l7_c5(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "timeout",
  data: $senddata_l7_c5.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs($delayexpr_l7_c37.apply(this, arguments)),
       });
};
$send_l7_c5.tagname='send';
$send_l7_c5.line=7;
$send_l7_c5.column=5;
function $cond_l15_c15(_event){
return In('s011');
};
$cond_l15_c15.tagname='undefined';
$cond_l15_c15.line=15;
$cond_l15_c15.column=15;
function $raise_l16_c8(_event){
this.raise({ name:"event1", data : null});
};
$raise_l16_c8.tagname='raise';
$raise_l16_c8.line=16;
$raise_l16_c8.column=8;
function $if_l15_c6(_event){
if($cond_l15_c15.apply(this, arguments)){
    $raise_l16_c8.apply(this, arguments);
}
};
$if_l15_c6.tagname='if';
$if_l15_c6.line=15;
$if_l15_c6.column=6;
function $expr_l29_c53(_event){
return 'pass';
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
function $expr_l30_c53(_event){
return 'fail';
};
$expr_l30_c53.tagname='undefined';
$expr_l30_c53.line=30;
$expr_l30_c53.column=53;
function $log_l30_c27(_event){
this.log("Outcome",$expr_l30_c53.apply(this, arguments));
};
$log_l30_c27.tagname='log';
$log_l30_c27.line=30;
$log_l30_c27.column=27;
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
    $send_l7_c5
   ],
   "transitions": [
    {
     "event": "timeout",
     "target": "pass"
    },
    {
     "event": "event1",
     "target": "fail"
    }
   ],
   "states": [
    {
     "id": "s01",
     "initial": "s011",
     "$type": "state",
     "onExit": [
      $if_l15_c6
     ],
     "states": [
      {
       "id": "s011",
       "$type": "state",
       "transitions": [
        {
         "target": "s02"
        }
       ]
      }
     ]
    },
    {
     "id": "s02",
     "$type": "state"
    }
   ]
  },
  {
   "id": "pass",
   "$type": "final",
   "onEntry": [
    $log_l29_c27
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l30_c27
   ]
  }
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test409.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3Q0MDkudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU9LO0FBQUEsQzs7Ozs7O0FBQWdDLFc7Ozs7OztBQUFoQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVTs7Ozs7O0FBUVUsU0FBRSxDQUFDLE1BQU0sQzs7Ozs7O0FBQ2hCLDBDOzs7Ozs7QUFERjtBQUFBO0FBQUEsQzs7Ozs7O0FBYytDLGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBQzBCLGE7Ozs7OztBQUExQix5RCJ9