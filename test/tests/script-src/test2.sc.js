//Generated on 2017-9-20 12:42:15 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
var i;
function script_$dash_2_$dash_0_$period_js(_event){
i = 0;
};
script_$dash_2_$dash_0_$period_js.tagname='undefined';
script_$dash_2_$dash_0_$period_js.line=0;
script_$dash_2_$dash_0_$period_js.column=0;

function script_$dash_2_$dash_3_$period_js(_event){
i = i * 2;
};
script_$dash_2_$dash_3_$period_js.tagname='undefined';
script_$dash_2_$dash_3_$period_js.line=0;
script_$dash_2_$dash_3_$period_js.column=0;

function script_$dash_2_$dash_1_$period_js(_event){
i = i + 1;
};
script_$dash_2_$dash_1_$period_js.tagname='undefined';
script_$dash_2_$dash_1_$period_js.line=0;
script_$dash_2_$dash_1_$period_js.column=0;

function script_$dash_2_$dash_2_$period_js(_event){
i = i + 1;
};
script_$dash_2_$dash_2_$period_js.tagname='undefined';
script_$dash_2_$dash_2_$period_js.line=0;
script_$dash_2_$dash_2_$period_js.column=0;

function $deserializeDatamodel($serializedDatamodel){
  i = $serializedDatamodel["i"];
}
function $serializeDatamodel(){
   return {
  "i" : i
   };
}
function $script_l27_c13(_event){
script_$dash_2_$dash_0_$period_js.apply(this, arguments)
};
$script_l27_c13.tagname='script';
$script_l27_c13.line=27;
$script_l27_c13.column=13;
function $script_l46_c13(_event){
script_$dash_2_$dash_3_$period_js.apply(this, arguments)
};
$script_l46_c13.tagname='script';
$script_l46_c13.line=46;
$script_l46_c13.column=13;
function $cond_l45_c37(_event){
return i === 100;
};
$cond_l45_c37.tagname='undefined';
$cond_l45_c37.line=45;
$cond_l45_c37.column=37;
function $script_l35_c17(_event){
script_$dash_2_$dash_1_$period_js.apply(this, arguments)
};
$script_l35_c17.tagname='script';
$script_l35_c17.line=35;
$script_l35_c17.column=17;
function $cond_l34_c41(_event){
return i < 100;
};
$cond_l34_c41.tagname='undefined';
$cond_l34_c41.line=34;
$cond_l34_c41.column=41;
function $script_l41_c17(_event){
script_$dash_2_$dash_2_$period_js.apply(this, arguments)
};
$script_l41_c17.tagname='script';
$script_l41_c17.line=41;
$script_l41_c17.column=17;
function $cond_l40_c41(_event){
return i < 100;
};
$cond_l40_c41.tagname='undefined';
$cond_l40_c41.line=40;
$cond_l40_c41.column=41;
function $cond_l52_c37(_event){
return i === 200;
};
$cond_l52_c37.tagname='undefined';
$cond_l52_c37.line=52;
$cond_l52_c37.column=37;
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
     "onTransition": $script_l27_c13
    }
   ]
  },
  {
   "id": "A",
   "$type": "state",
   "states": [
    {
     "id": "b",
     "$type": "state",
     "transitions": [
      {
       "target": "c",
       "cond": $cond_l34_c41,
       "onTransition": $script_l35_c17
      }
     ]
    },
    {
     "id": "c",
     "$type": "state",
     "transitions": [
      {
       "target": "b",
       "cond": $cond_l40_c41,
       "onTransition": $script_l41_c17
      }
     ]
    }
   ],
   "transitions": [
    {
     "target": "d",
     "cond": $cond_l45_c37,
     "onTransition": $script_l46_c13
    }
   ]
  },
  {
   "id": "d",
   "$type": "state",
   "transitions": [
    {
     "target": "e",
     "cond": $cond_l52_c37
    },
    {
     "target": "f"
    }
   ]
  },
  {
   "id": "e",
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
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/script-src/test2.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3NjcmlwdC1zcmMvc2NyaXB0LTItMC5qcyIsIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3NjcmlwdC1zcmMvc2NyaXB0LTItMy5qcyIsIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3NjcmlwdC1zcmMvc2NyaXB0LTItMS5qcyIsIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3NjcmlwdC1zcmMvc2NyaXB0LTItMi5qcyIsIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3NjcmlwdC1zcmMvdGVzdDIuc2N4bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxDLENBQUUsQyxDQUFFLENBQUMsQzs7Ozs7OztBQ0FMLEMsQ0FBRSxDLENBQUUsQyxDQUFFLEMsQ0FBRSxDQUFDLEM7Ozs7Ozs7QUNBVCxDLENBQUUsQyxDQUFFLEMsQ0FBRSxDLENBQUUsQ0FBQyxDOzs7Ozs7O0FDQVQsQyxDQUFFLEMsQ0FBRSxDLENBQUUsQyxDQUFFLENBQUMsQzs7Ozs7Ozs7Ozs7Ozs7O0FDMkJJLGlDQUFpQyxDQUFDLEtBQUssQ0FBQyxJQUFJLEMsQ0FBRSxTQUFTLEM7Ozs7OztBQW1CdkQsaUNBQWlDLENBQUMsS0FBSyxDQUFDLElBQUksQyxDQUFFLFNBQVMsQzs7Ozs7O0FBRC9CLFEsQ0FBRSxHLENBQUksRzs7Ozs7O0FBVjFCLGlDQUFpQyxDQUFDLEtBQUssQ0FBQyxJQUFJLEMsQ0FBRSxTQUFTLEM7Ozs7OztBQUQvQixRLENBQUUsQyxDQUFFLEc7Ozs7OztBQU81QixpQ0FBaUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDLENBQUUsU0FBUyxDOzs7Ozs7QUFEL0IsUSxDQUFFLEMsQ0FBRSxHOzs7Ozs7QUFZUixRLENBQUUsRyxDQUFJLEcifQ==