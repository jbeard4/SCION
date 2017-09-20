//Generated on 2017-9-20 12:40:34 by the SCION SCXML compiler
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
function $senddata_l6_c4(_event){
return {
};
};
$senddata_l6_c4.tagname='send';
$senddata_l6_c4.line=6;
$senddata_l6_c4.column=4;
function $send_l6_c4(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "timeout",
  data: $senddata_l6_c4.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs("2s"),
       });
};
$send_l6_c4.tagname='send';
$send_l6_c4.line=6;
$send_l6_c4.column=4;
function $raise_l7_c4(_event){
this.raise({ name:"e1", data : null});
};
$raise_l7_c4.tagname='raise';
$raise_l7_c4.line=7;
$raise_l7_c4.column=4;
function $raise_l8_c4(_event){
this.raise({ name:"e2", data : null});
};
$raise_l8_c4.tagname='raise';
$raise_l8_c4.line=8;
$raise_l8_c4.column=4;
function $expr_l12_c35(_event){
return 1;
};
$expr_l12_c35.tagname='undefined';
$expr_l12_c35.line=12;
$expr_l12_c35.column=35;
function $assign_l12_c6(_event){
Var1 = $expr_l12_c35.apply(this, arguments);
};
$assign_l12_c6.tagname='assign';
$assign_l12_c6.line=12;
$assign_l12_c6.column=6;
function $cond_l37_c42(_event){
return Var1==1;
};
$cond_l37_c42.tagname='undefined';
$cond_l37_c42.line=37;
$cond_l37_c42.column=42;
function $expr_l41_c56(_event){
return 'pass';
};
$expr_l41_c56.tagname='undefined';
$expr_l41_c56.line=41;
$expr_l41_c56.column=56;
function $log_l41_c30(_event){
this.log("Outcome",$expr_l41_c56.apply(this, arguments));
};
$log_l41_c30.tagname='log';
$log_l41_c30.line=41;
$log_l41_c30.column=30;
function $expr_l42_c56(_event){
return 'fail';
};
$expr_l42_c56.tagname='undefined';
$expr_l42_c56.line=42;
$expr_l42_c56.column=56;
function $log_l42_c30(_event){
this.log("Outcome",$expr_l42_c56.apply(this, arguments));
};
$log_l42_c30.tagname='log';
$log_l42_c30.line=42;
$log_l42_c30.column=30;
function $data_l2_c26(_event){
return 0;
};
$data_l2_c26.tagname='undefined';
$data_l2_c26.line=2;
$data_l2_c26.column=26;
function $datamodel_l1_c3(_event){
if(typeof Var1 === "undefined")  Var1 = $data_l2_c26.apply(this, arguments);
};
$datamodel_l1_c3.tagname='datamodel';
$datamodel_l1_c3.line=1;
$datamodel_l1_c3.column=3;
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "{http://www.w3.org/2000/xmlns/}conf": "http://www.w3.org/2005/scxml-conformance",
 "initial": "p0",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "p0",
   "$type": "parallel",
   "onEntry": [
    $send_l6_c4,
    $raise_l7_c4,
    $raise_l8_c4
   ],
   "transitions": [
    {
     "event": "done.state.p0s1",
     "onTransition": $assign_l12_c6
    },
    {
     "event": "done.state.p0s2",
     "target": "s1"
    },
    {
     "event": "timeout",
     "target": "fail"
    }
   ],
   "states": [
    {
     "id": "p0s1",
     "initial": "p0s11",
     "$type": "state",
     "states": [
      {
       "id": "p0s11",
       "$type": "state",
       "transitions": [
        {
         "event": "e1",
         "target": "p0s1final"
        }
       ]
      },
      {
       "id": "p0s1final",
       "$type": "final"
      }
     ]
    },
    {
     "id": "p0s2",
     "initial": "p0s21",
     "$type": "state",
     "states": [
      {
       "id": "p0s21",
       "$type": "state",
       "transitions": [
        {
         "event": "e2",
         "target": "p0s2final"
        }
       ]
      },
      {
       "id": "p0s2final",
       "$type": "final"
      }
     ]
    }
   ]
  },
  {
   "id": "s1",
   "$type": "state",
   "transitions": [
    {
     "event": "done.state.p0",
     "cond": $cond_l37_c42,
     "target": "pass"
    },
    {
     "event": "*",
     "target": "fail"
    }
   ]
  },
  {
   "id": "pass",
   "$type": "final",
   "onEntry": [
    $log_l41_c30
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l42_c30
   ]
  }
 ],
 "onEntry": [
  $datamodel_l1_c3
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test570.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3Q1NzAudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFNSTtBQUFBLEM7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVOzs7Ozs7QUFDQSxzQzs7Ozs7O0FBQ0Esc0M7Ozs7OztBQUkrQixROzs7Ozs7QUFBN0IsNEM7Ozs7OztBQXlCb0MsV0FBSSxFQUFFLEM7Ozs7OztBQUlRLGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBQzBCLGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBeENKLFE7Ozs7OztBQUR2Qiw0RSJ9