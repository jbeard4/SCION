//Generated on 2017-9-20 12:42:04 by the SCION SCXML compiler
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
function $script_l35_c13(_event){

                x = x + 1;
};
$script_l35_c13.tagname='script';
$script_l35_c13.line=35;
$script_l35_c13.column=13;
function $cond_l34_c37(_event){
return x < 100;
};
$cond_l34_c37.tagname='undefined';
$cond_l34_c37.line=34;
$cond_l34_c37.column=37;
function $cond_l39_c37(_event){
return x === 100;
};
$cond_l39_c37.tagname='undefined';
$cond_l39_c37.line=39;
$cond_l39_c37.column=37;
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
   "id": "b",
   "$type": "state",
   "transitions": [
    {
     "target": "b",
     "cond": $cond_l34_c37,
     "onTransition": $script_l35_c13
    },
    {
     "target": "c",
     "cond": $cond_l39_c37
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
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/script/test1.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3NjcmlwdC90ZXN0MS5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztnQkE0QmdCLEMsQ0FBRSxDLENBQUUsQ0FBQyxDOzs7Ozs7O2dCQVFMLEMsQ0FBRSxDLENBQUUsQyxDQUFFLEMsQ0FBRSxDQUFDLEM7Ozs7OztBQUZZLFEsQ0FBRSxDLENBQUUsRzs7Ozs7O0FBS0osUSxDQUFFLEcsQ0FBSSxHIn0=