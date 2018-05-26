//Generated on 2017-9-20 12:41:32 by the SCION SCXML compiler
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
function $expr_l23_c53(_event){
return 'pass';
};
$expr_l23_c53.tagname='undefined';
$expr_l23_c53.line=23;
$expr_l23_c53.column=53;
function $log_l23_c27(_event){
this.log("Outcome",$expr_l23_c53.apply(this, arguments));
};
$log_l23_c27.tagname='log';
$log_l23_c27.line=23;
$log_l23_c27.column=27;
function $expr_l24_c53(_event){
return 'fail';
};
$expr_l24_c53.tagname='undefined';
$expr_l24_c53.line=24;
$expr_l24_c53.column=53;
function $log_l24_c27(_event){
this.log("Outcome",$expr_l24_c53.apply(this, arguments));
};
$log_l24_c27.tagname='log';
$log_l24_c27.line=24;
$log_l24_c27.column=27;
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "{http://www.w3.org/2000/xmlns/}conf": "http://www.w3.org/2005/scxml-conformance",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "s0",
   "$type": "state",
   "onEntry": [
    [
     $raise_l6_c5
    ],
    [
     $raise_l9_c5
    ]
   ],
   "transitions": [
    {
     "event": "event1",
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
    $log_l23_c27
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l24_c27
   ]
  }
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test375.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QzNzUudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFNSywwQzs7Ozs7O0FBR0EsMEM7Ozs7OztBQWNnRCxhOzs7Ozs7QUFBMUIseUQ7Ozs7OztBQUMwQixhOzs7Ozs7QUFBMUIseUQifQ==