//Generated on 2017-9-20 12:41:27 by the SCION SCXML compiler
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
function $senddata_l8_c7(_event){
return {
};
};
$senddata_l8_c7.tagname='send';
$senddata_l8_c7.line=8;
$senddata_l8_c7.column=7;
function $send_l8_c7(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "timeout",
  data: $senddata_l8_c7.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs("2s"),
       });
};
$send_l8_c7.tagname='send';
$send_l8_c7.line=8;
$send_l8_c7.column=7;
function $cond_l11_c24(_event){
return In('sh1');
};
$cond_l11_c24.tagname='undefined';
$cond_l11_c24.line=11;
$cond_l11_c24.column=24;
function $expr_l30_c38(_event){
return Var1 + 1;
};
$expr_l30_c38.tagname='undefined';
$expr_l30_c38.line=30;
$expr_l30_c38.column=38;
function $assign_l30_c9(_event){
Var1 = $expr_l30_c38.apply(this, arguments);
};
$assign_l30_c9.tagname='assign';
$assign_l30_c9.line=30;
$assign_l30_c9.column=9;
function $cond_l26_c24(_event){
return In('sh1');
};
$cond_l26_c24.tagname='undefined';
$cond_l26_c24.line=26;
$cond_l26_c24.column=24;
function $cond_l27_c24(_event){
return Var1==0;
};
$cond_l27_c24.tagname='undefined';
$cond_l27_c24.line=27;
$cond_l27_c24.column=24;
function $cond_l28_c24(_event){
return Var1==1;
};
$cond_l28_c24.tagname='undefined';
$cond_l28_c24.line=28;
$cond_l28_c24.column=24;
function $cond_l22_c26(_event){
return In('sh1');
};
$cond_l22_c26.tagname='undefined';
$cond_l22_c26.line=22;
$cond_l22_c26.column=26;
function $expr_l36_c33(_event){
return 'pass';
};
$expr_l36_c33.tagname='undefined';
$expr_l36_c33.line=36;
$expr_l36_c33.column=33;
function $log_l36_c7(_event){
this.log("Outcome",$expr_l36_c33.apply(this, arguments));
};
$log_l36_c7.tagname='log';
$log_l36_c7.line=36;
$log_l36_c7.column=7;
function $expr_l41_c33(_event){
return 'fail';
};
$expr_l41_c33.tagname='undefined';
$expr_l41_c33.line=41;
$expr_l41_c33.column=33;
function $log_l41_c7(_event){
this.log("Outcome",$expr_l41_c33.apply(this, arguments));
};
$log_l41_c7.tagname='log';
$log_l41_c7.line=41;
$log_l41_c7.column=7;
function $data_l4_c26(_event){
return 0;
};
$data_l4_c26.tagname='undefined';
$data_l4_c26.line=4;
$data_l4_c26.column=26;
function $datamodel_l3_c3(_event){
if(typeof Var1 === "undefined")  Var1 = $data_l4_c26.apply(this, arguments);
};
$datamodel_l3_c3.tagname='datamodel';
$datamodel_l3_c3.line=3;
$datamodel_l3_c3.column=3;
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "{http://www.w3.org/2000/xmlns/}conf": "http://www.w3.org/2005/scxml-conformance",
 "initial": "p1",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "p1",
   "$type": "parallel",
   "onEntry": [
    $send_l8_c7
   ],
   "states": [
    {
     "id": "s0",
     "$type": "state",
     "transitions": [
      {
       "cond": $cond_l11_c24,
       "target": "fail"
      },
      {
       "event": "timeout",
       "target": "fail"
      }
     ]
    },
    {
     "id": "s1",
     "$type": "state",
     "states": [
      {
       "$type": "initial",
       "id": "$generated-initial-0",
       "transitions": [
        {
         "target": "sh1"
        }
       ]
      },
      {
       "id": "sh1",
       "$type": "history",
       "transitions": [
        {
         "target": "s11"
        }
       ]
      },
      {
       "id": "s11",
       "$type": "state",
       "transitions": [
        {
         "cond": $cond_l22_c26,
         "target": "fail"
        },
        {
         "target": "s12"
        }
       ]
      },
      {
       "id": "s12",
       "$type": "state"
      }
     ],
     "transitions": [
      {
       "cond": $cond_l26_c24,
       "target": "fail"
      },
      {
       "cond": $cond_l27_c24,
       "target": "sh1"
      },
      {
       "cond": $cond_l28_c24,
       "target": "pass"
      }
     ],
     "onExit": [
      $assign_l30_c9
     ]
    }
   ]
  },
  {
   "id": "pass",
   "$type": "final",
   "onEntry": [
    $log_l36_c7
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l41_c7
   ]
  }
 ],
 "onEntry": [
  $datamodel_l3_c3
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test580.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3Q1ODAudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFRTztBQUFBLEM7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVOzs7Ozs7QUFHaUIsU0FBRSxDQUFDLEtBQUssQzs7Ozs7O0FBbUJNLFcsQ0FBSyxDLENBQUUsQzs7Ozs7O0FBQXBDLDRDOzs7Ozs7QUFKZSxTQUFFLENBQUMsS0FBSyxDOzs7Ozs7QUFDUixXQUFJLEVBQUUsQzs7Ozs7O0FBQ04sV0FBSSxFQUFFLEM7Ozs7OztBQU5KLFNBQUUsQ0FBQyxLQUFLLEM7Ozs7OztBQWNELGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBSzBCLGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBckNtQixROzs7Ozs7QUFEdkIsNEUifQ==