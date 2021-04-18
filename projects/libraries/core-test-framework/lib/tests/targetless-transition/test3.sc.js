//Generated on 2017-9-20 12:41:45 by the SCION SCXML compiler
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
function $cond_l27_c40(_event){
return i === 100;
};
$cond_l27_c40.tagname='undefined';
$cond_l27_c40.line=27;
$cond_l27_c40.column=40;
function $expr_l30_c39(_event){
return i * 20;
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
function $expr_l31_c23(_event){
return i;
};
$expr_l31_c23.tagname='undefined';
$expr_l31_c23.line=31;
$expr_l31_c23.column=23;
function $log_l31_c13(_event){
this.log(null,$expr_l31_c23.apply(this, arguments));
};
$log_l31_c13.tagname='log';
$log_l31_c13.line=31;
$log_l31_c13.column=13;
function $expr_l37_c47(_event){
return i * 2;
};
$expr_l37_c47.tagname='undefined';
$expr_l37_c47.line=37;
$expr_l37_c47.column=47;
function $assign_l37_c21(_event){
i = $expr_l37_c47.apply(this, arguments);
};
$assign_l37_c21.tagname='assign';
$assign_l37_c21.line=37;
$assign_l37_c21.column=21;
function $expr_l38_c31(_event){
return i;
};
$expr_l38_c31.tagname='undefined';
$expr_l38_c31.line=38;
$expr_l38_c31.column=31;
function $log_l38_c21(_event){
this.log(null,$expr_l38_c31.apply(this, arguments));
};
$log_l38_c21.tagname='log';
$log_l38_c21.line=38;
$log_l38_c21.column=21;
function $expr_l49_c47(_event){
return Math.pow(i,3);
};
$expr_l49_c47.tagname='undefined';
$expr_l49_c47.line=49;
$expr_l49_c47.column=47;
function $assign_l49_c21(_event){
i = $expr_l49_c47.apply(this, arguments);
};
$assign_l49_c21.tagname='assign';
$assign_l49_c21.line=49;
$assign_l49_c21.column=21;
function $expr_l50_c31(_event){
return i;
};
$expr_l50_c31.tagname='undefined';
$expr_l50_c31.line=50;
$expr_l50_c31.column=31;
function $log_l50_c21(_event){
this.log(null,$expr_l50_c31.apply(this, arguments));
};
$log_l50_c21.tagname='log';
$log_l50_c21.line=50;
$log_l50_c21.column=21;
function $expr_l60_c43(_event){
return i - 3;
};
$expr_l60_c43.tagname='undefined';
$expr_l60_c43.line=60;
$expr_l60_c43.column=43;
function $assign_l60_c17(_event){
i = $expr_l60_c43.apply(this, arguments);
};
$assign_l60_c17.tagname='assign';
$assign_l60_c17.line=60;
$assign_l60_c17.column=17;
function $expr_l61_c27(_event){
return i;
};
$expr_l61_c27.tagname='undefined';
$expr_l61_c27.line=61;
$expr_l61_c27.column=27;
function $log_l61_c17(_event){
this.log(null,$expr_l61_c27.apply(this, arguments));
};
$log_l61_c17.tagname='log';
$log_l61_c17.line=61;
$log_l61_c17.column=17;
function $data_l22_c27(_event){
return 1;
};
$data_l22_c27.tagname='undefined';
$data_l22_c27.line=22;
$data_l22_c27.column=27;
function $datamodel_l21_c5(_event){
if(typeof i === "undefined")  i = $data_l22_c27.apply(this, arguments);
};
$datamodel_l21_c5.tagname='datamodel';
$datamodel_l21_c5.line=21;
$datamodel_l21_c5.column=5;
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "p",
   "$type": "parallel",
   "transitions": [
    {
     "target": "done",
     "cond": $cond_l27_c40
    },
    {
     "event": "bar",
     "onTransition": [
      $assign_l30_c13,
      $log_l31_c13
     ]
    }
   ],
   "states": [
    {
     "id": "a",
     "$type": "state",
     "states": [
      {
       "id": "a1",
       "$type": "state",
       "transitions": [
        {
         "event": "foo",
         "target": "a2",
         "onTransition": [
          $assign_l37_c21,
          $log_l38_c21
         ]
        }
       ]
      },
      {
       "id": "a2",
       "$type": "state"
      }
     ]
    },
    {
     "id": "b",
     "$type": "state",
     "states": [
      {
       "id": "b1",
       "$type": "state",
       "transitions": [
        {
         "event": "foo",
         "target": "b2",
         "onTransition": [
          $assign_l49_c21,
          $log_l50_c21
         ]
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
     "$type": "state",
     "transitions": [
      {
       "event": "foo",
       "onTransition": [
        $assign_l60_c17,
        $log_l61_c17
       ]
      }
     ]
    }
   ]
  },
  {
   "id": "done",
   "$type": "state"
  }
 ],
 "onEntry": [
  $datamodel_l21_c5
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/targetless-transition/test3.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3RhcmdldGxlc3MtdHJhbnNpdGlvbi90ZXN0My5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBMkJ3QyxRLENBQUUsRyxDQUFJLEc7Ozs7OztBQUdQLFEsQ0FBRSxDLENBQUUsRTs7Ozs7O0FBQTlCLHlDOzs7Ozs7QUFDVSxROzs7Ozs7QUFBVixvRDs7Ozs7O0FBTWtDLFEsQ0FBRSxDLENBQUUsQzs7Ozs7O0FBQTlCLHlDOzs7Ozs7QUFDVSxROzs7Ozs7QUFBVixvRDs7Ozs7O0FBVzBCLFdBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQzs7Ozs7O0FBQXRDLHlDOzs7Ozs7QUFDVSxROzs7Ozs7QUFBVixvRDs7Ozs7O0FBVXNCLFEsQ0FBRSxDLENBQUUsQzs7Ozs7O0FBQTlCLHlDOzs7Ozs7QUFDVSxROzs7Ozs7QUFBVixvRDs7Ozs7O0FBdkNVLFE7Ozs7OztBQUR0Qix1RSJ9