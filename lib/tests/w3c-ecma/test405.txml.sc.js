//Generated on 2017-9-20 12:40:08 by the SCION SCXML compiler
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
function $senddata_l6_c3(_event){
return {
};
};
$senddata_l6_c3.tagname='send';
$senddata_l6_c3.line=6;
$senddata_l6_c3.column=3;
function $send_l6_c3(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "timeout",
  data: $senddata_l6_c3.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs("1s"),
       });
};
$send_l6_c3.tagname='send';
$send_l6_c3.line=6;
$send_l6_c3.column=3;
function $raise_l18_c8(_event){
this.raise({ name:"event2", data : null});
};
$raise_l18_c8.tagname='raise';
$raise_l18_c8.line=18;
$raise_l18_c8.column=8;
function $raise_l22_c9(_event){
this.raise({ name:"event3", data : null});
};
$raise_l22_c9.tagname='raise';
$raise_l22_c9.line=22;
$raise_l22_c9.column=9;
function $raise_l32_c8(_event){
this.raise({ name:"event1", data : null});
};
$raise_l32_c8.tagname='raise';
$raise_l32_c8.line=32;
$raise_l32_c8.column=8;
function $raise_l36_c9(_event){
this.raise({ name:"event4", data : null});
};
$raise_l36_c9.tagname='raise';
$raise_l36_c9.line=36;
$raise_l36_c9.column=9;
function $expr_l64_c53(_event){
return 'pass';
};
$expr_l64_c53.tagname='undefined';
$expr_l64_c53.line=64;
$expr_l64_c53.column=53;
function $log_l64_c27(_event){
this.log("Outcome",$expr_l64_c53.apply(this, arguments));
};
$log_l64_c27.tagname='log';
$log_l64_c27.line=64;
$log_l64_c27.column=27;
function $expr_l65_c53(_event){
return 'fail';
};
$expr_l65_c53.tagname='undefined';
$expr_l65_c53.line=65;
$expr_l65_c53.column=53;
function $log_l65_c27(_event){
this.log("Outcome",$expr_l65_c53.apply(this, arguments));
};
$log_l65_c27.tagname='log';
$log_l65_c27.line=65;
$log_l65_c27.column=27;
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "{http://www.w3.org/2000/xmlns/}conf": "http://www.w3.org/2005/scxml-conformance",
 "initial": "s0",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "s0",
   "initial": "s01p",
   "$type": "state",
   "onEntry": [
    $send_l6_c3
   ],
   "transitions": [
    {
     "event": "timeout",
     "target": "fail"
    }
   ],
   "states": [
    {
     "id": "s01p",
     "$type": "parallel",
     "transitions": [
      {
       "event": "event1",
       "target": "s02"
      }
     ],
     "states": [
      {
       "id": "s01p1",
       "initial": "s01p11",
       "$type": "state",
       "states": [
        {
         "id": "s01p11",
         "$type": "state",
         "onExit": [
          $raise_l18_c8
         ],
         "transitions": [
          {
           "target": "s01p12",
           "onTransition": $raise_l22_c9
          }
         ]
        },
        {
         "id": "s01p12",
         "$type": "state"
        }
       ]
      },
      {
       "id": "s01p2",
       "initial": "s01p21",
       "$type": "state",
       "states": [
        {
         "id": "s01p21",
         "$type": "state",
         "onExit": [
          $raise_l32_c8
         ],
         "transitions": [
          {
           "target": "s01p22",
           "onTransition": $raise_l36_c9
          }
         ]
        },
        {
         "id": "s01p22",
         "$type": "state"
        }
       ]
      }
     ]
    },
    {
     "id": "s02",
     "$type": "state",
     "transitions": [
      {
       "event": "event2",
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
       "event": "event3",
       "target": "s04"
      },
      {
       "event": "*",
       "target": "fail"
      }
     ]
    },
    {
     "id": "s04",
     "$type": "state",
     "transitions": [
      {
       "event": "event4",
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
    $log_l64_c27
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l65_c27
   ]
  }
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test405.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3Q0MDUudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU1HO0FBQUEsQzs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFU7Ozs7OztBQVlLLDBDOzs7Ozs7QUFJQywwQzs7Ozs7O0FBVUQsMEM7Ozs7OztBQUlDLDBDOzs7Ozs7QUE0QjRDLGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBQzBCLGE7Ozs7OztBQUExQix5RCJ9