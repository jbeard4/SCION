//Generated on 2017-9-20 12:40:38 by the SCION SCXML compiler
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

      var $sendIdCounter = 0;
      var $sendIdAccumulator =  [] ;
      function $generateSendId(){
        var id;
        do{
          id = "$scion" + ".sendid_" + $sendIdCounter++; //make sure we dont clobber an existing sendid or invokeid
        } while($sendIdAccumulator.indexOf(id) > -1)
        return id;
      };
      function $deserializeDatamodel($serializedDatamodel){
  Var1 = $serializedDatamodel["Var1"];
}
function $serializeDatamodel(){
   return {
  "Var1" : Var1
   };
}
function $idlocation_l9_c36(_event){
return Var1=$generateSendId.apply(this, arguments);
};
$idlocation_l9_c36.tagname='undefined';
$idlocation_l9_c36.line=9;
$idlocation_l9_c36.column=36;
function $senddata_l9_c4(_event){
return {
};
};
$senddata_l9_c4.tagname='send';
$senddata_l9_c4.line=9;
$senddata_l9_c4.column=4;
function $send_l9_c4(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "event1",
  data: $senddata_l9_c4.apply(this, arguments),
  sendid: $idlocation_l9_c36.apply(this, arguments),
  origin: _sessionid
}, 
       {
           delay: getDelayInMs(null),
       });
};
$send_l9_c4.tagname='send';
$send_l9_c4.line=9;
$send_l9_c4.column=4;
function $cond_l12_c20(_event){
return Var1;
};
$cond_l12_c20.tagname='undefined';
$cond_l12_c20.line=12;
$cond_l12_c20.column=20;
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
    $send_l9_c4
   ],
   "transitions": [
    {
     "cond": $cond_l12_c20,
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
 "onEntry": [],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test183.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QxODMudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBU29DLFdBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLElBQUksQyxDQUFFLFNBQVMsQzs7Ozs7O0FBQTFFO0FBQUEsQzs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFU7Ozs7OztBQUdnQixXOzs7Ozs7QUFLb0MsYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUFDMEIsYTs7Ozs7O0FBQTFCLHlEIn0=