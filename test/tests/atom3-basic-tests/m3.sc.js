//Generated on 2017-9-20 12:41:36 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'root';
function $deserializeDatamodel($serializedDatamodel){

}
function $serializeDatamodel(){
   return {

   };
}
function $expr_l12_c23(_event){
return "exiting state A";
};
$expr_l12_c23.tagname='undefined';
$expr_l12_c23.line=12;
$expr_l12_c23.column=23;
function $log_l12_c9(_event){
this.log(null,$expr_l12_c23.apply(this, arguments));
};
$log_l12_c9.tagname='log';
$log_l12_c9.line=12;
$log_l12_c9.column=9;
function $expr_l9_c23(_event){
return "entering state A";
};
$expr_l9_c23.tagname='undefined';
$expr_l9_c23.line=9;
$expr_l9_c23.column=23;
function $log_l9_c9(_event){
this.log(null,$expr_l9_c23.apply(this, arguments));
};
$log_l9_c9.tagname='log';
$log_l9_c9.line=9;
$log_l9_c9.column=9;
function $expr_l15_c23(_event){
return "triggered by e1";
};
$expr_l15_c23.tagname='undefined';
$expr_l15_c23.line=15;
$expr_l15_c23.column=23;
function $log_l15_c9(_event){
this.log(null,$expr_l15_c23.apply(this, arguments));
};
$log_l15_c9.tagname='log';
$log_l15_c9.line=15;
$log_l15_c9.column=9;
function $expr_l20_c23(_event){
return "triggered by e2";
};
$expr_l20_c23.tagname='undefined';
$expr_l20_c23.line=20;
$expr_l20_c23.column=23;
function $log_l20_c9(_event){
this.log(null,$expr_l20_c23.apply(this, arguments));
};
$log_l20_c9.tagname='log';
$log_l20_c9.line=20;
$log_l20_c9.column=9;
function $expr_l30_c21(_event){
return "exiting state C";
};
$expr_l30_c21.tagname='undefined';
$expr_l30_c21.line=30;
$expr_l30_c21.column=21;
function $log_l30_c7(_event){
this.log(null,$expr_l30_c21.apply(this, arguments));
};
$log_l30_c7.tagname='log';
$log_l30_c7.line=30;
$log_l30_c7.column=7;
function $expr_l27_c21(_event){
return "entering state C";
};
$expr_l27_c21.tagname='undefined';
$expr_l27_c21.line=27;
$expr_l27_c21.column=21;
function $log_l27_c7(_event){
this.log(null,$expr_l27_c21.apply(this, arguments));
};
$log_l27_c7.tagname='log';
$log_l27_c7.line=27;
$log_l27_c7.column=7;
return {
 "{http://www.w3.org/2000/xmlns/}ns0": "http://www.w3.org/2005/07/scxml",
 "name": "root",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "AB",
   "$type": "state",
   "states": [
    {
     "$type": "initial",
     "id": "$generated-initial-0",
     "transitions": [
      {
       "target": "A"
      }
     ]
    },
    {
     "id": "A",
     "$type": "state",
     "onEntry": [
      $log_l9_c9
     ],
     "onExit": [
      $log_l12_c9
     ],
     "transitions": [
      {
       "target": "B",
       "event": "e1",
       "onTransition": $log_l15_c9
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
       "onTransition": $log_l20_c9
      }
     ]
    }
   ],
   "transitions": [
    {
     "target": "C",
     "event": "e1"
    }
   ]
  },
  {
   "id": "C",
   "$type": "state",
   "onEntry": [
    $log_l27_c7
   ],
   "onExit": [
    $log_l30_c7
   ]
  }
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/atom3-basic-tests/m3.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L2F0b20zLWJhc2ljLXRlc3RzL20zLnNjeG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQVl1Qix3Qjs7Ozs7O0FBQWQsb0Q7Ozs7OztBQUhjLHlCOzs7Ozs7QUFBZCxtRDs7Ozs7O0FBTWMsd0I7Ozs7OztBQUFkLG9EOzs7Ozs7QUFLYyx3Qjs7Ozs7O0FBQWQsb0Q7Ozs7OztBQVVZLHdCOzs7Ozs7QUFBZCxvRDs7Ozs7O0FBSGMseUI7Ozs7OztBQUFkLG9EIn0=