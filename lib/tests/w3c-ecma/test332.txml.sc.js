//Generated on 2017-9-20 12:40:10 by the SCION SCXML compiler
function machineNameConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'machineName';
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
  Var2 = $serializedDatamodel["Var2"];
}
function $serializeDatamodel(){
   return {
  "Var1" : Var1,
  "Var2" : Var2
   };
}
function $idlocation_l10_c48(_event){
return Var1=$generateSendId.apply(this, arguments);
};
$idlocation_l10_c48.tagname='undefined';
$idlocation_l10_c48.line=10;
$idlocation_l10_c48.column=48;
function $senddata_l10_c6(_event){
return {
};
};
$senddata_l10_c6.tagname='send';
$senddata_l10_c6.line=10;
$senddata_l10_c6.column=6;
function $send_l10_c6(_event){
var _scionTargetRef = "baz";
     this.send(
{
  target: _scionTargetRef,
  name: "foo",
  data: $senddata_l10_c6.apply(this, arguments),
  sendid: $idlocation_l10_c48.apply(this, arguments),
  origin: _sessionid
}, 
       {
           delay: getDelayInMs(null),
       });
};
$send_l10_c6.tagname='send';
$send_l10_c6.line=10;
$send_l10_c6.column=6;
function $expr_l14_c37(_event){
return _event.sendid;
};
$expr_l14_c37.tagname='undefined';
$expr_l14_c37.line=14;
$expr_l14_c37.column=37;
function $assign_l14_c8(_event){
Var2 = $expr_l14_c37.apply(this, arguments);
};
$assign_l14_c8.tagname='assign';
$assign_l14_c8.line=14;
$assign_l14_c8.column=8;
function $cond_l21_c20(_event){
return Var1===Var2;
};
$cond_l21_c20.tagname='undefined';
$cond_l21_c20.line=21;
$cond_l21_c20.column=20;
function $expr_l25_c56(_event){
return 'pass';
};
$expr_l25_c56.tagname='undefined';
$expr_l25_c56.line=25;
$expr_l25_c56.column=56;
function $log_l25_c30(_event){
this.log("Outcome",$expr_l25_c56.apply(this, arguments));
};
$log_l25_c30.tagname='log';
$log_l25_c30.line=25;
$log_l25_c30.column=30;
function $expr_l26_c56(_event){
return 'fail';
};
$expr_l26_c56.tagname='undefined';
$expr_l26_c56.line=26;
$expr_l26_c56.column=56;
function $log_l26_c30(_event){
this.log("Outcome",$expr_l26_c56.apply(this, arguments));
};
$log_l26_c30.tagname='log';
$log_l26_c30.line=26;
$log_l26_c30.column=30;
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "{http://www.w3.org/2000/xmlns/}conf": "http://www.w3.org/2005/scxml-conformance",
 "initial": "s0",
 "name": "machineName",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "s0",
   "$type": "state",
   "onEntry": [
    $send_l10_c6
   ],
   "transitions": [
    {
     "event": "error",
     "target": "s1",
     "onTransition": $assign_l14_c8
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
     "cond": $cond_l21_c20,
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
    $log_l25_c30
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l26_c30
   ]
  }
 ],
 "onEntry": [],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test332.txml.scxml"
};
}
module.exports = machineNameConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QzMzIudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFVZ0QsV0FBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDLENBQUUsU0FBUyxDOzs7Ozs7QUFBcEY7QUFBQSxDOzs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVTs7Ozs7O0FBSStCLGFBQU0sQ0FBQyxNOzs7Ozs7QUFBcEMsNEM7Ozs7OztBQU9ZLFdBQUksR0FBRyxJOzs7Ozs7QUFJNkIsYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUFDMEIsYTs7Ozs7O0FBQTFCLHlEIn0=