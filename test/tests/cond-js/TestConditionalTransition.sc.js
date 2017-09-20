//Generated on 2017-9-20 12:41:51 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'root';
function $deserializeDatamodel($serializedDatamodel){

}
function $serializeDatamodel(){
   return {

   };
}
function $cond_l55_c49(_event){
return false;
};
$cond_l55_c49.tagname='undefined';
$cond_l55_c49.line=55;
$cond_l55_c49.column=49;
function $cond_l56_c49(_event){
return true;
};
$cond_l56_c49.tagname='undefined';
$cond_l56_c49.line=56;
$cond_l56_c49.column=49;
function $cond_l65_c49(_event){
return false;
};
$cond_l65_c49.tagname='undefined';
$cond_l65_c49.line=65;
$cond_l65_c49.column=49;
function $cond_l66_c49(_event){
return false;
};
$cond_l66_c49.tagname='undefined';
$cond_l66_c49.line=66;
$cond_l66_c49.column=49;
function $cond_l67_c49(_event){
return true;
};
$cond_l67_c49.tagname='undefined';
$cond_l67_c49.line=67;
$cond_l67_c49.column=49;
function $cond_l92_c51(_event){
return true;
};
$cond_l92_c51.tagname='undefined';
$cond_l92_c51.line=92;
$cond_l92_c51.column=51;
function $cond_l82_c52(_event){
return true;
};
$cond_l82_c52.tagname='undefined';
$cond_l82_c52.line=82;
$cond_l82_c52.column=52;
function $cond_l87_c52(_event){
return false;
};
$cond_l87_c52.tagname='undefined';
$cond_l87_c52.line=87;
$cond_l87_c52.column=52;
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "name": "root",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "a",
   "$type": "state",
   "transitions": [
    {
     "target": "b"
    }
   ]
  },
  {
   "id": "b",
   "$type": "state",
   "transitions": [
    {
     "target": "c",
     "event": "t1"
    }
   ]
  },
  {
   "id": "c",
   "$type": "state",
   "transitions": [
    {
     "target": "d1"
    },
    {
     "target": "d2"
    }
   ]
  },
  {
   "id": "d1",
   "$type": "state",
   "transitions": [
    {
     "target": "e1",
     "event": "t2"
    },
    {
     "target": "e2",
     "event": "t2"
    }
   ]
  },
  {
   "id": "d2",
   "$type": "state"
  },
  {
   "id": "e1",
   "$type": "state",
   "transitions": [
    {
     "target": "f1",
     "event": "t3",
     "cond": $cond_l55_c49
    },
    {
     "target": "f2",
     "event": "t3",
     "cond": $cond_l56_c49
    }
   ]
  },
  {
   "id": "e2",
   "$type": "state"
  },
  {
   "id": "f1",
   "$type": "state"
  },
  {
   "id": "f2",
   "$type": "state",
   "transitions": [
    {
     "target": "g1",
     "event": "t4",
     "cond": $cond_l65_c49
    },
    {
     "target": "g2",
     "event": "t4",
     "cond": $cond_l66_c49
    },
    {
     "target": "g3",
     "event": "t4",
     "cond": $cond_l67_c49
    }
   ]
  },
  {
   "id": "g1",
   "$type": "state"
  },
  {
   "id": "g2",
   "$type": "state"
  },
  {
   "id": "g3",
   "$type": "state",
   "states": [
    {
     "$type": "initial",
     "id": "$generated-initial-0",
     "transitions": [
      {
       "target": "h"
      }
     ]
    },
    {
     "id": "h",
     "$type": "state",
     "transitions": [
      {
       "target": "i",
       "event": "t5",
       "cond": $cond_l82_c52
      }
     ]
    },
    {
     "id": "i",
     "$type": "state",
     "transitions": [
      {
       "target": "j",
       "event": "t5",
       "cond": $cond_l87_c52
      }
     ]
    },
    {
     "id": "j",
     "$type": "state"
    }
   ],
   "transitions": [
    {
     "target": "last",
     "event": "t5",
     "cond": $cond_l92_c51
    }
   ]
  },
  {
   "id": "last",
   "$type": "state"
  }
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/cond-js/TestConditionalTransition.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L2NvbmQtanMvVGVzdENvbmRpdGlvbmFsVHJhbnNpdGlvbi5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUF1RGlELFk7Ozs7OztBQUNBLFc7Ozs7OztBQVNBLFk7Ozs7OztBQUNBLFk7Ozs7OztBQUNBLFc7Ozs7OztBQXlCRSxXOzs7Ozs7QUFWQyxXOzs7Ozs7QUFLQSxZIn0=