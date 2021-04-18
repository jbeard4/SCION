//Generated on 2017-9-20 12:41:44 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
var o1;
function $deserializeDatamodel($serializedDatamodel){
  o1 = $serializedDatamodel["o1"];
}
function $serializeDatamodel(){
   return {
  "o1" : o1
   };
}
function $expr_l10_c15(_event){
return 'unhandled input ' + JSON.stringify(_event);
};
$expr_l10_c15.tagname='undefined';
$expr_l10_c15.line=10;
$expr_l10_c15.column=15;
function $log_l10_c5(_event){
this.log("TEST",$expr_l10_c15.apply(this, arguments));
};
$log_l10_c5.tagname='log';
$log_l10_c5.line=10;
$log_l10_c5.column=5;
function $expr_l16_c17(_event){
return 'Starting session ' + _sessionid;
};
$expr_l16_c17.tagname='undefined';
$expr_l16_c17.line=16;
$expr_l16_c17.column=17;
function $log_l16_c7(_event){
this.log("TEST",$expr_l16_c17.apply(this, arguments));
};
$log_l16_c7.tagname='log';
$log_l16_c7.line=16;
$log_l16_c7.column=7;
function $expr_l23_c15(_event){
return 'RESULT: pass';
};
$expr_l23_c15.tagname='undefined';
$expr_l23_c15.line=23;
$expr_l23_c15.column=15;
function $log_l23_c5(_event){
this.log("TEST",$expr_l23_c15.apply(this, arguments));
};
$log_l23_c5.tagname='log';
$log_l23_c5.line=23;
$log_l23_c5.column=5;
function $expr_l29_c15(_event){
return 'RESULT: fail';
};
$expr_l29_c15.tagname='undefined';
$expr_l29_c15.line=29;
$expr_l29_c15.column=15;
function $log_l29_c5(_event){
this.log("TEST",$expr_l29_c15.apply(this, arguments));
};
$log_l29_c5.tagname='log';
$log_l29_c5.line=29;
$log_l29_c5.column=5;
function $data_l5_c22(_event){
return {p1: 'v1', p2: 'v2'};
};
$data_l5_c22.tagname='undefined';
$data_l5_c22.line=5;
$data_l5_c22.column=22;
function $datamodel_l4_c1(_event){
if(typeof o1 === "undefined")  o1 = $data_l5_c22.apply(this, arguments);
};
$datamodel_l4_c1.tagname='datamodel';
$datamodel_l4_c1.line=4;
$datamodel_l4_c1.column=1;
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "initial": "s1",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "uber",
   "$type": "state",
   "transitions": [
    {
     "event": "*",
     "target": "fail",
     "onTransition": $log_l10_c5
    }
   ],
   "states": [
    {
     "id": "s1",
     "$type": "state",
     "transitions": [
      {
       "event": "pass",
       "target": "pass"
      }
     ],
     "onEntry": [
      $log_l16_c7
     ]
    }
   ]
  },
  {
   "id": "pass",
   "$type": "final",
   "onEntry": [
    $log_l23_c5
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l29_c5
   ]
  }
 ],
 "onEntry": [
  $datamodel_l4_c1
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/data/data_obj_literal.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L2RhdGEvZGF0YV9vYmpfbGl0ZXJhbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBVWUseUIsQ0FBbUIsQyxDQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDOzs7Ozs7QUFBcEQsc0Q7Ozs7OztBQU1ZLDBCLENBQW9CLEMsQ0FBRSxVOzs7Ozs7QUFBaEMsc0Q7Ozs7OztBQU9RLHFCOzs7Ozs7QUFBVixzRDs7Ozs7O0FBTVUscUI7Ozs7OztBQUFWLHNEOzs7Ozs7QUF4QmlCLFFBQUMsRUFBRSxDLENBQUUsSUFBSSxDLENBQUUsRUFBRSxDLENBQUUsSUFBSSxDOzs7Ozs7QUFEeEMsd0UifQ==