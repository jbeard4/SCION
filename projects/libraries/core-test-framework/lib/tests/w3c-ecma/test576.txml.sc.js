//Generated on 2017-9-20 12:41:22 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
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

}
function $serializeDatamodel(){
   return {

   };
}
function $senddata_l10_c5(_event){
return {
};
};
$senddata_l10_c5.tagname='send';
$senddata_l10_c5.line=10;
$senddata_l10_c5.column=5;
function $send_l10_c5(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "timeout",
  data: $senddata_l10_c5.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs("1s"),
       });
};
$send_l10_c5.tagname='send';
$send_l10_c5.line=10;
$send_l10_c5.column=5;
function $raise_l20_c14(_event){
this.raise({ name:"In-s11p112", data : null});
};
$raise_l20_c14.tagname='raise';
$raise_l20_c14.line=20;
$raise_l20_c14.column=14;
function $expr_l34_c53(_event){
return 'pass';
};
$expr_l34_c53.tagname='undefined';
$expr_l34_c53.line=34;
$expr_l34_c53.column=53;
function $log_l34_c27(_event){
this.log("Outcome",$expr_l34_c53.apply(this, arguments));
};
$log_l34_c27.tagname='log';
$log_l34_c27.line=34;
$log_l34_c27.column=27;
function $expr_l35_c53(_event){
return 'fail';
};
$expr_l35_c53.tagname='undefined';
$expr_l35_c53.line=35;
$expr_l35_c53.column=53;
function $log_l35_c27(_event){
this.log("Outcome",$expr_l35_c53.apply(this, arguments));
};
$log_l35_c27.tagname='log';
$log_l35_c27.line=35;
$log_l35_c27.column=27;
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "{http://www.w3.org/2000/xmlns/}conf": "http://www.w3.org/2005/scxml-conformance",
 "initial": [
  "s11p112",
  "s11p122"
 ],
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "s0",
   "$type": "state",
   "transitions": [
    {
     "target": "fail"
    }
   ]
  },
  {
   "id": "s1",
   "$type": "state",
   "onEntry": [
    $send_l10_c5
   ],
   "transitions": [
    {
     "event": "timeout",
     "target": "fail"
    }
   ],
   "states": [
    {
     "id": "s11",
     "initial": "s111",
     "$type": "state",
     "states": [
      {
       "id": "s111",
       "$type": "state"
      },
      {
       "id": "s11p1",
       "$type": "parallel",
       "states": [
        {
         "id": "s11p11",
         "initial": "s11p111",
         "$type": "state",
         "states": [
          {
           "id": "s11p111",
           "$type": "state"
          },
          {
           "id": "s11p112",
           "$type": "state",
           "onEntry": [
            $raise_l20_c14
           ]
          }
         ]
        },
        {
         "id": "s11p12",
         "initial": "s11p121",
         "$type": "state",
         "states": [
          {
           "id": "s11p121",
           "$type": "state"
          },
          {
           "id": "s11p122",
           "$type": "state",
           "transitions": [
            {
             "event": "In-s11p112",
             "target": "pass"
            }
           ]
          }
         ]
        }
       ]
      }
     ]
    }
   ]
  },
  {
   "id": "pass",
   "$type": "final",
   "onEntry": [
    $log_l34_c27
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l35_c27
   ]
  }
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/w3c-ecma/test576.txml.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3czYy1lY21hL3Rlc3Q1NzYudHhtbC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVVLO0FBQUEsQzs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFU7Ozs7OztBQVVTLDhDOzs7Ozs7QUFjdUMsYTs7Ozs7O0FBQTFCLHlEOzs7Ozs7QUFDMEIsYTs7Ozs7O0FBQTFCLHlEIn0=