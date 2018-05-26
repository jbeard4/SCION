//Generated on 2017-9-20 12:42:16 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
var x;
function script_$dash_0_$dash_0_$period_js(_event){
x = 100;
};
script_$dash_0_$dash_0_$period_js.tagname='undefined';
script_$dash_0_$dash_0_$period_js.line=0;
script_$dash_0_$dash_0_$period_js.column=0;

function $deserializeDatamodel($serializedDatamodel){
  x = $serializedDatamodel["x"];
}
function $serializeDatamodel(){
   return {
  "x" : x
   };
}
function $script_l27_c13(_event){
script_$dash_0_$dash_0_$period_js.apply(this, arguments)
};
$script_l27_c13.tagname='script';
$script_l27_c13.line=27;
$script_l27_c13.column=13;
function $cond_l32_c47(_event){
return x === 100;
};
$cond_l32_c47.tagname='undefined';
$cond_l32_c47.line=32;
$cond_l32_c47.column=47;
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "initial",
   "$type": "state",
   "transitions": [
    {
     "target": "a",
     "onTransition": $script_l27_c13
    }
   ]
  },
  {
   "id": "a",
   "$type": "state",
   "transitions": [
    {
     "target": "b",
     "event": "t",
     "cond": $cond_l32_c47
    },
    {
     "target": "f",
     "event": "t"
    }
   ]
  },
  {
   "id": "b",
   "$type": "state"
  },
  {
   "id": "f",
   "$type": "state"
  }
 ],
 "onEntry": [],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/script-src/test0.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3NjcmlwdC1zcmMvc2NyaXB0LTAtMC5qcyIsIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3NjcmlwdC1zcmMvdGVzdDAuc2N4bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxDLENBQUUsQyxDQUFFLEdBQUcsQzs7Ozs7Ozs7Ozs7Ozs7O0FDMkJNLGlDQUFpQyxDQUFDLEtBQUssQ0FBQyxJQUFJLEMsQ0FBRSxTQUFTLEM7Ozs7OztBQUtyQixRLENBQUUsRyxDQUFJLEcifQ==