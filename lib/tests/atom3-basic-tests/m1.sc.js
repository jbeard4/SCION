//Generated on 2017-9-20 12:41:37 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'root';
function $deserializeDatamodel($serializedDatamodel){

}
function $serializeDatamodel(){
   return {

   };
}
function $expr_l8_c21(_event){
return "exiting state A";
};
$expr_l8_c21.tagname='undefined';
$expr_l8_c21.line=8;
$expr_l8_c21.column=21;
function $log_l8_c7(_event){
this.log(null,$expr_l8_c21.apply(this, arguments));
};
$log_l8_c7.tagname='log';
$log_l8_c7.line=8;
$log_l8_c7.column=7;
function $expr_l5_c21(_event){
return "entering state A";
};
$expr_l5_c21.tagname='undefined';
$expr_l5_c21.line=5;
$expr_l5_c21.column=21;
function $log_l5_c7(_event){
this.log(null,$expr_l5_c21.apply(this, arguments));
};
$log_l5_c7.tagname='log';
$log_l5_c7.line=5;
$log_l5_c7.column=7;
function $expr_l11_c21(_event){
return "triggered by e1";
};
$expr_l11_c21.tagname='undefined';
$expr_l11_c21.line=11;
$expr_l11_c21.column=21;
function $log_l11_c7(_event){
this.log(null,$expr_l11_c21.apply(this, arguments));
};
$log_l11_c7.tagname='log';
$log_l11_c7.line=11;
$log_l11_c7.column=7;
function $expr_l16_c21(_event){
return "triggered by e2";
};
$expr_l16_c21.tagname='undefined';
$expr_l16_c21.line=16;
$expr_l16_c21.column=21;
function $log_l16_c7(_event){
this.log(null,$expr_l16_c21.apply(this, arguments));
};
$log_l16_c7.tagname='log';
$log_l16_c7.line=16;
$log_l16_c7.column=7;
return {
 "{http://www.w3.org/2000/xmlns/}ns0": "http://www.w3.org/2005/07/scxml",
 "name": "root",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "A",
   "$type": "state",
   "onEntry": [
    $log_l5_c7
   ],
   "onExit": [
    $log_l8_c7
   ],
   "transitions": [
    {
     "target": "B",
     "event": "e1",
     "onTransition": $log_l11_c7
    }
   ]
  },
  {
   "id": "B",
   "$type": "state",
   "transitions": [
    {
     "target": "A",
     "event": "e2",
     "onTransition": $log_l16_c7
    }
   ]
  }
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/atom3-basic-tests/m1.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L2F0b20zLWJhc2ljLXRlc3RzL20xLnNjeG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQVFxQix3Qjs7Ozs7O0FBQWQsbUQ7Ozs7OztBQUhjLHlCOzs7Ozs7QUFBZCxtRDs7Ozs7O0FBTWMsd0I7Ozs7OztBQUFkLG9EOzs7Ozs7QUFLYyx3Qjs7Ozs7O0FBQWQsb0QifQ==