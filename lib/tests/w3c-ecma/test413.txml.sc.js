//Generated on 2017-9-20 12:40:49 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
function $deserializeDatamodel($serializedDatamodel){

}
function $serializeDatamodel(){
   return {

   };
}
function $cond_l21_c24(_event){
return In('s2p122');
};
$cond_l21_c24.tagname='undefined';
$cond_l21_c24.line=21;
$cond_l21_c24.column=24;
function $cond_l32_c24(_event){
return In('s2p112');
};
$cond_l32_c24.tagname='undefined';
$cond_l32_c24.line=32;
$cond_l32_c24.column=24;
function $expr_l41_c53(_event){
return 'pass';
};
$expr_l41_c53.tagname='undefined';
$expr_l41_c53.line=41;
$expr_l41_c53.column=53;
function $log_l41_c27(_event){
this.log("Outcome",$expr_l41_c53.apply(this, arguments));
};
$log_l41_c27.tagname='log';
$log_l41_c27.line=41;
$log_l41_c27.column=27;
function $expr_l42_c53(_event){
return 'fail';
};
$expr_l42_c53.tagname='undefined';
$expr_l42_c53.line=42;
$expr_l42_c53.column=53;
function $log_l42_c27(_event){
this.log("Outcome",$expr_l42_c53.apply(this, arguments));
};
$log_l42_c27.tagname='log';
$log_l42_c27.line=42;
$log_l42_c27.column=27;
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "{http://www.w3.org/2000/xmlns/}conf": "http://www.w3.org/2005/scxml-conformance",
 "initial": [
  "s2p112",
  "s2p122"
 ],
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "s1",
   "$type": "state",
   "transitions": [
    {
     "target": "fail"
    }
   ]
  },
  {
   "id": "s2",
   "initial": "s2p1",
   "$type": "state",
   "states": [
    {
     "id": "s2p1",
     "$type": "parallel",
     "transitions": [
      {
       "target": "fail"
      }
     ],
     "states": [
      {
       "id": "s2p11",
       "initial": "s2p111",
       "$type": "state",
       "states": [
        {
         "id": "s2p111",
         "$type": "state",
         "transitions": [
          {
           "target": "fail"
          }
         ]
        },
        {
         "id": "s2p112",
         "$type": "state",
         "transitions": [
          {
           "cond": $cond_l21_c24,
           "target": "pass"
          }
         ]
        }
       ]
      },
      {
       "id": "s2p12",
       "initial": "s2p121",
       "$type": "state",
       "states": [
        {
         "id": "s2p121",
         "$type": "state",
         "transitions": [
          {
           "target": "fail"
          }
         ]
        },
        {
         "id": "s2p122",
         "$type": "state",
         "transitions": [
          {
           "cond": $cond_l32_c24,
           "target": "pass"
          }
         ]
        }
       ]
      }
     ]
    }
   ]
  },
  {
   "id": "pass",
   "$type": "final",
   "onEntry": [
    $log_l41_c27
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l42_c27
   ]
  }
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test413.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3Q0MTMudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFxQndCLFNBQUUsQ0FBQyxRQUFRLEM7Ozs7OztBQVdYLFNBQUUsQ0FBQyxRQUFRLEM7Ozs7OztBQVNrQixhOzs7Ozs7QUFBMUIseUQ7Ozs7OztBQUMwQixhOzs7Ozs7QUFBMUIseUQifQ==