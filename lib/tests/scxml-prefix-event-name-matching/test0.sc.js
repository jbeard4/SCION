//Generated on 2017-9-20 12:41:49 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
function $deserializeDatamodel($serializedDatamodel){

}
function $serializeDatamodel(){
   return {

   };
}
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
     "event": "foo"
    }
   ]
  },
  {
   "id": "b",
   "$type": "state",
   "transitions": [
    {
     "target": "c",
     "event": "foo.bar"
    }
   ]
  },
  {
   "id": "c",
   "$type": "state",
   "transitions": [
    {
     "target": "d",
     "event": "foo.bar.bat"
    }
   ]
  },
  {
   "id": "d",
   "$type": "state",
   "transitions": [
    {
     "target": "e",
     "event": "foo"
    }
   ]
  },
  {
   "id": "e",
   "$type": "state",
   "transitions": [
    {
     "target": "f",
     "event": "foo.bar"
    }
   ]
  },
  {
   "id": "f",
   "$type": "state",
   "transitions": [
    {
     "target": "g",
     "event": "foo.bar.bat"
    }
   ]
  },
  {
   "id": "g",
   "$type": "state"
  }
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/scxml-prefix-event-name-matching/test0.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiJ9