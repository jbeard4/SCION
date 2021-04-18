//Generated on 2017-9-20 12:40:36 by the SCION SCXML compiler
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
  name: "timeout",
  data: $senddata_l7_c6.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs("1s"),
       });
};
$send_l7_c6.tagname='send';
$send_l7_c6.line=7;
$send_l7_c6.column=6;
function $raise_l14_c7(_event){
this.raise({ name:"event1", data : null});
};
$raise_l14_c7.tagname='raise';
$raise_l14_c7.line=14;
$raise_l14_c7.column=7;
function $script_l16_c5(_event){
throw new Error("Assignment to location not declared in the datamodel:foo.bar.baz ")
};
$script_l16_c5.tagname='script';
$script_l16_c5.line=16;
$script_l16_c5.column=5;
function $raise_l20_c5(_event){
this.raise({ name:"event2", data : null});
};
$raise_l20_c5.tagname='raise';
$raise_l20_c5.line=20;
$raise_l20_c5.column=5;
function $expr_l37_c53(_event){
return 'pass';
};
$expr_l37_c53.tagname='undefined';
$expr_l37_c53.line=37;
$expr_l37_c53.column=53;
function $log_l37_c27(_event){
this.log("Outcome",$expr_l37_c53.apply(this, arguments));
};
$log_l37_c27.tagname='log';
$log_l37_c27.line=37;
$log_l37_c27.column=27;
function $expr_l38_c53(_event){
return 'fail';
};
$expr_l38_c53.tagname='undefined';
$expr_l38_c53.line=38;
$expr_l38_c53.column=53;
function $log_l38_c27(_event){
this.log("Outcome",$expr_l38_c53.apply(this, arguments));
};
$log_l38_c27.tagname='log';
$log_l38_c27.line=38;
$log_l38_c27.column=27;
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
    $send_l7_c6
   ],
   "transitions": [
    {
     "event": "timeout",
     "target": "fail"
    }
   ],
   "states": [
    {
     "id": "s01",
     "$type": "state",
     "onEntry": [
      $raise_l14_c7,
      $script_l16_c5
     ],
     "transitions": [
      {
       "event": "event1",
       "target": "s02",
       "onTransition": $raise_l20_c5
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
     "transitions": [
      {
       "event": "error",
       "target": "s03"
      },
      {
       "event": "*",
       "target": "fail"
      }
     ]
    },
    {
     "id": "s03",
     "$type": "state",
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
    }
   ]
  },
  {
   "id": "pass",
   "$type": "final",
   "onEntry": [
    $log_l37_c27
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l38_c27
   ]
  }
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test402.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3Q0MDIudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU9NO0FBQUEsQzs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFU7Ozs7OztBQU9DLDBDOzs7Ozs7QUFFRixLLENBQU0sRyxDQUFJLEtBQUssQ0FBQyxtRUFBbUUsQzs7Ozs7O0FBSW5GLDBDOzs7Ozs7QUFpQmdELGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBQzBCLGE7Ozs7OztBQUExQix5RCJ9