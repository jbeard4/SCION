//Generated on 2017-9-20 12:40:18 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
var Var1;
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
  Var1 = $serializedDatamodel["Var1"];
}
function $serializeDatamodel(){
   return {
  "Var1" : Var1
   };
}
function $expr_l20_c36(_event){
return Var1 + 1;
};
$expr_l20_c36.tagname='undefined';
$expr_l20_c36.line=20;
$expr_l20_c36.column=36;
function $assign_l20_c7(_event){
Var1 = $expr_l20_c36.apply(this, arguments);
};
$assign_l20_c7.tagname='assign';
$assign_l20_c7.line=20;
$assign_l20_c7.column=7;
function $senddata_l16_c7(_event){
return {
};
};
$senddata_l16_c7.tagname='send';
$senddata_l16_c7.line=16;
$senddata_l16_c7.column=7;
function $delayexpr_l16_c23(_event){
return '1s';
};
$delayexpr_l16_c23.tagname='undefined';
$delayexpr_l16_c23.line=16;
$delayexpr_l16_c23.column=23;
function $send_l16_c7(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "timeout",
  data: $senddata_l16_c7.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs($delayexpr_l16_c23.apply(this, arguments)),
       });
};
$send_l16_c7.tagname='send';
$send_l16_c7.line=16;
$send_l16_c7.column=7;
function $raise_l17_c7(_event){
this.raise({ name:"event1", data : null});
};
$raise_l17_c7.tagname='raise';
$raise_l17_c7.line=17;
$raise_l17_c7.column=7;
function $raise_l12_c9(_event){
this.raise({ name:"event2", data : null});
};
$raise_l12_c9.tagname='raise';
$raise_l12_c9.line=12;
$raise_l12_c9.column=9;
function $raise_l24_c9(_event){
this.raise({ name:"event3", data : null});
};
$raise_l24_c9.tagname='raise';
$raise_l24_c9.line=24;
$raise_l24_c9.column=9;
function $cond_l36_c24(_event){
return Var1==0;
};
$cond_l36_c24.tagname='undefined';
$cond_l36_c24.line=36;
$cond_l36_c24.column=24;
function $cond_l37_c24(_event){
return Var1==1;
};
$cond_l37_c24.tagname='undefined';
$cond_l37_c24.line=37;
$cond_l37_c24.column=24;
function $expr_l51_c33(_event){
return 'pass';
};
$expr_l51_c33.tagname='undefined';
$expr_l51_c33.line=51;
$expr_l51_c33.column=33;
function $log_l51_c7(_event){
this.log("Outcome",$expr_l51_c33.apply(this, arguments));
};
$log_l51_c7.tagname='log';
$log_l51_c7.line=51;
$log_l51_c7.column=7;
function $expr_l56_c33(_event){
return 'fail';
};
$expr_l56_c33.tagname='undefined';
$expr_l56_c33.line=56;
$expr_l56_c33.column=33;
function $log_l56_c7(_event){
this.log("Outcome",$expr_l56_c33.apply(this, arguments));
};
$log_l56_c7.tagname='log';
$log_l56_c7.line=56;
$log_l56_c7.column=7;
function $data_l8_c28(_event){
return 0;
};
$data_l8_c28.tagname='undefined';
$data_l8_c28.line=8;
$data_l8_c28.column=28;
function $datamodel_l7_c5(_event){
if(typeof Var1 === "undefined")  Var1 = $data_l8_c28.apply(this, arguments);
};
$datamodel_l7_c5.tagname='datamodel';
$datamodel_l7_c5.line=7;
$datamodel_l7_c5.column=5;
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
   "states": [
    {
     "$type": "initial",
     "id": "$generated-initial-0",
     "transitions": [
      {
       "target": "sh1",
       "onTransition": $raise_l12_c9
      }
     ]
    },
    {
     "id": "sh1",
     "$type": "history",
     "transitions": [
      {
       "target": "s01",
       "onTransition": $raise_l24_c9
      }
     ]
    },
    {
     "id": "s01",
     "$type": "state",
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
       "cond": $cond_l36_c24,
       "event": "event3",
       "target": "s0"
      },
      {
       "cond": $cond_l37_c24,
       "event": "event1",
       "target": "s2"
      },
      {
       "event": "*",
       "target": "fail"
      }
     ]
    }
   ],
   "onEntry": [
    $send_l16_c7,
    $raise_l17_c7
   ],
   "onExit": [
    $assign_l20_c7
   ]
  },
  {
   "id": "s2",
   "$type": "state",
   "transitions": [
    {
     "event": "event2",
     "target": "s3"
    },
    {
     "event": "*",
     "target": "fail"
    }
   ]
  },
  {
   "id": "s3",
   "$type": "state",
   "transitions": [
    {
     "event": "event3",
     "target": "fail"
    },
    {
     "event": "timeout",
     "target": "pass"
    }
   ]
  },
  {
   "id": "pass",
   "$type": "final",
   "onEntry": [
    $log_l51_c7
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l56_c7
   ]
  }
 ],
 "onEntry": [
  $datamodel_l7_c5
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test579.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3Q1NzkudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQm9DLFcsQ0FBSyxDLENBQUUsQzs7Ozs7O0FBQXBDLDRDOzs7Ozs7QUFKQTtBQUFBLEM7Ozs7OztBQUFnQixXOzs7Ozs7QUFBaEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFU7Ozs7OztBQUNBLDBDOzs7Ozs7QUFMRSwwQzs7Ozs7O0FBWUEsMEM7Ozs7OztBQVllLFdBQUksRUFBRSxDOzs7Ozs7QUFDTixXQUFJLEVBQUUsQzs7Ozs7O0FBY0csYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUFLMEIsYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUFoRHFCLFE7Ozs7OztBQUR2Qiw0RSJ9