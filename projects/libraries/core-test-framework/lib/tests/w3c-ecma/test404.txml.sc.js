//Generated on 2017-9-20 12:39:53 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
function $deserializeDatamodel($serializedDatamodel){

}
function $serializeDatamodel(){
   return {

   };
}
function $raise_l12_c4(_event){
this.raise({ name:"event3", data : null});
};
$raise_l12_c4.tagname='raise';
$raise_l12_c4.line=12;
$raise_l12_c4.column=4;
function $raise_l16_c4(_event){
this.raise({ name:"event4", data : null});
};
$raise_l16_c4.tagname='raise';
$raise_l16_c4.line=16;
$raise_l16_c4.column=4;
function $raise_l22_c7(_event){
this.raise({ name:"event2", data : null});
};
$raise_l22_c7.tagname='raise';
$raise_l22_c7.line=22;
$raise_l22_c7.column=7;
function $raise_l29_c6(_event){
this.raise({ name:"event1", data : null});
};
$raise_l29_c6.tagname='raise';
$raise_l29_c6.line=29;
$raise_l29_c6.column=6;
function $expr_l57_c53(_event){
return 'pass';
};
$expr_l57_c53.tagname='undefined';
$expr_l57_c53.line=57;
$expr_l57_c53.column=53;
function $log_l57_c27(_event){
this.log("Outcome",$expr_l57_c53.apply(this, arguments));
};
$log_l57_c27.tagname='log';
$log_l57_c27.line=57;
$log_l57_c27.column=27;
function $expr_l58_c53(_event){
return 'fail';
};
$expr_l58_c53.tagname='undefined';
$expr_l58_c53.line=58;
$expr_l58_c53.column=53;
function $log_l58_c27(_event){
this.log("Outcome",$expr_l58_c53.apply(this, arguments));
};
$log_l58_c27.tagname='log';
$log_l58_c27.line=58;
$log_l58_c27.column=27;
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
   "states": [
    {
     "id": "s01p",
     "$type": "parallel",
     "onExit": [
      $raise_l12_c4
     ],
     "transitions": [
      {
       "target": "s02",
       "onTransition": $raise_l16_c4
      }
     ],
     "states": [
      {
       "id": "s01p1",
       "$type": "state",
       "onExit": [
        $raise_l22_c7
       ]
      },
      {
       "id": "s01p2",
       "$type": "state",
       "onExit": [
        $raise_l29_c6
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
    $log_l57_c27
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l58_c27
   ]
  }
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test404.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3Q0MDQudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFZSSwwQzs7Ozs7O0FBSUEsMEM7Ozs7OztBQU1HLDBDOzs7Ozs7QUFPRCwwQzs7Ozs7O0FBNEIrQyxhOzs7Ozs7QUFBMUIseUQ7Ozs7OztBQUMwQixhOzs7Ozs7QUFBMUIseUQifQ==