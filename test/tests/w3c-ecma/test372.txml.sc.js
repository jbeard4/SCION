//Generated on 2017-9-20 12:41:07 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
var Var1;
function getDelayInMs(delayString){
    if(typeof delayString === 'string') {
        if (delayString.slice(-2) === "ms") {
            return parseFloat(delayString.slice(0, -2));
        } else if (delayString.slice(-1) === "s") {
            return parseFloat(delayString.slice(0, -1)) * 1000;
        } else if (delayString.slice(-1) === "m") {
            return parseFloat(delayString.slice(0, -1)) * 1000 * 60;
        } else {
            return parseFloat(delayString);
        }
    }else if (typeof delayString === 'number'){
        return delayString;
    }else{
        return 0;
    }
}
function $deserializeDatamodel($serializedDatamodel){
  Var1 = $serializedDatamodel["Var1"];
}
function $serializeDatamodel(){
   return {
  "Var1" : Var1
   };
}
function $senddata_l9_c5(_event){
return {
};
};
$senddata_l9_c5.tagname='send';
$senddata_l9_c5.line=9;
$senddata_l9_c5.column=5;
function $send_l9_c5(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "timeout",
  data: $senddata_l9_c5.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs("1s"),
       });
};
$send_l9_c5.tagname='send';
$send_l9_c5.line=9;
$send_l9_c5.column=5;
function $cond_l11_c42(_event){
return Var1==2;
};
$cond_l11_c42.tagname='undefined';
$cond_l11_c42.line=11;
$cond_l11_c42.column=42;
function $expr_l19_c35(_event){
return 3;
};
$expr_l19_c35.tagname='undefined';
$expr_l19_c35.line=19;
$expr_l19_c35.column=35;
function $assign_l19_c6(_event){
Var1 = $expr_l19_c35.apply(this, arguments);
};
$assign_l19_c6.tagname='assign';
$assign_l19_c6.line=19;
$assign_l19_c6.column=6;
function $expr_l16_c35(_event){
return 2;
};
$expr_l16_c35.tagname='undefined';
$expr_l16_c35.line=16;
$expr_l16_c35.column=35;
function $assign_l16_c6(_event){
Var1 = $expr_l16_c35.apply(this, arguments);
};
$assign_l16_c6.tagname='assign';
$assign_l16_c6.line=16;
$assign_l16_c6.column=6;
function $expr_l25_c53(_event){
return 'pass';
};
$expr_l25_c53.tagname='undefined';
$expr_l25_c53.line=25;
$expr_l25_c53.column=53;
function $log_l25_c27(_event){
this.log("Outcome",$expr_l25_c53.apply(this, arguments));
};
$log_l25_c27.tagname='log';
$log_l25_c27.line=25;
$log_l25_c27.column=27;
function $expr_l26_c53(_event){
return 'fail';
};
$expr_l26_c53.tagname='undefined';
$expr_l26_c53.line=26;
$expr_l26_c53.column=53;
function $log_l26_c27(_event){
this.log("Outcome",$expr_l26_c53.apply(this, arguments));
};
$log_l26_c27.tagname='log';
$log_l26_c27.line=26;
$log_l26_c27.column=27;
function $data_l4_c24(_event){
return 1;
};
$data_l4_c24.tagname='undefined';
$data_l4_c24.line=4;
$data_l4_c24.column=24;
function $datamodel_l3_c1(_event){
if(typeof Var1 === "undefined")  Var1 = $data_l4_c24.apply(this, arguments);
};
$datamodel_l3_c1.tagname='datamodel';
$datamodel_l3_c1.line=3;
$datamodel_l3_c1.column=1;
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "{http://www.w3.org/2000/xmlns/}conf": "http://www.w3.org/2005/scxml-conformance",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "s0",
   "initial": "s0final",
   "$type": "state",
   "onEntry": [
    $send_l9_c5
   ],
   "transitions": [
    {
     "event": "done.state.s0",
     "cond": $cond_l11_c42,
     "target": "pass"
    },
    {
     "event": "*",
     "target": "fail"
    }
   ],
   "states": [
    {
     "id": "s0final",
     "$type": "final",
     "onEntry": [
      $assign_l16_c6
     ],
     "onExit": [
      $assign_l19_c6
     ]
    }
   ]
  },
  {
   "id": "pass",
   "$type": "final",
   "onEntry": [
    $log_l25_c27
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l26_c27
   ]
  }
 ],
 "onEntry": [
  $datamodel_l3_c1
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test372.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QzNzIudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFTSztBQUFBLEM7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVOzs7Ozs7QUFFcUMsV0FBSSxFQUFFLEM7Ozs7OztBQVFiLFE7Ozs7OztBQUE3Qiw0Qzs7Ozs7O0FBSDZCLFE7Ozs7OztBQUE3Qiw0Qzs7Ozs7O0FBUytDLGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBQzBCLGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBdEJILFE7Ozs7OztBQUR2Qiw0RSJ9