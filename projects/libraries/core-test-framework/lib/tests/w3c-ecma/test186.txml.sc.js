//Generated on 2017-9-20 12:41:01 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
var Var1, Var2;
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
  Var2 = $serializedDatamodel["Var2"];
}
function $serializeDatamodel(){
   return {
  "Var1" : Var1,
  "Var2" : Var2
   };
}
function $expr_l11_c32(_event){
return Var1;
};
$expr_l11_c32.tagname='undefined';
$expr_l11_c32.line=11;
$expr_l11_c32.column=32;
function $senddata_l10_c4(_event){
return {
"aParam":$expr_l11_c32.apply(this, arguments)};
};
$senddata_l10_c4.tagname='send';
$senddata_l10_c4.line=10;
$senddata_l10_c4.column=4;
function $delayexpr_l10_c35(_event){
return '1s';
};
$delayexpr_l10_c35.tagname='undefined';
$delayexpr_l10_c35.line=10;
$delayexpr_l10_c35.column=35;
function $send_l10_c4(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "event1",
  data: $senddata_l10_c4.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs($delayexpr_l10_c35.apply(this, arguments)),
       });
};
$send_l10_c4.tagname='send';
$send_l10_c4.line=10;
$send_l10_c4.column=4;
function $expr_l13_c33(_event){
return 2;
};
$expr_l13_c33.tagname='undefined';
$expr_l13_c33.line=13;
$expr_l13_c33.column=33;
function $assign_l13_c4(_event){
Var1 = $expr_l13_c33.apply(this, arguments);
};
$assign_l13_c4.tagname='assign';
$assign_l13_c4.line=13;
$assign_l13_c4.column=4;
function $expr_l17_c34(_event){
return _event.data.aParam;
};
$expr_l17_c34.tagname='undefined';
$expr_l17_c34.line=17;
$expr_l17_c34.column=34;
function $assign_l17_c5(_event){
Var2 = $expr_l17_c34.apply(this, arguments);
};
$assign_l17_c5.tagname='assign';
$assign_l17_c5.line=17;
$assign_l17_c5.column=5;
function $cond_l23_c20(_event){
return Var2==1;
};
$cond_l23_c20.tagname='undefined';
$cond_l23_c20.line=23;
$cond_l23_c20.column=20;
function $expr_l27_c56(_event){
return 'pass';
};
$expr_l27_c56.tagname='undefined';
$expr_l27_c56.line=27;
$expr_l27_c56.column=56;
function $log_l27_c30(_event){
this.log("Outcome",$expr_l27_c56.apply(this, arguments));
};
$log_l27_c30.tagname='log';
$log_l27_c30.line=27;
$log_l27_c30.column=30;
function $expr_l28_c56(_event){
return 'fail';
};
$expr_l28_c56.tagname='undefined';
$expr_l28_c56.line=28;
$expr_l28_c56.column=56;
function $log_l28_c30(_event){
this.log("Outcome",$expr_l28_c56.apply(this, arguments));
};
$log_l28_c30.tagname='log';
$log_l28_c30.line=28;
$log_l28_c30.column=30;
function $data_l4_c23(_event){
return 1;
};
$data_l4_c23.tagname='undefined';
$data_l4_c23.line=4;
$data_l4_c23.column=23;
function $datamodel_l3_c1(_event){
if(typeof Var1 === "undefined")  Var1 = $data_l4_c23.apply(this, arguments);
};
$datamodel_l3_c1.tagname='datamodel';
$datamodel_l3_c1.line=3;
$datamodel_l3_c1.column=1;
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "{http://www.w3.org/2000/xmlns/}conf": "http://www.w3.org/2005/scxml-conformance",
 "initial": "s0",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "s0",
   "$type": "state",
   "onEntry": [
    $send_l10_c4,
    $assign_l13_c4
   ],
   "transitions": [
    {
     "event": "event1",
     "target": "s1",
     "onTransition": $assign_l17_c5
    },
    {
     "event": "*",
     "target": "fail"
    }
   ]
  },
  {
   "id": "s1",
   "$type": "state",
   "transitions": [
    {
     "cond": $cond_l23_c20,
     "target": "pass"
    },
    {
     "target": "fail"
    }
   ]
  },
  {
   "id": "pass",
   "$type": "final",
   "onEntry": [
    $log_l27_c30
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l28_c30
   ]
  }
 ],
 "onEntry": [
  $datamodel_l3_c1
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test186.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QxODYudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVdnQyxXOzs7Ozs7QUFENUI7QUFBQSw4Qzs7Ozs7O0FBQStCLFc7Ozs7OztBQUEvQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVTs7Ozs7O0FBRzZCLFE7Ozs7OztBQUE3Qiw0Qzs7Ozs7O0FBSThCLGFBQU0sQ0FBQyxJQUFJLENBQUMsTTs7Ozs7O0FBQXpDLDRDOzs7Ozs7QUFNZSxXQUFJLEVBQUUsQzs7Ozs7O0FBSThCLGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBQzBCLGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBeEJQLFE7Ozs7OztBQUR0Qiw0RSJ9