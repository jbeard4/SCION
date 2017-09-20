//Generated on 2017-9-20 12:40:05 by the SCION SCXML compiler
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
           delay: getDelayInMs("2s"),
       });
};
$send_l6_c5.tagname='send';
$send_l6_c5.line=6;
$send_l6_c5.column=5;
function $raise_l14_c5(_event){
this.raise({ name:"foo", data : null});
};
$raise_l14_c5.tagname='raise';
$raise_l14_c5.line=14;
$raise_l14_c5.column=5;
function $raise_l22_c5(_event){
this.raise({ name:"bar", data : null});
};
$raise_l22_c5.tagname='raise';
$raise_l22_c5.line=22;
$raise_l22_c5.column=5;
function $raise_l30_c5(_event){
this.raise({ name:"foo.zoo", data : null});
};
$raise_l30_c5.tagname='raise';
$raise_l30_c5.line=30;
$raise_l30_c5.column=5;
function $raise_l38_c5(_event){
this.raise({ name:"foos", data : null});
};
$raise_l38_c5.tagname='raise';
$raise_l38_c5.line=38;
$raise_l38_c5.column=5;
function $raise_l47_c5(_event){
this.raise({ name:"foo.zoo", data : null});
};
$raise_l47_c5.tagname='raise';
$raise_l47_c5.line=47;
$raise_l47_c5.column=5;
function $raise_l55_c5(_event){
this.raise({ name:"foo", data : null});
};
$raise_l55_c5.tagname='raise';
$raise_l55_c5.line=55;
$raise_l55_c5.column=5;
function $expr_l63_c53(_event){
return 'pass';
};
$expr_l63_c53.tagname='undefined';
$expr_l63_c53.line=63;
$expr_l63_c53.column=53;
function $log_l63_c27(_event){
this.log("Outcome",$expr_l63_c53.apply(this, arguments));
};
$log_l63_c27.tagname='log';
$log_l63_c27.line=63;
$log_l63_c27.column=27;
function $expr_l64_c53(_event){
return 'fail';
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
    }
   ],
   "states": [
    {
     "id": "s01",
     "$type": "state",
     "onEntry": [
      $raise_l14_c5
     ],
     "transitions": [
      {
       "event": "foo bar",
       "target": "s02"
      }
     ]
    },
    {
     "id": "s02",
     "$type": "state",
     "onEntry": [
      $raise_l22_c5
     ],
     "transitions": [
      {
       "event": "foo bar",
       "target": "s03"
      }
     ]
    },
    {
     "id": "s03",
     "$type": "state",
     "onEntry": [
      $raise_l30_c5
     ],
     "transitions": [
      {
       "event": "foo bar",
       "target": "s04"
      }
     ]
    },
    {
     "id": "s04",
     "$type": "state",
     "onEntry": [
      $raise_l38_c5
     ],
     "transitions": [
      {
       "event": "foo",
       "target": "fail"
      },
      {
       "event": "foos",
       "target": "s05"
      }
     ]
    },
    {
     "id": "s05",
     "$type": "state",
     "onEntry": [
      $raise_l47_c5
     ],
     "transitions": [
      {
       "event": "foo.*",
       "target": "s06"
      }
     ]
    },
    {
     "id": "s06",
     "$type": "state",
     "onEntry": [
      $raise_l55_c5
     ],
     "transitions": [
      {
       "event": "*",
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
    $log_l63_c27
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l64_c27
   ]
  }
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test399.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QzOTkudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU1LO0FBQUEsQzs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFU7Ozs7OztBQVFBLHVDOzs7Ozs7QUFRQSx1Qzs7Ozs7O0FBUUEsMkM7Ozs7OztBQVFBLHdDOzs7Ozs7QUFTQSwyQzs7Ozs7O0FBUUEsdUM7Ozs7OztBQVFnRCxhOzs7Ozs7QUFBMUIseUQ7Ozs7OztBQUMwQixhOzs7Ozs7QUFBMUIseUQifQ==