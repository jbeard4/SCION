//Generated on 2017-9-20 12:42:11 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
var i;
function $deserializeDatamodel($serializedDatamodel){
  i = $serializedDatamodel["i"];
}
function $serializeDatamodel(){
   return {
  "i" : i
   };
}
function $expr_l30_c39(_event){
return 0;
};
$expr_l30_c39.tagname='undefined';
$expr_l30_c39.line=30;
$expr_l30_c39.column=39;
function $assign_l30_c13(_event){
i = $expr_l30_c39.apply(this, arguments);
};
$assign_l30_c13.tagname='assign';
$assign_l30_c13.line=30;
$assign_l30_c13.column=13;
function $cond_l58_c48(_event){
return i === 0;
};
$cond_l58_c48.tagname='undefined';
$cond_l58_c48.line=58;
$cond_l58_c48.column=48;
function $expr_l39_c47(_event){
return i + 1;
};
$expr_l39_c47.tagname='undefined';
$expr_l39_c47.line=39;
$expr_l39_c47.column=47;
function $assign_l39_c21(_event){
i = $expr_l39_c47.apply(this, arguments);
};
$assign_l39_c21.tagname='assign';
$assign_l39_c21.line=39;
$assign_l39_c21.column=21;
function $expr_l50_c47(_event){
return i - 1;
};
$expr_l50_c47.tagname='undefined';
$expr_l50_c47.line=50;
$expr_l50_c47.column=47;
function $assign_l50_c21(_event){
i = $expr_l50_c47.apply(this, arguments);
};
$assign_l50_c21.tagname='assign';
$assign_l50_c21.line=50;
$assign_l50_c21.column=21;
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
     "target": "p",
     "event": "t1",
     "onTransition": $assign_l30_c13
    }
   ]
  },
  {
   "id": "p",
   "$type": "parallel",
   "states": [
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
         "event": "t2",
         "target": "b2",
         "onTransition": $assign_l39_c21
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
         "event": "t2",
         "target": "c2",
         "onTransition": $assign_l50_c21
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
     "event": "t3",
     "target": "d",
     "cond": $cond_l58_c48
    },
    {
     "event": "t3",
     "target": "f"
    }
   ]
  },
  {
   "id": "d",
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
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/assign-current-small-step/test3.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L2Fzc2lnbi1jdXJyZW50LXNtYWxsLXN0ZXAvdGVzdDMuc2N4bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQThCdUMsUTs7Ozs7O0FBQTFCLHlDOzs7Ozs7QUE0Qm1DLFEsQ0FBRSxHLENBQUksQzs7Ozs7O0FBbkJQLFEsQ0FBRSxDLENBQUUsQzs7Ozs7O0FBQTlCLHlDOzs7Ozs7QUFXMEIsUSxDQUFFLEMsQ0FBRSxDOzs7Ozs7QUFBOUIseUMifQ==