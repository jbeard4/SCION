//Generated on 2017-9-20 12:42:04 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
function $deserializeDatamodel($serializedDatamodel){

}
function $serializeDatamodel(){
   return {

   };
}
function $expr_l6_c17(_event){
return 'onentry s1 _sessionid=' + _sessionid;
};
$expr_l6_c17.tagname='undefined';
$expr_l6_c17.line=6;
$expr_l6_c17.column=17;
function $log_l6_c7(_event){
this.log("TEST",$expr_l6_c17.apply(this, arguments));
};
$log_l6_c7.tagname='log';
$log_l6_c7.line=6;
$log_l6_c7.column=7;
function $expr_l13_c17(_event){
return 'onentry s2 _sessionid=' + _sessionid;
};
$expr_l13_c17.tagname='undefined';
$expr_l13_c17.line=13;
$expr_l13_c17.column=17;
function $log_l13_c7(_event){
this.log("TEST",$expr_l13_c17.apply(this, arguments));
};
$log_l13_c7.tagname='log';
$log_l13_c7.line=13;
$log_l13_c7.column=7;
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "initial": "s2",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "uber",
   "$type": "state",
   "states": [
    {
     "id": "s1",
     "$type": "state",
     "onEntry": [
      $log_l6_c7
     ],
     "transitions": [
      {
       "event": "ev1",
       "target": "s2"
      }
     ]
    },
    {
     "id": "s2",
     "$type": "state",
     "onEntry": [
      $log_l13_c7
     ]
    }
   ]
  }
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/misc/deep-initial.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L21pc2MvZGVlcC1pbml0aWFsLnNjeG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQU1pQiwrQixDQUF5QixDLENBQUUsVTs7Ozs7O0FBQXJDLHFEOzs7Ozs7QUFPVSwrQixDQUF5QixDLENBQUUsVTs7Ozs7O0FBQXJDLHNEIn0=