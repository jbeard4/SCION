//Generated on 2017-9-20 12:42:16 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
var httpid;
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
      var $sendIdAccumulator =  ["$scion.sendid0"] ;
      function $generateSendId(){
        var id;
        do{
          id = "$scion" + ".sendid_" + $sendIdCounter++; //make sure we dont clobber an existing sendid or invokeid
        } while($sendIdAccumulator.indexOf(id) > -1)
        return id;
      };
      function $deserializeDatamodel($serializedDatamodel){
  httpid = $serializedDatamodel["httpid"];
}
function $serializeDatamodel(){
   return {
  "httpid" : httpid
   };
}
function $senddata_l14_c9(_event){
return {
};
};
$senddata_l14_c9.tagname='send';
$senddata_l14_c9.line=14;
$senddata_l14_c9.column=9;
function $send_l14_c9(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "ignore",
  data: $senddata_l14_c9.apply(this, arguments),
  sendid: "$scion.sendid0",
  origin: _sessionid
}, 
       {
           delay: getDelayInMs("1ms"),
  type: "http://www.w3.org/TR/scxml/#SCXMLEventProcessor",
       });
};
$send_l14_c9.tagname='send';
$send_l14_c9.line=14;
$send_l14_c9.column=9;
function $idlocation_l15_c26(_event){
return httpid=$generateSendId.apply(this, arguments);
};
$idlocation_l15_c26.tagname='undefined';
$idlocation_l15_c26.line=15;
$idlocation_l15_c26.column=26;
function $senddata_l15_c9(_event){
return {
};
};
$senddata_l15_c9.tagname='send';
$senddata_l15_c9.line=15;
$senddata_l15_c9.column=9;
function $send_l15_c9(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: "ignore",
  data: $senddata_l15_c9.apply(this, arguments),
  sendid: $idlocation_l15_c26.apply(this, arguments),
  origin: _sessionid
}, 
       {
           delay: getDelayInMs("2ms"),
  type: "http://www.w3.org/TR/scxml/#SCXMLEventProcessor",
       });
};
$send_l15_c9.tagname='send';
$send_l15_c9.line=15;
$send_l15_c9.column=9;
function $expr_l21_c34(_event){
return httpid;
};
$expr_l21_c34.tagname='undefined';
$expr_l21_c34.line=21;
$expr_l21_c34.column=34;
function $log_l21_c9(_event){
this.log("httpid",$expr_l21_c34.apply(this, arguments));
};
$log_l21_c9.tagname='log';
$log_l21_c9.line=21;
$log_l21_c9.column=9;
function $cond_l23_c49(_event){
return httpid !== 'foo' && httpid !== '$scion.sendid0';
};
$cond_l23_c49.tagname='undefined';
$cond_l23_c49.line=23;
$cond_l23_c49.column=49;
function $expr_l33_c17(_event){
return 'RESULT: pass';
};
$expr_l33_c17.tagname='undefined';
$expr_l33_c17.line=33;
$expr_l33_c17.column=17;
function $log_l33_c7(_event){
this.log("TEST",$expr_l33_c17.apply(this, arguments));
};
$log_l33_c7.tagname='log';
$log_l33_c7.line=33;
$log_l33_c7.column=7;
function $expr_l39_c17(_event){
return 'RESULT: fail';
};
$expr_l39_c17.tagname='undefined';
$expr_l39_c17.line=39;
$expr_l39_c17.column=17;
function $log_l39_c7(_event){
this.log("TEST",$expr_l39_c17.apply(this, arguments));
};
$log_l39_c7.tagname='log';
$log_l39_c7.line=39;
$log_l39_c7.column=7;
function $data_l5_c28(_event){
return 'foo';
};
$data_l5_c28.tagname='undefined';
$data_l5_c28.line=5;
$data_l5_c28.column=28;
function $datamodel_l4_c3(_event){
if(typeof httpid === "undefined")  httpid = $data_l5_c28.apply(this, arguments);
};
$datamodel_l4_c3.tagname='datamodel';
$datamodel_l4_c3.line=4;
$datamodel_l4_c3.column=3;
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "initial": "uber",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "uber",
   "$type": "state",
   "states": [
    {
     "id": "s0",
     "$type": "state",
     "onEntry": [
      $send_l14_c9,
      $send_l15_c9
     ],
     "transitions": [
      {
       "event": "t1",
       "target": "s1"
      }
     ]
    },
    {
     "id": "s1",
     "$type": "state",
     "onEntry": [
      $log_l21_c9
     ],
     "transitions": [
      {
       "event": "t2",
       "target": "pass",
       "cond": $cond_l23_c49
      },
      {
       "event": "t2",
       "target": "fail"
      }
     ]
    },
    {
     "id": "s2",
     "$type": "state",
     "transitions": [
      {
       "event": "t2",
       "target": "pass"
      }
     ]
    }
   ]
  },
  {
   "id": "pass",
   "$type": "final",
   "onEntry": [
    $log_l33_c7
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l39_c7
   ]
  }
 ],
 "onEntry": [
  $datamodel_l4_c3
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/send-idlocation/test0.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3NlbmQtaWRsb2NhdGlvbi90ZXN0MC5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBY1M7QUFBQSxDOzs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVOzs7Ozs7QUFDaUIsYUFBTSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDLENBQUUsU0FBUyxDOzs7Ozs7QUFBN0Q7QUFBQSxDOzs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVOzs7Ozs7QUFNeUIsYTs7Ozs7O0FBQXpCLHdEOzs7Ozs7QUFFd0MsYSxDQUFPLEcsQ0FBSSxLLENBQU0sRSxDQUFHLE0sQ0FBTyxHLENBQUksZ0I7Ozs7OztBQVUvRCxxQjs7Ozs7O0FBQVYsc0Q7Ozs7OztBQU1VLHFCOzs7Ozs7QUFBVixzRDs7Ozs7O0FBbENxQixZOzs7Ozs7QUFEekIsZ0YifQ==