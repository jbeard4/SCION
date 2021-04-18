//Generated on 2017-9-20 12:42:15 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
var i;
function script_$dash_1_$dash_0_$period_js(_event){
i = 0;
};
script_$dash_1_$dash_0_$period_js.tagname='undefined';
script_$dash_1_$dash_0_$period_js.line=0;
script_$dash_1_$dash_0_$period_js.column=0;

function script_$dash_1_$dash_1_$period_js(_event){
i = i + 1;
};
script_$dash_1_$dash_1_$period_js.tagname='undefined';
script_$dash_1_$dash_1_$period_js.line=0;
script_$dash_1_$dash_1_$period_js.column=0;

function $deserializeDatamodel($serializedDatamodel){
  i = $serializedDatamodel["i"];
}
function $serializeDatamodel(){
   return {
  "i" : i
   };
}
function $expr_l27_c39(_event){
return 0;
};
$expr_l27_c39.tagname='undefined';
$expr_l27_c39.line=27;
$expr_l27_c39.column=39;
function $assign_l27_c13(_event){
i = $expr_l27_c39.apply(this, arguments);
};
$assign_l27_c13.tagname='assign';
$assign_l27_c13.line=27;
$assign_l27_c13.column=13;
function $script_l28_c13(_event){
script_$dash_1_$dash_0_$period_js.apply(this, arguments)
};
$script_l28_c13.tagname='script';
$script_l28_c13.line=28;
$script_l28_c13.column=13;
function $script_l34_c13(_event){
script_$dash_1_$dash_1_$period_js.apply(this, arguments)
};
$script_l34_c13.tagname='script';
$script_l34_c13.line=34;
$script_l34_c13.column=13;
function $cond_l33_c37(_event){
return i < 100;
};
$cond_l33_c37.tagname='undefined';
$cond_l33_c37.line=33;
$cond_l33_c37.column=37;
function $cond_l36_c37(_event){
return i === 100;
};
$cond_l36_c37.tagname='undefined';
$cond_l36_c37.line=36;
$cond_l36_c37.column=37;
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "a",
   "$type": "state",
   "transitions": [
    {
     "target": "b",
     "event": "t",
     "onTransition": [
      $assign_l27_c13,
      $script_l28_c13
     ]
    }
   ]
  },
  {
   "id": "b",
   "$type": "state",
   "transitions": [
    {
     "target": "b",
     "cond": $cond_l33_c37,
     "onTransition": $script_l34_c13
    },
    {
     "target": "c",
     "cond": $cond_l36_c37
    }
   ]
  },
  {
   "id": "c",
   "$type": "state"
  }
 ],
 "onEntry": [],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/script-src/test1.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3NjcmlwdC1zcmMvc2NyaXB0LTEtMC5qcyIsIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3NjcmlwdC1zcmMvc2NyaXB0LTEtMS5qcyIsIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3NjcmlwdC1zcmMvdGVzdDEuc2N4bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxDLENBQUUsQyxDQUFFLENBQUMsQzs7Ozs7OztBQ0FMLEMsQ0FBRSxDLENBQUUsQyxDQUFFLEMsQ0FBRSxDQUFDLEM7Ozs7Ozs7Ozs7Ozs7OztBQzJCOEIsUTs7Ozs7O0FBQTFCLHlDOzs7Ozs7QUFDQSxpQ0FBaUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDLENBQUUsU0FBUyxDOzs7Ozs7QUFNdkQsaUNBQWlDLENBQUMsS0FBSyxDQUFDLElBQUksQyxDQUFFLFNBQVMsQzs7Ozs7O0FBRC9CLFEsQ0FBRSxDLENBQUUsRzs7Ozs7O0FBR0osUSxDQUFFLEcsQ0FBSSxHIn0=