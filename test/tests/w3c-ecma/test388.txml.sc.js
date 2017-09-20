//Generated on 2017-9-20 12:41:04 by the SCION SCXML compiler
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
function $expr_l12_c36(_event){
return Var1 + 1;
};
$expr_l12_c36.tagname='undefined';
$expr_l12_c36.line=12;
$expr_l12_c36.column=36;
function $assign_l12_c7(_event){
Var1 = $expr_l12_c36.apply(this, arguments);
};
$assign_l12_c7.tagname='assign';
$assign_l12_c7.line=12;
$assign_l12_c7.column=7;
function $senddata_l16_c7(_event){
return {
};
};
$senddata_l16_c7.tagname='send';
$senddata_l16_c7.line=16;
$senddata_l16_c7.column=7;
function $send_l16_c7(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "timeout",
  data: $senddata_l16_c7.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs("2s"),
       });
};
$send_l16_c7.tagname='send';
$send_l16_c7.line=16;
$send_l16_c7.column=7;
function $cond_l15_c44(_event){
return Var1==1;
};
$cond_l15_c44.tagname='undefined';
$cond_l15_c44.line=15;
$cond_l15_c44.column=44;
function $cond_l19_c44(_event){
return Var1==2;
};
$cond_l19_c44.tagname='undefined';
$cond_l19_c44.line=19;
$cond_l19_c44.column=44;
function $cond_l20_c39(_event){
return Var1==2;
};
$cond_l20_c39.tagname='undefined';
$cond_l20_c39.line=20;
$cond_l20_c39.column=39;
function $cond_l22_c44(_event){
return Var1==3;
};
$cond_l22_c44.tagname='undefined';
$cond_l22_c44.line=22;
$cond_l22_c44.column=44;
function $cond_l23_c39(_event){
return Var1==3;
};
$cond_l23_c39.tagname='undefined';
$cond_l23_c39.line=23;
$cond_l23_c39.column=39;
function $raise_l35_c11(_event){
this.raise({ name:"entering.s011", data : null});
};
$raise_l35_c11.tagname='raise';
$raise_l35_c11.line=35;
$raise_l35_c11.column=11;
function $raise_l40_c11(_event){
this.raise({ name:"entering.s012", data : null});
};
$raise_l40_c11.tagname='raise';
$raise_l40_c11.line=40;
$raise_l40_c11.column=11;
function $raise_l47_c11(_event){
this.raise({ name:"entering.s021", data : null});
};
$raise_l47_c11.tagname='raise';
$raise_l47_c11.line=47;
$raise_l47_c11.column=11;
function $raise_l52_c11(_event){
this.raise({ name:"entering.s022", data : null});
};
$raise_l52_c11.tagname='raise';
$raise_l52_c11.line=52;
$raise_l52_c11.column=11;
function $expr_l65_c33(_event){
return 'pass';
};
$expr_l65_c33.tagname='undefined';
$expr_l65_c33.line=65;
$expr_l65_c33.column=33;
function $log_l65_c7(_event){
this.log("Outcome",$expr_l65_c33.apply(this, arguments));
};
$log_l65_c7.tagname='log';
$log_l65_c7.line=65;
$log_l65_c7.column=7;
function $expr_l70_c33(_event){
return 'fail';
};
$expr_l70_c33.tagname='undefined';
$expr_l70_c33.line=70;
$expr_l70_c33.column=33;
function $log_l70_c7(_event){
this.log("Outcome",$expr_l70_c33.apply(this, arguments));
};
$log_l70_c7.tagname='log';
$log_l70_c7.line=70;
$log_l70_c7.column=7;
function $data_l8_c26(_event){
return 0;
};
$data_l8_c26.tagname='undefined';
$data_l8_c26.line=8;
$data_l8_c26.column=26;
function $datamodel_l7_c3(_event){
if(typeof Var1 === "undefined")  Var1 = $data_l8_c26.apply(this, arguments);
};
$datamodel_l7_c3.tagname='datamodel';
$datamodel_l7_c3.line=7;
$datamodel_l7_c3.column=3;
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "{http://www.w3.org/2000/xmlns/}conf": "http://www.w3.org/2005/scxml-conformance",
 "initial": "s012",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "s0",
   "initial": "s01",
   "$type": "state",
   "onEntry": [
    $assign_l12_c7
   ],
   "transitions": [
    {
     "event": "entering.s012",
     "cond": $cond_l15_c44,
     "target": "s1",
     "onTransition": $send_l16_c7
    },
    {
     "event": "entering.s012",
     "cond": $cond_l19_c44,
     "target": "s2"
    },
    {
     "event": "entering",
     "cond": $cond_l20_c39,
     "target": "fail"
    },
    {
     "event": "entering.s011",
     "cond": $cond_l22_c44,
     "target": "pass"
    },
    {
     "event": "entering",
     "cond": $cond_l23_c39,
     "target": "fail"
    },
    {
     "event": "timeout",
     "target": "fail"
    }
   ],
   "states": [
    {
     "type": "shallow",
     "id": "s0HistShallow",
     "isDeep": false,
     "$type": "history",
     "transitions": [
      {
       "target": "s02"
      }
     ]
    },
    {
     "type": "deep",
     "id": "s0HistDeep",
     "isDeep": true,
     "$type": "history",
     "transitions": [
      {
       "target": "s022"
      }
     ]
    },
    {
     "id": "s01",
     "initial": "s011",
     "$type": "state",
     "states": [
      {
       "id": "s011",
       "$type": "state",
       "onEntry": [
        $raise_l35_c11
       ]
      },
      {
       "id": "s012",
       "$type": "state",
       "onEntry": [
        $raise_l40_c11
       ]
      }
     ]
    },
    {
     "id": "s02",
     "initial": "s021",
     "$type": "state",
     "states": [
      {
       "id": "s021",
       "$type": "state",
       "onEntry": [
        $raise_l47_c11
       ]
      },
      {
       "id": "s022",
       "$type": "state",
       "onEntry": [
        $raise_l52_c11
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
     "target": "s0HistDeep"
    }
   ]
  },
  {
   "id": "s2",
   "$type": "state",
   "transitions": [
    {
     "target": "s0HistShallow"
    }
   ]
  },
  {
   "id": "pass",
   "$type": "final",
   "onEntry": [
    $log_l65_c7
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l70_c7
   ]
  }
 ],
 "onEntry": [
  $datamodel_l7_c3
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test388.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3QzODgudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFZb0MsVyxDQUFLLEMsQ0FBRSxDOzs7Ozs7QUFBcEMsNEM7Ozs7OztBQUlBO0FBQUEsQzs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFU7Ozs7OztBQURxQyxXQUFJLEVBQUUsQzs7Ozs7O0FBSU4sV0FBSSxFQUFFLEM7Ozs7OztBQUNYLFdBQUksRUFBRSxDOzs7Ozs7QUFFRCxXQUFJLEVBQUUsQzs7Ozs7O0FBQ1gsV0FBSSxFQUFFLEM7Ozs7OztBQVlsQyxpRDs7Ozs7O0FBS0EsaUQ7Ozs7OztBQU9BLGlEOzs7Ozs7QUFLQSxpRDs7Ozs7O0FBYXNCLGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBSzBCLGE7Ozs7OztBQUExQix5RDs7Ozs7O0FBOURtQixROzs7Ozs7QUFEdkIsNEUifQ==