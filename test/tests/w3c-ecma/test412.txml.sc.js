//Generated on 2017-9-20 12:40:53 by the SCION SCXML compiler
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
function $senddata_l6_c5(_event){
return {
};
};
$senddata_l6_c5.tagname='send';
$senddata_l6_c5.line=6;
$senddata_l6_c5.column=5;
function $send_l6_c5(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "timeout",
  data: $senddata_l6_c5.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs("1s"),
       });
};
$send_l6_c5.tagname='send';
$send_l6_c5.line=6;
$send_l6_c5.column=5;
function $raise_l15_c7(_event){
this.raise({ name:"event1", data : null});
};
$raise_l15_c7.tagname='raise';
$raise_l15_c7.line=15;
$raise_l15_c7.column=7;
function $raise_l19_c10(_event){
this.raise({ name:"event2", data : null});
};
$raise_l19_c10.tagname='raise';
$raise_l19_c10.line=19;
$raise_l19_c10.column=10;
function $raise_l25_c8(_event){
this.raise({ name:"event3", data : null});
};
$raise_l25_c8.tagname='raise';
$raise_l25_c8.line=25;
$raise_l25_c8.column=8;
function $expr_l48_c53(_event){
return 'pass';
};
$expr_l48_c53.tagname='undefined';
$expr_l48_c53.line=48;
$expr_l48_c53.column=53;
function $log_l48_c27(_event){
this.log("Outcome",$expr_l48_c53.apply(this, arguments));
};
$log_l48_c27.tagname='log';
$log_l48_c27.line=48;
$log_l48_c27.column=27;
function $expr_l49_c53(_event){
return 'fail';
};
$expr_l49_c53.tagname='undefined';
$expr_l49_c53.line=49;
$expr_l49_c53.column=53;
function $log_l49_c27(_event){
this.log("Outcome",$expr_l49_c53.apply(this, arguments));
};
$log_l49_c27.tagname='log';
$log_l49_c27.line=49;
$log_l49_c27.column=27;
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
    $send_l6_c5
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
      $raise_l15_c7
     ],
     "states": [
      {
       "$type": "initial",
       "id": "$generated-initial-0",
       "transitions": [
        {
         "target": "s011",
         "onTransition": $raise_l19_c10
        }
       ]
      },
      {
       "id": "s011",
       "$type": "state",
       "onEntry": [
        $raise_l25_c8
       ],
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
     "$type": "state",
     "transitions": [
      {
       "event": "event1",
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
       "event": "event3",
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
    $log_l48_c27
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l49_c27
   ]
  }
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test412.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3Q0MTIudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU1LO0FBQUEsQzs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFU7Ozs7OztBQVNFLDBDOzs7Ozs7QUFJRywwQzs7Ozs7O0FBTUYsMEM7Ozs7OztBQXVCNkMsYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUFDMEIsYTs7Ozs7O0FBQTFCLHlEIn0=