//Generated on 2017-9-20 12:40:40 by the SCION SCXML compiler
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
function $raise_l7_c6(_event){
this.raise({ name:"event1", data : null});
};
$raise_l7_c6.tagname='raise';
$raise_l7_c6.line=7;
$raise_l7_c6.column=6;
function $senddata_l8_c6(_event){
return {
};
};
$senddata_l8_c6.tagname='send';
$senddata_l8_c6.line=8;
$senddata_l8_c6.column=6;
function $send_l8_c6(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "timeout",
  data: $senddata_l8_c6.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs("1s"),
       });
};
$send_l8_c6.tagname='send';
$send_l8_c6.line=8;
$send_l8_c6.column=6;
function $raise_l22_c6(_event){
this.raise({ name:"event2", data : null});
};
$raise_l22_c6.tagname='raise';
$raise_l22_c6.line=22;
$raise_l22_c6.column=6;
function $expr_l39_c32(_event){
return Var1 + 1;
};
$expr_l39_c32.tagname='undefined';
$expr_l39_c32.line=39;
$expr_l39_c32.column=32;
function $assign_l39_c3(_event){
Var1 = $expr_l39_c32.apply(this, arguments);
};
$assign_l39_c3.tagname='assign';
$assign_l39_c3.line=39;
$assign_l39_c3.column=3;
function $cond_l47_c20(_event){
return Var1==2;
};
$cond_l47_c20.tagname='undefined';
$cond_l47_c20.line=47;
$cond_l47_c20.column=20;
function $expr_l51_c53(_event){
return 'pass';
};
$expr_l51_c53.tagname='undefined';
$expr_l51_c53.line=51;
$expr_l51_c53.column=53;
function $log_l51_c27(_event){
this.log("Outcome",$expr_l51_c53.apply(this, arguments));
};
$log_l51_c27.tagname='log';
$log_l51_c27.line=51;
$log_l51_c27.column=27;
function $expr_l52_c53(_event){
return 'fail';
};
$expr_l52_c53.tagname='undefined';
$expr_l52_c53.line=52;
$expr_l52_c53.column=53;
function $log_l52_c27(_event){
this.log("Outcome",$expr_l52_c53.apply(this, arguments));
};
$log_l52_c27.tagname='log';
$log_l52_c27.line=52;
$log_l52_c27.column=27;
function $data_l2_c25(_event){
return 0;
};
$data_l2_c25.tagname='undefined';
$data_l2_c25.line=2;
$data_l2_c25.column=25;
function $datamodel_l1_c3(_event){
if(typeof Var1 === "undefined")  Var1 = $data_l2_c25.apply(this, arguments);
};
$datamodel_l1_c3.tagname='datamodel';
$datamodel_l1_c3.line=1;
$datamodel_l1_c3.column=3;
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "{http://www.w3.org/2000/xmlns/}conf": "http://www.w3.org/2005/scxml-conformance",
 "initial": "s0",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "s0",
   "initial": "p0",
   "$type": "state",
   "onEntry": [
    $raise_l7_c6,
    $send_l8_c6
   ],
   "transitions": [
    {
     "event": "event2",
     "target": "fail"
    },
    {
     "event": "timeout",
     "target": "fail"
    }
   ],
   "states": [
    {
     "id": "p0",
     "$type": "parallel",
     "states": [
      {
       "id": "p0s1",
       "$type": "state",
       "transitions": [
        {
         "event": "event1"
        },
        {
         "event": "event2"
        }
       ]
      },
      {
       "id": "p0s2",
       "$type": "state",
       "transitions": [
        {
         "event": "event1",
         "target": "p0s1",
         "onTransition": $raise_l22_c6
        }
       ]
      },
      {
       "id": "p0s3",
       "$type": "state",
       "transitions": [
        {
         "event": "event1",
         "target": "fail"
        },
        {
         "event": "event2",
         "target": "s1"
        }
       ]
      },
      {
       "id": "p0s4",
       "$type": "state",
       "transitions": [
        {
         "event": "*",
         "onTransition": $assign_l39_c3
        }
       ]
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
     "cond": $cond_l47_c20,
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
    $log_l51_c27
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l52_c27
   ]
  }
 ],
 "onEntry": [
  $datamodel_l1_c3
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test403c.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3Q0MDNjLnR4bWwuc2N4bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBT00sMEM7Ozs7OztBQUNBO0FBQUEsQzs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFU7Ozs7OztBQWNBLDBDOzs7Ozs7QUFpQjBCLFcsQ0FBSyxDLENBQUUsQzs7Ozs7O0FBQXBDLDRDOzs7Ozs7QUFRaUIsV0FBSSxFQUFFLEM7Ozs7OztBQUkyQixhOzs7Ozs7QUFBMUIseUQ7Ozs7OztBQUMwQixhOzs7Ozs7QUFBMUIseUQ7Ozs7OztBQWxERixROzs7Ozs7QUFEdEIsNEUifQ==