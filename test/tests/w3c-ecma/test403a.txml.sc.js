//Generated on 2017-9-20 12:40:46 by the SCION SCXML compiler
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
function $senddata_l12_c6(_event){
return {
};
};
$senddata_l12_c6.tagname='send';
$senddata_l12_c6.line=12;
$senddata_l12_c6.column=6;
function $send_l12_c6(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "timeout",
  data: $senddata_l12_c6.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs("1s"),
       });
};
$send_l12_c6.tagname='send';
$send_l12_c6.line=12;
$send_l12_c6.column=6;
function $raise_l21_c7(_event){
this.raise({ name:"event1", data : null});
};
$raise_l21_c7.tagname='raise';
$raise_l21_c7.line=21;
$raise_l21_c7.column=7;
function $raise_l32_c5(_event){
this.raise({ name:"event2", data : null});
};
$raise_l32_c5.tagname='raise';
$raise_l32_c5.line=32;
$raise_l32_c5.column=5;
function $cond_l35_c35(_event){
return false;
};
$cond_l35_c35.tagname='undefined';
$cond_l35_c35.line=35;
$cond_l35_c35.column=35;
function $expr_l40_c53(_event){
return 'pass';
};
$expr_l40_c53.tagname='undefined';
$expr_l40_c53.line=40;
$expr_l40_c53.column=53;
function $log_l40_c27(_event){
this.log("Outcome",$expr_l40_c53.apply(this, arguments));
};
$log_l40_c27.tagname='log';
$log_l40_c27.line=40;
$log_l40_c27.column=27;
function $expr_l41_c53(_event){
return 'fail';
};
$expr_l41_c53.tagname='undefined';
$expr_l41_c53.line=41;
$expr_l41_c53.column=53;
function $log_l41_c27(_event){
this.log("Outcome",$expr_l41_c53.apply(this, arguments));
};
$log_l41_c27.tagname='log';
$log_l41_c27.line=41;
$log_l41_c27.column=27;
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
    $send_l12_c6
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
      $raise_l21_c7
     ],
     "transitions": [
      {
       "event": "event1",
       "target": "s02"
      },
      {
       "event": "*",
       "target": "fail"
      }
     ]
    },
    {
     "id": "s02",
     "$type": "state",
     "onEntry": [
      $raise_l32_c5
     ],
     "transitions": [
      {
       "event": "event1",
       "target": "fail"
      },
      {
       "event": "event2",
       "cond": $cond_l35_c35,
       "target": "fail"
      }
     ]
    }
   ]
  },
  {
   "id": "pass",
   "$type": "final",
   "onEntry": [
    $log_l40_c27
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l41_c27
   ]
  }
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test403a.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3Q0MDNhLnR4bWwuc2N4bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFZTTtBQUFBLEM7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVOzs7Ozs7QUFTQywwQzs7Ozs7O0FBV0YsMEM7Ozs7OztBQUc4QixZOzs7Ozs7QUFLa0IsYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUFDMEIsYTs7Ozs7O0FBQTFCLHlEIn0=