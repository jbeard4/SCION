//Generated on 2017-9-20 12:39:51 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';


function doError() {
var x = y;
return x;
}

function checkErrorData(err, expected) {
var ret = false;
if (err.tagname !== expected.tagname) {
return false;
}

if (isNaN(err.line)) {
return false;
}

if (isNaN(err.column)) {
return false;
}

if (typeof err.reason !== 'string' || !err.reason.length) {
return false;
}

return true;
}
function $deserializeDatamodel($serializedDatamodel){

}
function $serializeDatamodel(){
   return {

   };
}
function $expr_l36_c15(_event){
return 'Unexpected ' + JSON.stringify(_event);
};
$expr_l36_c15.tagname='undefined';
$expr_l36_c15.line=36;
$expr_l36_c15.column=15;
function $log_l36_c5(_event){
this.log("TEST",$expr_l36_c15.apply(this, arguments));
};
$log_l36_c5.tagname='log';
$log_l36_c5.line=36;
$log_l36_c5.column=5;
function $expr_l42_c15(_event){
return 'Ignoring unhandled ' + JSON.stringify(_event);
};
$expr_l42_c15.tagname='undefined';
$expr_l42_c15.line=42;
$expr_l42_c15.column=15;
function $log_l42_c5(_event){
this.log("TEST",$expr_l42_c15.apply(this, arguments));
};
$log_l42_c5.tagname='log';
$log_l42_c5.line=42;
$log_l42_c5.column=5;
function $expr_l47_c17(_event){
return doError();
};
$expr_l47_c17.tagname='undefined';
$expr_l47_c17.line=47;
$expr_l47_c17.column=17;
function $log_l47_c7(_event){
this.log("TEST",$expr_l47_c17.apply(this, arguments));
};
$log_l47_c7.tagname='log';
$log_l47_c7.line=47;
$log_l47_c7.column=7;
function $expr_l51_c17(_event){
return JSON.stringify(_event);
};
$expr_l51_c17.tagname='undefined';
$expr_l51_c17.line=51;
$expr_l51_c17.column=17;
function $log_l51_c7(_event){
this.log("TEST",$expr_l51_c17.apply(this, arguments));
};
$log_l51_c7.tagname='log';
$log_l51_c7.line=51;
$log_l51_c7.column=7;
function $cond_l50_c12(_event){
return checkErrorData(_event.data, {tagname: 'log'});
};
$cond_l50_c12.tagname='undefined';
$cond_l50_c12.line=50;
$cond_l50_c12.column=12;
function $script_l57_c7(_event){

      undefinedFunction();
};
$script_l57_c7.tagname='script';
$script_l57_c7.line=57;
$script_l57_c7.column=7;
function $expr_l63_c17(_event){
return JSON.stringify(_event);
};
$expr_l63_c17.tagname='undefined';
$expr_l63_c17.line=63;
$expr_l63_c17.column=17;
function $log_l63_c7(_event){
this.log("TEST",$expr_l63_c17.apply(this, arguments));
};
$log_l63_c7.tagname='log';
$log_l63_c7.line=63;
$log_l63_c7.column=7;
function $cond_l62_c12(_event){
return checkErrorData(_event.data, {tagname: 'script'});
};
$cond_l62_c12.tagname='undefined';
$cond_l62_c12.line=62;
$cond_l62_c12.column=12;
function $expr_l70_c15(_event){
return 'RESULT: pass';
};
$expr_l70_c15.tagname='undefined';
$expr_l70_c15.line=70;
$expr_l70_c15.column=15;
function $log_l70_c5(_event){
this.log("TEST",$expr_l70_c15.apply(this, arguments));
};
$log_l70_c5.tagname='log';
$log_l70_c5.line=70;
$log_l70_c5.column=5;
function $expr_l76_c15(_event){
return 'RESULT: fail';
};
$expr_l76_c15.tagname='undefined';
$expr_l76_c15.line=76;
$expr_l76_c15.column=15;
function $log_l76_c5(_event){
this.log("TEST",$expr_l76_c15.apply(this, arguments));
};
$log_l76_c5.tagname='log';
$log_l76_c5.line=76;
$log_l76_c5.column=5;
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "initial": "uber",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "uber",
   "$type": "state",
   "transitions": [
    {
     "event": "error.execution",
     "target": "fail",
     "onTransition": $log_l36_c5
    },
    {
     "event": "fail",
     "target": "fail"
    },
    {
     "event": "*",
     "onTransition": $log_l42_c5
    }
   ],
   "states": [
    {
     "id": "s1",
     "$type": "state",
     "transitions": [
      {
       "event": "e1",
       "onTransition": $log_l47_c7
      },
      {
       "event": "error.execution",
       "cond": $cond_l50_c12,
       "target": "s2",
       "onTransition": $log_l51_c7
      }
     ]
    },
    {
     "id": "s2",
     "$type": "state",
     "onEntry": [
      $script_l57_c7
     ],
     "transitions": [
      {
       "event": "error.execution",
       "cond": $cond_l62_c12,
       "target": "pass",
       "onTransition": $log_l63_c7
      }
     ]
    }
   ]
  },
  {
   "id": "pass",
   "$type": "final",
   "onEntry": [
    $log_l70_c5
   ]
  },
  {
   "id": "fail",
   "$type": "final",
   "onEntry": [
    $log_l76_c5
   ]
  }
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/error/error.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L2Vycm9yL2Vycm9yLnNjeG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBTUEsUSxDQUFTLE9BQU8sQ0FBQyxDLENBQUUsQztBQUNqQixHLENBQUksQyxDQUFFLEMsQ0FBRSxDQUFDLEM7QUFDVCxNLENBQU8sQ0FBQyxDO0FBQ1YsQzs7QUFFQSxRLENBQVMsY0FBYyxDQUFDLEdBQUcsQyxDQUFFLFFBQVEsQyxDQUFFLEM7QUFDckMsRyxDQUFJLEcsQ0FBSSxDLENBQUUsS0FBSyxDO0FBQ2YsRSxDQUFHLENBQUMsR0FBRyxDQUFDLE8sQ0FBUSxHLENBQUksUUFBUSxDQUFDLE9BQU8sQyxDQUFFLEM7QUFDcEMsTSxDQUFPLEtBQUssQztBQUNkLEM7O0FBRUEsRSxDQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQyxDQUFFLEM7QUFDbkIsTSxDQUFPLEtBQUssQztBQUNkLEM7O0FBRUEsRSxDQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQyxDQUFFLEM7QUFDckIsTSxDQUFPLEtBQUssQztBQUNkLEM7O0FBRUEsRSxDQUFHLENBQUMsTSxDQUFPLEdBQUcsQ0FBQyxNLENBQU8sRyxDQUFJLFEsQ0FBUyxFLENBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQyxDQUFFLEM7QUFDeEQsTSxDQUFPLEtBQUssQztBQUNkLEM7O0FBRUEsTSxDQUFPLElBQUksQztBQUNiLEM7Ozs7Ozs7Ozs7QUFNZSxvQixDQUFjLEMsQ0FBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQzs7Ozs7O0FBQS9DLHNEOzs7Ozs7QUFNVSw0QixDQUFzQixDLENBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEM7Ozs7OztBQUF2RCxzRDs7Ozs7O0FBS1ksY0FBTyxDQUFDLEM7Ozs7OztBQUFsQixzRDs7Ozs7O0FBSVUsV0FBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEM7Ozs7OztBQUEvQixzRDs7Ozs7O0FBREsscUJBQWMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDLENBQUUsQ0FBQyxPQUFPLEMsQ0FBRSxLQUFLLENBQUMsQzs7Ozs7OztNQVFsRCxpQkFBaUIsQ0FBQyxDQUFDLEM7Ozs7OztBQUtSLFdBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDOzs7Ozs7QUFBL0Isc0Q7Ozs7OztBQURLLHFCQUFjLENBQUMsTUFBTSxDQUFDLElBQUksQyxDQUFFLENBQUMsT0FBTyxDLENBQUUsUUFBUSxDQUFDLEM7Ozs7OztBQVE1QyxxQjs7Ozs7O0FBQVYsc0Q7Ozs7OztBQU1VLHFCOzs7Ozs7QUFBVixzRCJ9