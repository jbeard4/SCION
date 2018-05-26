//Generated on 2017-9-20 12:40:29 by the SCION SCXML compiler
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
function $raise_l13_c6(_event){
this.raise({ name:"event1", data : null});
};
$raise_l13_c6.tagname='raise';
$raise_l13_c6.line=13;
$raise_l13_c6.column=6;
function $raise_l37_c5(_event){
this.raise({ name:"event2", data : null});
};
$raise_l37_c5.tagname='raise';
$raise_l37_c5.line=37;
$raise_l37_c5.column=5;
function $raise_l24_c6(_event){
this.raise({ name:"event3", data : null});
};
$raise_l24_c6.tagname='raise';
$raise_l24_c6.line=24;
$raise_l24_c6.column=6;
function $raise_l31_c4(_event){
this.raise({ name:"event4", data : null});
};
$raise_l31_c4.tagname='raise';
$raise_l31_c4.line=31;
$raise_l31_c4.column=4;
function $expr_l61_c53(_event){
return 'pass';
};
$expr_l61_c53.tagname='undefined';
$expr_l61_c53.line=61;
$expr_l61_c53.column=53;
function $log_l61_c27(_event){
this.log("Outcome",$expr_l61_c53.apply(this, arguments));
};
$log_l61_c27.tagname='log';
$log_l61_c27.line=61;
$log_l61_c27.column=27;
function $expr_l62_c53(_event){
return 'fail';
};
$expr_l62_c53.tagname='undefined';
$expr_l62_c53.line=62;
$expr_l62_c53.column=53;
function $log_l62_c27(_event){
this.log("Outcome",$expr_l62_c53.apply(this, arguments));
};
$log_l62_c27.tagname='log';
$log_l62_c27.line=62;
$log_l62_c27.column=27;
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
     "id": "s01",
     "$type": "state",
     "transitions": [
      {
       "target": "s0p2",
       "onTransition": $raise_l13_c6
      }
     ]
    },
    {
     "id": "s0p2",
     "$type": "parallel",
     "transitions": [
      {
       "event": "event1",
       "target": "s03"
      }
     ],
     "states": [
      {
       "id": "s01p21",
       "$type": "state",
       "onEntry": [
        $raise_l24_c6
       ]
      },
      {
       "id": "s01p22",
       "$type": "state",
       "onEntry": [
        $raise_l31_c4
       ]
      }
     ],
     "onEntry": [
      $raise_l37_c5
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
       "target": "s05"
      },
      {
       "event": "*",
       "target": "fail"
      }
     ]
    },
    {
     "id": "s05",
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
    $log_l61_c27
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l62_c27
   ]
  }
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test406.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3Q0MDYudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU1HO0FBQUEsQzs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFU7Ozs7OztBQU9HLDBDOzs7Ozs7QUF3QkQsMEM7Ozs7OztBQWJDLDBDOzs7Ozs7QUFPRiwwQzs7Ozs7O0FBOEJpRCxhOzs7Ozs7QUFBMUIseUQ7Ozs7OztBQUMwQixhOzs7Ozs7QUFBMUIseUQifQ==