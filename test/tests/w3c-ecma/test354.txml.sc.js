//Generated on 2017-9-20 12:40:54 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
var Var1, Var2, Var3;
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
  Var3 = $serializedDatamodel["Var3"];
}
function $serializeDatamodel(){
   return {
  "Var1" : Var1,
  "Var2" : Var2,
  "Var3" : Var3
   };
}
function $senddata_l10_c6(_event){
return {
};
};
$senddata_l10_c6.tagname='send';
$senddata_l10_c6.line=10;
$senddata_l10_c6.column=6;
function $send_l10_c6(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "timeout",
  data: $senddata_l10_c6.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs("5s"),
       });
};
$send_l10_c6.tagname='send';
$send_l10_c6.line=10;
$send_l10_c6.column=6;
function $expr_l12_c33(_event){
return 2;
};
$expr_l12_c33.tagname='undefined';
$expr_l12_c33.line=12;
$expr_l12_c33.column=33;
function $senddata_l11_c5(_event){
return {
"Var1":Var1,
"param1":$expr_l12_c33.apply(this, arguments)};
};
$senddata_l11_c5.tagname='send';
$senddata_l11_c5.line=11;
$senddata_l11_c5.column=5;
function $send_l11_c5(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "event1",
  data: $senddata_l11_c5.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs(null),
  type: "http://www.w3.org/TR/scxml/#SCXMLEventProcessor",
       });
};
$send_l11_c5.tagname='send';
$send_l11_c5.line=11;
$send_l11_c5.column=5;
function $expr_l16_c34(_event){
return _event.data.Var1;
};
$expr_l16_c34.tagname='undefined';
$expr_l16_c34.line=16;
$expr_l16_c34.column=34;
function $assign_l16_c5(_event){
Var2 = $expr_l16_c34.apply(this, arguments);
};
$assign_l16_c5.tagname='assign';
$assign_l16_c5.line=16;
$assign_l16_c5.column=5;
function $expr_l17_c34(_event){
return _event.data.param1;
};
$expr_l17_c34.tagname='undefined';
$expr_l17_c34.line=17;
$expr_l17_c34.column=34;
function $assign_l17_c5(_event){
Var3 = $expr_l17_c34.apply(this, arguments);
};
$assign_l17_c5.tagname='assign';
$assign_l17_c5.line=17;
$assign_l17_c5.column=5;
function $cond_l26_c20(_event){
return Var2==1;
};
$cond_l26_c20.tagname='undefined';
$cond_l26_c20.line=26;
$cond_l26_c20.column=20;
function $cond_l31_c22(_event){
return Var3==2;
};
$cond_l31_c22.tagname='undefined';
$cond_l31_c22.line=31;
$cond_l31_c22.column=22;
function $senddata_l37_c6(_event){
return {
};
};
$senddata_l37_c6.tagname='send';
$senddata_l37_c6.line=37;
$senddata_l37_c6.column=6;
function $send_l37_c6(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "timeout",
  data: $senddata_l37_c6.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs("5s"),
       });
};
$send_l37_c6.tagname='send';
$send_l37_c6.line=37;
$send_l37_c6.column=6;
function $content_l39_c15(_event){
return 123;
};
$content_l39_c15.tagname='undefined';
$content_l39_c15.line=39;
$content_l39_c15.column=15;
function $send_l38_c5(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "event2",
  data: $content_l39_c15.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs(null),
       });
};
$send_l38_c5.tagname='send';
$send_l38_c5.line=38;
$send_l38_c5.column=5;
function $cond_l42_c35(_event){
return _event.data == 123;
};
$cond_l42_c35.tagname='undefined';
$cond_l42_c35.line=42;
$cond_l42_c35.column=35;
function $expr_l48_c56(_event){
return 'pass';
};
$expr_l48_c56.tagname='undefined';
$expr_l48_c56.line=48;
$expr_l48_c56.column=56;
function $log_l48_c30(_event){
this.log("Outcome",$expr_l48_c56.apply(this, arguments));
};
$log_l48_c30.tagname='log';
$log_l48_c30.line=48;
$log_l48_c30.column=30;
function $expr_l49_c56(_event){
return 'fail';
};
$expr_l49_c56.tagname='undefined';
$expr_l49_c56.line=49;
$expr_l49_c56.column=56;
function $log_l49_c30(_event){
this.log("Outcome",$expr_l49_c56.apply(this, arguments));
};
$log_l49_c30.tagname='log';
$log_l49_c30.line=49;
$log_l49_c30.column=30;
function $data_l3_c24(_event){
return 1;
};
$data_l3_c24.tagname='undefined';
$data_l3_c24.line=3;
$data_l3_c24.column=24;
function $datamodel_l2_c1(_event){
if(typeof Var1 === "undefined")  Var1 = $data_l3_c24.apply(this, arguments);
};
$datamodel_l2_c1.tagname='datamodel';
$datamodel_l2_c1.line=2;
$datamodel_l2_c1.column=1;
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
    $send_l10_c6,
    $send_l11_c5
   ],
   "transitions": [
    {
     "event": "event1",
     "target": "s1",
     "onTransition": [
      $assign_l16_c5,
      $assign_l17_c5
     ]
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
     "cond": $cond_l26_c20,
     "target": "s2"
    },
    {
     "target": "fail"
    }
   ]
  },
  {
   "id": "s2",
   "$type": "state",
   "transitions": [
    {
     "cond": $cond_l31_c22,
     "target": "s3"
    },
    {
     "target": "fail"
    }
   ]
  },
  {
   "id": "s3",
   "$type": "state",
   "onEntry": [
    $send_l37_c6,
    $send_l38_c5
   ],
   "transitions": [
    {
     "event": "event2",
     "cond": $cond_l42_c35,
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
    $log_l48_c30
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l49_c30
   ]
  }
 ],
 "onEntry": [
  $datamodel_l2_c1
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test354.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QzNTQudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBVU07QUFBQSxDOzs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVTs7Ozs7O0FBRTJCLFE7Ozs7OztBQUQ1QjtBQUFBO0FBQUEsOEM7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFU7Ozs7OztBQUs2QixhQUFNLENBQUMsSUFBSSxDQUFDLEk7Ozs7OztBQUF6Qyw0Qzs7Ozs7O0FBQzZCLGFBQU0sQ0FBQyxJQUFJLENBQUMsTTs7Ozs7O0FBQXpDLDRDOzs7Ozs7QUFTZSxXQUFJLEVBQUUsQzs7Ozs7O0FBS0osV0FBSSxFQUFFLEM7Ozs7OztBQU10QjtBQUFBLEM7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVOzs7Ozs7QUFFUyxVOzs7Ozs7QUFEVjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVTs7Ozs7O0FBSThCLGFBQU0sQ0FBQyxJLENBQUssRSxDQUFHLEc7Ozs7OztBQU1NLGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBQzBCLGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBOUNOLFE7Ozs7OztBQUR2Qiw0RSJ9