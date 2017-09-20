//Generated on 2017-9-20 12:42:10 by the SCION SCXML compiler
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
     "target": [
      "hb",
      "hc"
     ],
     "event": "t6"
    },
    {
     "target": "hp",
     "event": "t9"
    }
   ]
  },
  {
   "id": "p",
   "$type": "parallel",
   "states": [
    {
     "id": "hp",
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
     "initial": "hb",
     "$type": "state",
     "states": [
      {
       "id": "hb",
       "type": "deep",
       "isDeep": true,
       "$type": "history",
       "transitions": [
        {
         "target": "b1"
        }
       ]
      },
      {
       "id": "b1",
       "initial": "b1.1",
       "$type": "state",
       "states": [
        {
         "id": "b1.1",
         "$type": "state",
         "transitions": [
          {
           "target": "b1.2",
           "event": "t2"
          }
         ]
        },
        {
         "id": "b1.2",
         "$type": "state",
         "transitions": [
          {
           "target": "b2",
           "event": "t3"
          }
         ]
        }
       ]
      },
      {
       "id": "b2",
       "initial": "b2.1",
       "$type": "state",
       "states": [
        {
         "id": "b2.1",
         "$type": "state",
         "transitions": [
          {
           "target": "b2.2",
           "event": "t4"
          }
         ]
        },
        {
         "id": "b2.2",
         "$type": "state",
         "transitions": [
          {
           "target": "a",
           "event": "t5"
          },
          {
           "target": "a",
           "event": "t8"
          }
         ]
        }
       ]
      }
     ]
    },
    {
     "id": "c",
     "initial": "hc",
     "$type": "state",
     "states": [
      {
       "id": "hc",
       "type": "shallow",
       "isDeep": false,
       "$type": "history",
       "transitions": [
        {
         "target": "c1"
        }
       ]
      },
      {
       "id": "c1",
       "initial": "c1.1",
       "$type": "state",
       "states": [
        {
         "id": "c1.1",
         "$type": "state",
         "transitions": [
          {
           "target": "c1.2",
           "event": "t2"
          }
         ]
        },
        {
         "id": "c1.2",
         "$type": "state",
         "transitions": [
          {
           "target": "c2",
           "event": "t3"
          }
         ]
        }
       ]
      },
      {
       "id": "c2",
       "initial": "c2.1",
       "$type": "state",
       "states": [
        {
         "id": "c2.1",
         "$type": "state",
         "transitions": [
          {
           "target": "c2.2",
           "event": "t4"
          },
          {
           "target": "c2.2",
           "event": "t7"
          }
         ]
        },
        {
         "id": "c2.2",
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
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/history/history4.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiJ9