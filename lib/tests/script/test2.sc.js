//Generated on 2017-9-20 12:42:05 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
var x;
function $deserializeDatamodel($serializedDatamodel){
  x = $serializedDatamodel["x"];
}
function $serializeDatamodel(){
   return {
  "x" : x
   };
}
function $script_l27_c13(_event){

                x = 0;
};
$script_l27_c13.tagname='script';
$script_l27_c13.line=27;
$script_l27_c13.column=13;
function $script_l52_c13(_event){

                x = x * 2;
};
$script_l52_c13.tagname='script';
$script_l52_c13.line=52;
$script_l52_c13.column=13;
function $cond_l51_c37(_event){
return x === 100;
};
$cond_l51_c37.tagname='undefined';
$cond_l51_c37.line=51;
$cond_l51_c37.column=37;
function $script_l37_c17(_event){

                    x = x + 1;
};
$script_l37_c17.tagname='script';
$script_l37_c17.line=37;
$script_l37_c17.column=17;
function $cond_l36_c41(_event){
return x < 100;
};
$cond_l36_c41.tagname='undefined';
$cond_l36_c41.line=36;
$cond_l36_c41.column=41;
function $script_l45_c17(_event){

                    x = x + 1;
};
$script_l45_c17.tagname='script';
$script_l45_c17.line=45;
$script_l45_c17.column=17;
function $cond_l44_c41(_event){
return x < 100;
};
$cond_l44_c41.tagname='undefined';
$cond_l44_c41.line=44;
$cond_l44_c41.column=41;
function $cond_l60_c37(_event){
return x === 200;
};
$cond_l60_c37.tagname='undefined';
$cond_l60_c37.line=60;
$cond_l60_c37.column=37;
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
       "cond": $cond_l36_c41,
       "onTransition": $script_l37_c17
      }
     ]
    },
    {
     "id": "c",
     "$type": "state",
     "transitions": [
      {
       "target": "b",
       "cond": $cond_l44_c41,
       "onTransition": $script_l45_c17
      }
     ]
    }
   ],
   "transitions": [
    {
     "target": "d",
     "cond": $cond_l51_c37,
     "onTransition": $script_l52_c13
    }
   ]
  },
  {
   "id": "d",
   "$type": "state",
   "transitions": [
    {
     "target": "e",
     "cond": $cond_l60_c37
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
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/script/test2.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3NjcmlwdC90ZXN0Mi5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztnQkE0QmdCLEMsQ0FBRSxDLENBQUUsQ0FBQyxDOzs7Ozs7O2dCQXlCTCxDLENBQUUsQyxDQUFFLEMsQ0FBRSxDLENBQUUsQ0FBQyxDOzs7Ozs7QUFGWSxRLENBQUUsRyxDQUFJLEc7Ozs7Ozs7b0JBYnZCLEMsQ0FBRSxDLENBQUUsQyxDQUFFLEMsQ0FBRSxDQUFDLEM7Ozs7OztBQUZZLFEsQ0FBRSxDLENBQUUsRzs7Ozs7OztvQkFVekIsQyxDQUFFLEMsQ0FBRSxDLENBQUUsQyxDQUFFLENBQUMsQzs7Ozs7O0FBRlksUSxDQUFFLEMsQ0FBRSxHOzs7Ozs7QUFnQlIsUSxDQUFFLEcsQ0FBSSxHIn0=