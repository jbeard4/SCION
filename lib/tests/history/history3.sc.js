//Generated on 2017-9-20 12:42:08 by the SCION SCXML compiler
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
 "initial": "a",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "a",
   "$type": "state",
   "transitions": [
    {
     "target": "p",
     "event": "t1"
    },
    {
     "target": "h",
     "event": "t4"
    }
   ]
  },
  {
   "id": "p",
   "$type": "parallel",
   "states": [
    {
     "id": "h",
     "type": "deep",
     "isDeep": true,
     "$type": "history",
     "transitions": [
      {
       "target": "b"
      }
     ]
    },
    {
     "id": "b",
     "initial": "b1",
     "$type": "state",
     "states": [
      {
       "id": "b1",
       "$type": "state",
       "transitions": [
        {
         "target": "b2",
         "event": "t2"
        }
       ]
      },
      {
       "id": "b2",
       "$type": "state"
      }
     ]
    },
    {
     "id": "c",
     "initial": "c1",
     "$type": "state",
     "states": [
      {
       "id": "c1",
       "$type": "state",
       "transitions": [
        {
         "target": "c2",
         "event": "t2"
        }
       ]
      },
      {
       "id": "c2",
       "$type": "state"
      }
     ]
    }
   ],
   "transitions": [
    {
     "target": "a",
     "event": "t3"
    }
   ]
  }
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/history/history3.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiJ9