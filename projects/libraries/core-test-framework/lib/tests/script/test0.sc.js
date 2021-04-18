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

                x = 100;
};
$script_l27_c13.tagname='script';
$script_l27_c13.line=27;
$script_l27_c13.column=13;
function $cond_l34_c47(_event){
return x === 100;
};
$cond_l34_c47.tagname='undefined';
$cond_l34_c47.line=34;
$cond_l34_c47.column=47;
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "intitial1",
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
     "cond": $cond_l34_c47
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
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/script/test0.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3NjcmlwdC90ZXN0MC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztnQkE0QmdCLEMsQ0FBRSxDLENBQUUsR0FBRyxDOzs7Ozs7QUFNd0IsUSxDQUFFLEcsQ0FBSSxHIn0=