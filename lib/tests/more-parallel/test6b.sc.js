//Generated on 2017-9-20 12:41:54 by the SCION SCXML compiler
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
   "id": "p",
   "$type": "parallel",
   "states": [
    {
     "id": "b",
     "$type": "state",
     "states": [
      {
       "id": "b1",
       "$type": "state",
       "states": [
        {
         "id": "b11",
         "$type": "state",
         "transitions": [
          {
           "event": "t",
           "target": "b12"
          }
         ]
        },
        {
         "id": "b12",
         "$type": "state"
        }
       ]
      },
      {
       "id": "b2",
       "$type": "state",
       "states": [
        {
         "id": "b21",
         "$type": "state"
        },
        {
         "id": "b22",
         "$type": "state"
        }
       ]
      }
     ]
    },
    {
     "id": "a",
     "$type": "state",
     "transitions": [
      {
       "event": "t",
       "target": "a22"
      }
     ],
     "states": [
      {
       "id": "a1",
       "$type": "state",
       "states": [
        {
         "id": "a11",
         "$type": "state"
        },
        {
         "id": "a12",
         "$type": "state"
        }
       ]
      },
      {
       "id": "a2",
       "$type": "state",
       "states": [
        {
         "id": "a21",
         "$type": "state"
        },
        {
         "id": "a22",
         "$type": "state"
        }
       ]
      }
     ]
    }
   ]
  }
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/more-parallel/test6b.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiJ9