//Generated on 2017-9-20 12:40:40 by the SCION SCXML compiler
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
function $raise_l19_c10(_event){
this.raise({ name:"enteringS011", data : null});
};
$raise_l19_c10.tagname='raise';
$raise_l19_c10.line=19;
$raise_l19_c10.column=10;
function $raise_l24_c8(_event){
this.raise({ name:"enteringS012", data : null});
};
$raise_l24_c8.tagname='raise';
$raise_l24_c8.line=24;
$raise_l24_c8.column=8;
function $raise_l31_c10(_event){
this.raise({ name:"enteringS021", data : null});
};
$raise_l31_c10.tagname='raise';
$raise_l31_c10.line=31;
$raise_l31_c10.column=10;
function $raise_l36_c8(_event){
this.raise({ name:"enteringS022", data : null});
};
$raise_l36_c8.tagname='raise';
$raise_l36_c8.line=36;
$raise_l36_c8.column=8;
function $raise_l57_c10(_event){
this.raise({ name:"enteringS111", data : null});
};
$raise_l57_c10.tagname='raise';
$raise_l57_c10.line=57;
$raise_l57_c10.column=10;
function $raise_l62_c8(_event){
this.raise({ name:"enteringS112", data : null});
};
$raise_l62_c8.tagname='raise';
$raise_l62_c8.line=62;
$raise_l62_c8.column=8;
function $raise_l69_c10(_event){
this.raise({ name:"enteringS121", data : null});
};
$raise_l69_c10.tagname='raise';
$raise_l69_c10.line=69;
$raise_l69_c10.column=10;
function $raise_l74_c8(_event){
this.raise({ name:"enteringS122", data : null});
};
$raise_l74_c8.tagname='raise';
$raise_l74_c8.line=74;
$raise_l74_c8.column=8;
function $senddata_l84_c5(_event){
return {
};
};
$senddata_l84_c5.tagname='send';
$senddata_l84_c5.line=84;
$senddata_l84_c5.column=5;
function $send_l84_c5(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "timeout",
  data: $senddata_l84_c5.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs("1s"),
       });
};
$send_l84_c5.tagname='send';
$send_l84_c5.line=84;
$send_l84_c5.column=5;
function $expr_l93_c53(_event){
return 'pass';
};
$expr_l93_c53.tagname='undefined';
$expr_l93_c53.line=93;
$expr_l93_c53.column=53;
function $log_l93_c27(_event){
this.log("Outcome",$expr_l93_c53.apply(this, arguments));
};
$log_l93_c27.tagname='log';
$log_l93_c27.line=93;
$log_l93_c27.column=27;
function $expr_l94_c53(_event){
return 'fail';
};
$expr_l94_c53.tagname='undefined';
$expr_l94_c53.line=94;
$expr_l94_c53.column=53;
function $log_l94_c27(_event){
this.log("Outcome",$expr_l94_c53.apply(this, arguments));
};
$log_l94_c27.tagname='log';
$log_l94_c27.line=94;
$log_l94_c27.column=27;
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "{http://www.w3.org/2000/xmlns/}conf": "http://www.w3.org/2005/scxml-conformance",
 "initial": "s3",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "s0",
   "initial": "s01",
   "$type": "state",
   "transitions": [
    {
     "event": "enteringS011",
     "target": "s4"
    },
    {
     "event": "*",
     "target": "fail"
    }
   ],
   "states": [
    {
     "type": "shallow",
     "id": "s0HistShallow",
     "isDeep": false,
     "$type": "history",
     "transitions": [
      {
       "target": "s01"
      }
     ]
    },
    {
     "type": "deep",
     "id": "s0HistDeep",
     "isDeep": true,
     "$type": "history",
     "transitions": [
      {
       "target": "s022"
      }
     ]
    },
    {
     "id": "s01",
     "initial": "s011",
     "$type": "state",
     "states": [
      {
       "id": "s011",
       "$type": "state",
       "onEntry": [
        $raise_l19_c10
       ]
      },
      {
       "id": "s012",
       "$type": "state",
       "onEntry": [
        $raise_l24_c8
       ]
      }
     ]
    },
    {
     "id": "s02",
     "initial": "s021",
     "$type": "state",
     "states": [
      {
       "id": "s021",
       "$type": "state",
       "onEntry": [
        $raise_l31_c10
       ]
      },
      {
       "id": "s022",
       "$type": "state",
       "onEntry": [
        $raise_l36_c8
       ]
      }
     ]
    }
   ]
  },
  {
   "id": "s1",
   "initial": "s11",
   "$type": "state",
   "transitions": [
    {
     "event": "enteringS122",
     "target": "pass"
    },
    {
     "event": "*",
     "target": "fail"
    }
   ],
   "states": [
    {
     "type": "shallow",
     "id": "s1HistShallow",
     "isDeep": false,
     "$type": "history",
     "transitions": [
      {
       "target": "s11"
      }
     ]
    },
    {
     "type": "deep",
     "id": "s1HistDeep",
     "isDeep": true,
     "$type": "history",
     "transitions": [
      {
       "target": "s122"
      }
     ]
    },
    {
     "id": "s11",
     "initial": "s111",
     "$type": "state",
     "states": [
      {
       "id": "s111",
       "$type": "state",
       "onEntry": [
        $raise_l57_c10
       ]
      },
      {
       "id": "s112",
       "$type": "state",
       "onEntry": [
        $raise_l62_c8
       ]
      }
     ]
    },
    {
     "id": "s12",
     "initial": "s121",
     "$type": "state",
     "states": [
      {
       "id": "s121",
       "$type": "state",
       "onEntry": [
        $raise_l69_c10
       ]
      },
      {
       "id": "s122",
       "$type": "state",
       "onEntry": [
        $raise_l74_c8
       ]
      }
     ]
    }
   ]
  },
  {
   "id": "s3",
   "$type": "state",
   "onEntry": [
    $send_l84_c5
   ],
   "transitions": [
    {
     "target": "s0HistShallow"
    }
   ]
  },
  {
   "id": "s4",
   "$type": "state",
   "transitions": [
    {
     "target": "s1HistDeep"
    }
   ]
  },
  {
   "id": "pass",
   "$type": "final",
   "onEntry": [
    $log_l93_c27
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l94_c27
   ]
  }
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test387.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QzODcudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1CVSxnRDs7Ozs7O0FBS0YsZ0Q7Ozs7OztBQU9FLGdEOzs7Ozs7QUFLRixnRDs7Ozs7O0FBcUJFLGdEOzs7Ozs7QUFLRixnRDs7Ozs7O0FBT0UsZ0Q7Ozs7OztBQUtGLGdEOzs7Ozs7QUFVSDtBQUFBLEM7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVOzs7Ozs7QUFTZ0QsYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUFDMEIsYTs7Ozs7O0FBQTFCLHlEIn0=