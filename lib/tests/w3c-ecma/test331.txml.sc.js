//Generated on 2017-9-20 12:40:20 by the SCION SCXML compiler
function machineNameConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'machineName';
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
function $raise_l10_c6(_event){
this.raise({ name:"foo", data : null});
};
$raise_l10_c6.tagname='raise';
$raise_l10_c6.line=10;
$raise_l10_c6.column=6;
function $expr_l13_c35(_event){
return _event.type;
};
$expr_l13_c35.tagname='undefined';
$expr_l13_c35.line=13;
$expr_l13_c35.column=35;
function $assign_l13_c6(_event){
Var1 = $expr_l13_c35.apply(this, arguments);
};
$assign_l13_c6.tagname='assign';
$assign_l13_c6.line=13;
$assign_l13_c6.column=6;
function $cond_l19_c20(_event){
return Var1=='internal';
};
$cond_l19_c20.tagname='undefined';
$cond_l19_c20.line=19;
$cond_l19_c20.column=20;
function $script_l26_c6(_event){
throw new Error("Assignment to location not declared in the datamodel:foo.bar.baz ")
};
$script_l26_c6.tagname='script';
$script_l26_c6.line=26;
$script_l26_c6.column=6;
function $expr_l29_c35(_event){
return _event.type;
};
$expr_l29_c35.tagname='undefined';
$expr_l29_c35.line=29;
$expr_l29_c35.column=35;
function $assign_l29_c6(_event){
Var1 = $expr_l29_c35.apply(this, arguments);
};
$assign_l29_c6.tagname='assign';
$assign_l29_c6.line=29;
$assign_l29_c6.column=6;
function $cond_l35_c20(_event){
return Var1=='platform';
};
$cond_l35_c20.tagname='undefined';
$cond_l35_c20.line=35;
$cond_l35_c20.column=20;
function $senddata_l42_c6(_event){
return {
};
};
$senddata_l42_c6.tagname='send';
$senddata_l42_c6.line=42;
$senddata_l42_c6.column=6;
function $send_l42_c6(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "foo",
  data: $senddata_l42_c6.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs(null),
       });
};
$send_l42_c6.tagname='send';
$send_l42_c6.line=42;
$send_l42_c6.column=6;
function $expr_l45_c33(_event){
return _event.type;
};
$expr_l45_c33.tagname='undefined';
$expr_l45_c33.line=45;
$expr_l45_c33.column=33;
function $assign_l45_c4(_event){
Var1 = $expr_l45_c33.apply(this, arguments);
};
$assign_l45_c4.tagname='assign';
$assign_l45_c4.line=45;
$assign_l45_c4.column=4;
function $cond_l51_c20(_event){
return Var1=='external';
};
$cond_l51_c20.tagname='undefined';
$cond_l51_c20.line=51;
$cond_l51_c20.column=20;
function $expr_l56_c55(_event){
return 'pass';
};
$expr_l56_c55.tagname='undefined';
$expr_l56_c55.line=56;
$expr_l56_c55.column=55;
function $log_l56_c29(_event){
this.log("Outcome",$expr_l56_c55.apply(this, arguments));
};
$log_l56_c29.tagname='log';
$log_l56_c29.line=56;
$log_l56_c29.column=29;
function $expr_l57_c55(_event){
return 'fail';
};
$expr_l57_c55.tagname='undefined';
$expr_l57_c55.line=57;
$expr_l57_c55.column=55;
function $log_l57_c29(_event){
this.log("Outcome",$expr_l57_c55.apply(this, arguments));
};
$log_l57_c29.tagname='log';
$log_l57_c29.line=57;
$log_l57_c29.column=29;
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
    $raise_l10_c6
   ],
   "transitions": [
    {
     "event": "foo",
     "target": "s1",
     "onTransition": $assign_l13_c6
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
     "cond": $cond_l19_c20,
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
   "onEntry": [
    $script_l26_c6
   ],
   "transitions": [
    {
     "event": "error",
     "target": "s3",
     "onTransition": $assign_l29_c6
    },
    {
     "event": "*",
     "target": "fail"
    }
   ]
  },
  {
   "id": "s3",
   "$type": "state",
   "transitions": [
    {
     "cond": $cond_l35_c20,
     "target": "s4"
    },
    {
     "target": "fail"
    }
   ]
  },
  {
   "id": "s4",
   "$type": "state",
   "onEntry": [
    $send_l42_c6
   ],
   "transitions": [
    {
     "event": "foo",
     "target": "s5",
     "onTransition": $assign_l45_c4
    },
    {
     "event": "*",
     "target": "fail"
    }
   ]
  },
  {
   "id": "s5",
   "$type": "state",
   "transitions": [
    {
     "cond": $cond_l51_c20,
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
    $log_l56_c29
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l57_c29
   ]
  }
 ],
 "onEntry": [],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test331.txml.scxml"
};
}
module.exports = machineNameConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QzMzEudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFVTSx1Qzs7Ozs7O0FBRzZCLGFBQU0sQ0FBQyxJOzs7Ozs7QUFBcEMsNEM7Ozs7OztBQU1jLFdBQUksRUFBRSxVOzs7Ozs7QUFPcEIsSyxDQUFNLEcsQ0FBSSxLQUFLLENBQUMsbUVBQW1FLEM7Ozs7OztBQUd0RCxhQUFNLENBQUMsSTs7Ozs7O0FBQXBDLDRDOzs7Ozs7QUFNYyxXQUFJLEVBQUUsVTs7Ozs7O0FBT3BCO0FBQUEsQzs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFU7Ozs7OztBQUcyQixhQUFNLENBQUMsSTs7Ozs7O0FBQXBDLDRDOzs7Ozs7QUFNZ0IsV0FBSSxFQUFFLFU7Ozs7OztBQUs2QixhOzs7Ozs7QUFBMUIseUQ7Ozs7OztBQUMwQixhOzs7Ozs7QUFBMUIseUQifQ==