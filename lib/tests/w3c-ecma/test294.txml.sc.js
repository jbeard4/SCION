//Generated on 2017-9-20 12:39:55 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
var Var1;
function $deserializeDatamodel($serializedDatamodel){
  Var1 = $serializedDatamodel["Var1"];
}
function $serializeDatamodel(){
   return {
  "Var1" : Var1
   };
}
function $cond_l8_c43(_event){
return _event.data['Var1']==1;
};
$cond_l8_c43.tagname='undefined';
$cond_l8_c43.line=8;
$cond_l8_c43.column=43;
function $expr_l19_c31(_event){
return 1;
};
$expr_l19_c31.tagname='undefined';
$expr_l19_c31.line=19;
$expr_l19_c31.column=31;
function $senddata_lundefined_cundefined(_event){
return {
"Var1":$expr_l19_c31.apply(this, arguments)};
};
$senddata_lundefined_cundefined.tagname='undefined';
$senddata_lundefined_cundefined.line=undefined;
$senddata_lundefined_cundefined.column=undefined;
function $cond_l26_c43(_event){
return _event.data == 'foo';
};
$cond_l26_c43.tagname='undefined';
$cond_l26_c43.line=26;
$cond_l26_c43.column=43;
function $content_l37_c15(_event){
return "foo";
};
$content_l37_c15.tagname='undefined';
$content_l37_c15.line=37;
$content_l37_c15.column=15;
function $expr_l42_c53(_event){
return 'pass';
};
$expr_l42_c53.tagname='undefined';
$expr_l42_c53.line=42;
$expr_l42_c53.column=53;
function $log_l42_c27(_event){
this.log("Outcome",$expr_l42_c53.apply(this, arguments));
};
$log_l42_c27.tagname='log';
$log_l42_c27.line=42;
$log_l42_c27.column=27;
function $expr_l43_c53(_event){
return 'fail';
};
$expr_l43_c53.tagname='undefined';
$expr_l43_c53.line=43;
$expr_l43_c53.column=53;
function $log_l43_c27(_event){
this.log("Outcome",$expr_l43_c53.apply(this, arguments));
};
$log_l43_c27.tagname='log';
$log_l43_c27.line=43;
$log_l43_c27.column=27;
function $data_l3_c29(_event){
return 0;
};
$data_l3_c29.tagname='undefined';
$data_l3_c29.line=3;
$data_l3_c29.column=29;
function $datamodel_l2_c2(_event){
if(typeof Var1 === "undefined")  Var1 = $data_l3_c29.apply(this, arguments);
};
$datamodel_l2_c2.tagname='datamodel';
$datamodel_l2_c2.line=2;
$datamodel_l2_c2.column=2;
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "{http://www.w3.org/2000/xmlns/}conf": "http://www.w3.org/2005/scxml-conformance",
 "initial": "s0",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "s0",
   "initial": "s01",
   "$type": "state",
   "transitions": [
    {
     "event": "done.state.s0",
     "cond": $cond_l8_c43,
     "target": "s1"
    },
    {
     "event": "done.state.s0",
     "target": "fail"
    }
   ],
   "states": [
    {
     "id": "s01",
     "$type": "state",
     "transitions": [
      {
       "target": "s02"
      }
     ]
    },
    {
     "id": "s02",
     "$type": "final",
     "donedata": $senddata_lundefined_cundefined
    }
   ]
  },
  {
   "id": "s1",
   "initial": "s11",
   "$type": "state",
   "transitions": [
    {
     "event": "done.state.s1",
     "cond": $cond_l26_c43,
     "target": "pass"
    },
    {
     "event": "done.state.s1",
     "target": "fail"
    }
   ],
   "states": [
    {
     "id": "s11",
     "$type": "state",
     "transitions": [
      {
       "target": "s12"
      }
     ]
    },
    {
     "id": "s12",
     "$type": "final",
     "donedata": $content_l37_c15
    }
   ]
  },
  {
   "id": "pass",
   "$type": "final",
   "onEntry": [
    $log_l42_c27
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l43_c27
   ]
  }
 ],
 "onEntry": [
  $datamodel_l2_c2
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test294.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QyOTQudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBUTJDLGFBQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQzs7Ozs7O0FBV2pDLFE7Ozs7Ozs7Ozs7Ozs7QUFPWSxhQUFNLENBQUMsSSxDQUFLLEUsQ0FBRyxLOzs7Ozs7QUFXM0MsWTs7Ozs7O0FBS3NDLGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBQzBCLGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBeENFLFE7Ozs7OztBQUQzQiw0RSJ9