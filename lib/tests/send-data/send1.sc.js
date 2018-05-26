//Generated on 2017-9-20 12:42:03 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
var foo, bar, bat;
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
  foo = $serializedDatamodel["foo"];
  bar = $serializedDatamodel["bar"];
  bat = $serializedDatamodel["bat"];
}
function $serializeDatamodel(){
   return {
  "foo" : foo,
  "bar" : bar,
  "bat" : bat
   };
}
function $eventexpr_l29_c48(_event){
return 's1';
};
$eventexpr_l29_c48.tagname='undefined';
$eventexpr_l29_c48.line=29;
$eventexpr_l29_c48.column=48;
function $location_l30_c44(_event){
return bat;
};
$location_l30_c44.tagname='undefined';
$location_l30_c44.line=30;
$location_l30_c44.column=44;
function $expr_l31_c41(_event){
return 4;
};
$expr_l31_c41.tagname='undefined';
$expr_l31_c41.line=31;
$expr_l31_c41.column=41;
function $senddata_l29_c13(_event){
return {
"foo":foo,
"bar":bar,
"bif":$location_l30_c44.apply(this, arguments),
"belt":$expr_l31_c41.apply(this, arguments)};
};
$senddata_l29_c13.tagname='send';
$senddata_l29_c13.line=29;
$senddata_l29_c13.column=13;
function $delayexpr_l29_c29(_event){
return '10ms';
};
$delayexpr_l29_c29.tagname='undefined';
$delayexpr_l29_c29.line=29;
$delayexpr_l29_c29.column=29;
function $send_l29_c13(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: $eventexpr_l29_c48.apply(this, arguments),
  data: $senddata_l29_c13.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs($delayexpr_l29_c29.apply(this, arguments)),
       });
};
$send_l29_c13.tagname='send';
$send_l29_c13.line=29;
$send_l29_c13.column=13;
function $eventexpr_l43_c48(_event){
return 's2';
};
$eventexpr_l43_c48.tagname='undefined';
$eventexpr_l43_c48.line=43;
$eventexpr_l43_c48.column=48;
function $content_l44_c25(_event){
return "More content.";
};
$content_l44_c25.tagname='undefined';
$content_l44_c25.line=44;
$content_l44_c25.column=25;
function $delayexpr_l43_c29(_event){
return '10ms';
};
$delayexpr_l43_c29.tagname='undefined';
$delayexpr_l43_c29.line=43;
$delayexpr_l43_c29.column=29;
function $send_l43_c13(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: $eventexpr_l43_c48.apply(this, arguments),
  data: $content_l44_c25.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs($delayexpr_l43_c29.apply(this, arguments)),
       });
};
$send_l43_c13.tagname='send';
$send_l43_c13.line=43;
$send_l43_c13.column=13;
function $cond_l38_c18(_event){
return _event.data.foo === 1 &&
_event.data.bar === 2 &&
_event.data.bif === 3 &&
_event.data.belt === 4;
};
$cond_l38_c18.tagname='undefined';
$cond_l38_c18.line=38;
$cond_l38_c18.column=18;
function $eventexpr_l56_c29(_event){
return 's3';
};
$eventexpr_l56_c29.tagname='undefined';
$eventexpr_l56_c29.line=56;
$eventexpr_l56_c29.column=29;
function $expr_l57_c31(_event){
return 'Hello, world.';
};
$expr_l57_c31.tagname='undefined';
$expr_l57_c31.line=57;
$expr_l57_c31.column=31;
function $send_l56_c13(_event){
var _scionTargetRef = null;
     this.send(
{
  target: _scionTargetRef,
  name: $eventexpr_l56_c29.apply(this, arguments),
  data: $expr_l57_c31.apply(this, arguments),
  sendid: undefined,
  origin: _sessionid
}, 
       {
           delay: getDelayInMs(null),
       });
};
$send_l56_c13.tagname='send';
$send_l56_c13.line=56;
$send_l56_c13.column=13;
function $cond_l55_c18(_event){
return _event.data === 'More content.';
};
$cond_l55_c18.tagname='undefined';
$cond_l55_c18.line=55;
$cond_l55_c18.column=18;
function $expr_l62_c38(_event){
return _event;
};
$expr_l62_c38.tagname='undefined';
$expr_l62_c38.line=62;
$expr_l62_c38.column=38;
function $log_l62_c13(_event){
this.log("_event",$expr_l62_c38.apply(this, arguments));
};
$log_l62_c13.tagname='log';
$log_l62_c13.line=62;
$log_l62_c13.column=13;
function $cond_l69_c18(_event){
return _event.data === 'Hello, world.';
};
$cond_l69_c18.tagname='undefined';
$cond_l69_c18.line=69;
$cond_l69_c18.column=18;
function $expr_l72_c38(_event){
return _event;
};
$expr_l72_c38.tagname='undefined';
$expr_l72_c38.line=72;
$expr_l72_c38.column=38;
function $log_l72_c13(_event){
this.log("_event",$expr_l72_c38.apply(this, arguments));
};
$log_l72_c13.tagname='log';
$log_l72_c13.line=72;
$log_l72_c13.column=13;
function $data_l22_c29(_event){
return 1;
};
$data_l22_c29.tagname='undefined';
$data_l22_c29.line=22;
$data_l22_c29.column=29;
function $data_l23_c29(_event){
return 2;
};
$data_l23_c29.tagname='undefined';
$data_l23_c29.line=23;
$data_l23_c29.column=29;
function $data_l24_c29(_event){
return 3;
};
$data_l24_c29.tagname='undefined';
$data_l24_c29.line=24;
$data_l24_c29.column=29;
function $datamodel_l21_c5(_event){
if(typeof foo === "undefined")  foo = $data_l22_c29.apply(this, arguments);
if(typeof bar === "undefined")  bar = $data_l23_c29.apply(this, arguments);
if(typeof bat === "undefined")  bat = $data_l24_c29.apply(this, arguments);
};
$datamodel_l21_c5.tagname='datamodel';
$datamodel_l21_c5.line=21;
$datamodel_l21_c5.column=5;
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "a",
   "$type": "state",
   "transitions": [
    {
     "target": "b",
     "event": "t",
     "onTransition": $send_l29_c13
    }
   ]
  },
  {
   "id": "b",
   "$type": "state",
   "transitions": [
    {
     "event": "s1",
     "target": "c",
     "cond": $cond_l38_c18,
     "onTransition": $send_l43_c13
    },
    {
     "event": "s1",
     "target": "f"
    }
   ]
  },
  {
   "id": "c",
   "$type": "state",
   "transitions": [
    {
     "event": "s2",
     "target": "d",
     "cond": $cond_l55_c18,
     "onTransition": $send_l56_c13
    },
    {
     "event": "s2",
     "target": "f",
     "onTransition": $log_l62_c13
    }
   ]
  },
  {
   "id": "d",
   "$type": "state",
   "transitions": [
    {
     "event": "s3",
     "target": "e",
     "cond": $cond_l69_c18
    },
    {
     "event": "s3",
     "target": "f",
     "onTransition": $log_l72_c13
    }
   ]
  },
  {
   "id": "e",
   "$type": "state"
  },
  {
   "id": "f",
   "$type": "state"
  }
 ],
 "onEntry": [
  $datamodel_l21_c5
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/send-data/send1.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L3NlbmQtZGF0YS9zZW5kMS5zY3htbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNkJnRCxXOzs7Ozs7QUFDSixVOzs7Ozs7QUFDSCxROzs7Ozs7QUFGNUI7QUFBQTtBQUFBO0FBQUE7QUFBQSw0Qzs7Ozs7O0FBQWdCLGE7Ozs7OztBQUFoQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVTs7Ozs7O0FBY21DLFc7Ozs7OztBQUN2QixzQjs7Ozs7O0FBREksYTs7Ozs7O0FBQWhCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVOzs7Ozs7QUFMSyxhQUFNLENBQUMsSUFBSSxDQUFDLEcsQ0FBSSxHLENBQUksQyxDQUFFLEU7QUFDeEIsTUFBTSxDQUFDLElBQUksQ0FBQyxHLENBQUksRyxDQUFJLEMsQ0FBRSxFO0FBQ3RCLE1BQU0sQ0FBQyxJQUFJLENBQUMsRyxDQUFJLEcsQ0FBSSxDLENBQUUsRTtBQUN0QixNQUFNLENBQUMsSUFBSSxDQUFDLEksQ0FBSyxHLENBQUksQzs7Ozs7O0FBZVIsVzs7Ozs7O0FBQ0Usc0I7Ozs7OztBQURsQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVTs7Ozs7O0FBREssYUFBTSxDQUFDLEksQ0FBSyxHLENBQUksZTs7Ozs7O0FBT0ksYTs7Ozs7O0FBQXpCLHdEOzs7Ozs7QUFPSyxhQUFNLENBQUMsSSxDQUFLLEcsQ0FBSSxlOzs7Ozs7QUFHSSxhOzs7Ozs7QUFBekIsd0Q7Ozs7OztBQWxEZ0IsUTs7Ozs7O0FBQ0EsUTs7Ozs7O0FBQ0EsUTs7Ozs7O0FBSHhCO0FBQUE7QUFBQSwyRSJ9