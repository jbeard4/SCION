//Generated on 2017-9-20 12:40:53 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
function $deserializeDatamodel($serializedDatamodel){

}
function $serializeDatamodel(){
   return {

   };
}
function $raise_l6_c5(_event){
this.raise({ name:"foo", data : null});
};
$raise_l6_c5.tagname='raise';
$raise_l6_c5.line=6;
$raise_l6_c5.column=5;
function $raise_l7_c5(_event){
this.raise({ name:"bar", data : null});
};
$raise_l7_c5.tagname='raise';
$raise_l7_c5.line=7;
$raise_l7_c5.column=5;
function $expr_l19_c56(_event){
return 'pass';
};
$expr_l19_c56.tagname='undefined';
$expr_l19_c56.line=19;
$expr_l19_c56.column=56;
function $log_l19_c30(_event){
this.log("Outcome",$expr_l19_c56.apply(this, arguments));
};
$log_l19_c30.tagname='log';
$log_l19_c30.line=19;
$log_l19_c30.column=30;
function $expr_l20_c56(_event){
return 'fail';
};
$expr_l20_c56.tagname='undefined';
$expr_l20_c56.line=20;
$expr_l20_c56.column=56;
function $log_l20_c30(_event){
this.log("Outcome",$expr_l20_c56.apply(this, arguments));
};
$log_l20_c30.tagname='log';
$log_l20_c30.line=20;
$log_l20_c30.column=30;
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
   "onEntry": [
    $raise_l6_c5,
    $raise_l7_c5
   ],
   "transitions": [
    {
     "event": "foo",
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
     "event": "bar",
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
    $log_l19_c30
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l20_c30
   ]
  }
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test144.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QxNDQudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFNSyx1Qzs7Ozs7O0FBQ0EsdUM7Ozs7OztBQVltRCxhOzs7Ozs7QUFBMUIseUQ7Ozs7OztBQUMwQixhOzs7Ozs7QUFBMUIseUQifQ==