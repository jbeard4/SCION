//Generated on 2017-9-20 12:42:09 by the SCION SCXML compiler
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
   "$type": "parallel",
   "states": [
    {
     "id": "ha",
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
     "$type": "parallel",
     "states": [
      {
       "id": "c",
       "$type": "parallel",
       "states": [
        {
         "id": "d",
         "$type": "parallel",
         "states": [
          {
           "id": "e",
           "$type": "parallel",
           "states": [
            {
             "id": "i",
             "initial": "i1",
             "$type": "state",
             "states": [
              {
               "id": "i1",
               "$type": "state",
               "transitions": [
                {
                 "target": "i2",
                 "event": "t1"
                }
               ]
              },
              {
               "id": "i2",
               "$type": "state",
               "transitions": [
                {
                 "target": "l",
                 "event": "t2"
                }
               ]
              }
             ]
            },
            {
             "id": "j",
             "$type": "state"
            }
           ]
          },
          {
           "id": "h",
           "$type": "state"
          }
         ]
        },
        {
         "id": "g",
         "$type": "state"
        }
       ]
      },
      {
       "id": "f",
       "initial": "f1",
       "$type": "state",
       "states": [
        {
         "id": "f1",
         "$type": "state",
         "transitions": [
          {
           "target": "f2",
           "event": "t1"
          }
         ]
        },
        {
         "id": "f2",
         "$type": "state"
        }
       ]
      }
     ]
    },
    {
     "id": "k",
     "$type": "state"
    }
   ]
  },
  {
   "id": "l",
   "$type": "state",
   "transitions": [
    {
     "target": "ha",
     "event": "t3"
    }
   ]
  }
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/history/history5.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiJ9