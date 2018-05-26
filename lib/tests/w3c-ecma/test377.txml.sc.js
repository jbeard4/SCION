//Generated on 2017-9-20 12:40:21 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
function $deserializeDatamodel($serializedDatamodel){

}
function $serializeDatamodel(){
   return {

   };
}
function $raise_l6_c5(_event){
this.raise({ name:"event1", data : null});
};
$raise_l6_c5.tagname='raise';
$raise_l6_c5.line=6;
$raise_l6_c5.column=5;
function $raise_l9_c5(_event){
this.raise({ name:"event2", data : null});
};
$raise_l9_c5.tagname='raise';
$raise_l9_c5.line=9;
$raise_l9_c5.column=5;
function $expr_l28_c53(_event){
return 'pass';
};
$expr_l28_c53.tagname='undefined';
$expr_l28_c53.line=28;
$expr_l28_c53.column=53;
function $log_l28_c27(_event){
this.log("Outcome",$expr_l28_c53.apply(this, arguments));
};
$log_l28_c27.tagname='log';
$log_l28_c27.line=28;
$log_l28_c27.column=27;
function $expr_l29_c53(_event){
return 'fail';
};
$expr_l29_c53.tagname='undefined';
$expr_l29_c53.line=29;
$expr_l29_c53.column=53;
function $log_l29_c27(_event){
this.log("Outcome",$expr_l29_c53.apply(this, arguments));
};
$log_l29_c27.tagname='log';
$log_l29_c27.line=29;
$log_l29_c27.column=27;
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "{http://www.w3.org/2000/xmlns/}conf": "http://www.w3.org/2005/scxml-conformance",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "s0",
   "$type": "state",
   "onExit": [
    [
     $raise_l6_c5
    ],
    [
     $raise_l9_c5
    ]
   ],
   "transitions": [
    {
     "target": "s1"
    }
   ]
  },
  {
   "id": "s1",
   "$type": "state",
   "transitions": [
    {
     "event": "event1",
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
  },
  {
   "id": "pass",
   "$type": "final",
   "onEntry": [
    $log_l28_c27
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l29_c27
   ]
  }
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test377.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QzNzcudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFNSywwQzs7Ozs7O0FBR0EsMEM7Ozs7OztBQW1CZ0QsYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUFDMEIsYTs7Ozs7O0FBQTFCLHlEIn0=