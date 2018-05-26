//Generated on 2017-9-20 12:41:42 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
function $deserializeDatamodel($serializedDatamodel){

}
function $serializeDatamodel(){
   return {

   };
}
function $raise_l35_c13(_event){
this.raise({ name:"s", data : null});
};
$raise_l35_c13.tagname='raise';
$raise_l35_c13.line=35;
$raise_l35_c13.column=13;
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "initial": "a",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "a",
   "$type": "state",
   "transitions": [
    {
     "target": "b",
     "event": "t"
    }
   ]
  },
  {
   "id": "b",
   "$type": "state",
   "onEntry": [
    $raise_l35_c13
   ],
   "transitions": [
    {
     "target": "c",
     "event": "s"
    },
    {
     "target": "f1"
    }
   ]
  },
  {
   "id": "c",
   "$type": "state",
   "transitions": [
    {
     "target": "f2",
     "event": "s"
    },
    {
     "target": "d"
    }
   ]
  },
  {
   "id": "f1",
   "$type": "state"
  },
  {
   "id": "d",
   "$type": "state"
  },
  {
   "id": "f2",
   "$type": "state"
  }
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/actionSend/send4.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L2FjdGlvblNlbmQvc2VuZDQuc2N4bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBbUNhLHFDIn0=