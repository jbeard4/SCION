//Generated on 2017-9-20 12:41:30 by the SCION SCXML compiler
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
function $expr_l8_c33(_event){
return 'http://www.w3.org/TR/scxml/#SCXMLEventProcessor';
};
$expr_l8_c33.tagname='undefined';
$expr_l8_c33.line=8;
$expr_l8_c33.column=33;
function $assign_l8_c4(_event){
Var1 = $expr_l8_c33.apply(this, arguments);
};
$assign_l8_c4.tagname='assign';
$assign_l8_c4.line=8;
$assign_l8_c4.column=4;
function $senddata_l9_c4(_event){
return {
};
};
$senddata_l9_c4.tagname='send';
$senddata_l9_c4.line=9;
$senddata_l9_c4.column=4;
function $typeexpr_l9_c19(_event){
return Var1;
};
$typeexpr_l9_c19.tagname='undefined';
$typeexpr_l9_c19.line=9;
$typeexpr_l9_c19.column=19;
function $send_l9_c4(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "event1",
  data: $senddata_l9_c4.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs(null),
  type: $typeexpr_l9_c19.apply(this, arguments),
       });
};
$send_l9_c4.tagname='send';
$send_l9_c4.line=9;
$send_l9_c4.column=4;
function $expr_l17_c56(_event){
return 'pass';
};
$expr_l17_c56.tagname='undefined';
$expr_l17_c56.line=17;
$expr_l17_c56.column=56;
function $log_l17_c30(_event){
this.log("Outcome",$expr_l17_c56.apply(this, arguments));
};
$log_l17_c30.tagname='log';
$log_l17_c30.line=17;
$log_l17_c30.column=30;
function $expr_l18_c56(_event){
return 'fail';
};
$expr_l18_c56.tagname='undefined';
$expr_l18_c56.line=18;
$expr_l18_c56.column=56;
function $log_l18_c30(_event){
this.log("Outcome",$expr_l18_c56.apply(this, arguments));
};
$log_l18_c30.tagname='log';
$log_l18_c30.line=18;
$log_l18_c30.column=30;
function $data_l3_c24(_event){
return 27;
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
    $assign_l8_c4,
    $send_l9_c4
   ],
   "transitions": [
    {
     "event": "event1",
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
    $log_l17_c30
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l18_c30
   ]
  }
 ],
 "onEntry": [
  $datamodel_l2_c1
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test174.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QxNzQudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFRaUMsd0Q7Ozs7OztBQUE3QiwyQzs7Ozs7O0FBQ0E7QUFBQSxDOzs7Ozs7QUFBZSxXOzs7Ozs7QUFBZjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVOzs7Ozs7QUFRb0QsYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUFDMEIsYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUFmTixTOzs7Ozs7QUFEdkIsNEUifQ==