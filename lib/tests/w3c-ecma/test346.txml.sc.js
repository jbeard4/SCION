//Generated on 2017-9-20 12:39:56 by the SCION SCXML compiler
function machineNameConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'machineName';
function $deserializeDatamodel($serializedDatamodel){

}
function $serializeDatamodel(){
   return {

   };
}
function $script_l7_c5(_event){
throw new Error("You can't change system variables: _sessionid")
};
$script_l7_c5.tagname='script';
$script_l7_c5.line=7;
$script_l7_c5.column=5;
function $raise_l8_c5(_event){
this.raise({ name:"event1", data : null});
};
$raise_l8_c5.tagname='raise';
$raise_l8_c5.line=8;
$raise_l8_c5.column=5;
function $script_l17_c5(_event){
throw new Error("You can't change system variables: _event")
};
$script_l17_c5.tagname='script';
$script_l17_c5.line=17;
$script_l17_c5.column=5;
function $raise_l18_c5(_event){
this.raise({ name:"event2", data : null});
};
$raise_l18_c5.tagname='raise';
$raise_l18_c5.line=18;
$raise_l18_c5.column=5;
function $script_l30_c5(_event){
throw new Error("You can't change system variables: _ioprocessors")
};
$script_l30_c5.tagname='script';
$script_l30_c5.line=30;
$script_l30_c5.column=5;
function $raise_l31_c5(_event){
this.raise({ name:"event3", data : null});
};
$raise_l31_c5.tagname='raise';
$raise_l31_c5.line=31;
$raise_l31_c5.column=5;
function $script_l40_c5(_event){
throw new Error("You can't change system variables: _name")
};
$script_l40_c5.tagname='script';
$script_l40_c5.line=40;
$script_l40_c5.column=5;
function $raise_l41_c5(_event){
this.raise({ name:"event4", data : null});
};
$raise_l41_c5.tagname='raise';
$raise_l41_c5.line=41;
$raise_l41_c5.column=5;
function $expr_l49_c56(_event){
return 'pass';
};
$expr_l49_c56.tagname='undefined';
$expr_l49_c56.line=49;
$expr_l49_c56.column=56;
function $log_l49_c30(_event){
this.log("Outcome",$expr_l49_c56.apply(this, arguments));
};
$log_l49_c30.tagname='log';
$log_l49_c30.line=49;
$log_l49_c30.column=30;
function $expr_l50_c56(_event){
return 'fail';
};
$expr_l50_c56.tagname='undefined';
$expr_l50_c56.line=50;
$expr_l50_c56.column=56;
function $log_l50_c30(_event){
this.log("Outcome",$expr_l50_c56.apply(this, arguments));
};
$log_l50_c30.tagname='log';
$log_l50_c30.line=50;
$log_l50_c30.column=30;
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "{http://www.w3.org/2000/xmlns/}conf": "http://www.w3.org/2005/scxml-conformance",
 "initial": "s0",
 "name": "machineName",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "s0",
   "$type": "state",
   "onEntry": [
    $script_l7_c5,
    $raise_l8_c5
   ],
   "transitions": [
    {
     "event": "error.execution",
     "target": "s1"
    },
    {
     "event": "*",
     "target": "fail"
    }
   ]
  },
  {
   "id": "s1",
   "$type": "state",
   "onEntry": [
    $script_l17_c5,
    $raise_l18_c5
   ],
   "transitions": [
    {
     "event": "event1"
    },
    {
     "event": "error.execution",
     "target": "s2"
    },
    {
     "event": "*",
     "target": "fail"
    }
   ]
  },
  {
   "id": "s2",
   "$type": "state",
   "onEntry": [
    $script_l30_c5,
    $raise_l31_c5
   ],
   "transitions": [
    {
     "event": "event2"
    },
    {
     "event": "error.execution",
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
   "onEntry": [
    $script_l40_c5,
    $raise_l41_c5
   ],
   "transitions": [
    {
     "event": "event3"
    },
    {
     "event": "error.execution",
     "target": "pass"
    },
    {
     "event": "*",
     "target": "fail"
    }
   ]
  },
  {
   "id": "pass",
   "$type": "final",
   "onEntry": [
    $log_l49_c30
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l50_c30
   ]
  }
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test346.txml.scxml"
};
}
module.exports = machineNameConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QzNDYudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFPSyxLLENBQU0sRyxDQUFJLEtBQUssQ0FBQywrQ0FBK0MsQzs7Ozs7O0FBQy9ELDBDOzs7Ozs7QUFTQSxLLENBQU0sRyxDQUFJLEtBQUssQ0FBQywyQ0FBMkMsQzs7Ozs7O0FBQzNELDBDOzs7Ozs7QUFZQSxLLENBQU0sRyxDQUFJLEtBQUssQ0FBQyxrREFBa0QsQzs7Ozs7O0FBQ2xFLDBDOzs7Ozs7QUFTQSxLLENBQU0sRyxDQUFJLEtBQUssQ0FBQywwQ0FBMEMsQzs7Ozs7O0FBQzFELDBDOzs7Ozs7QUFRbUQsYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUFDMEIsYTs7Ozs7O0FBQTFCLHlEIn0=