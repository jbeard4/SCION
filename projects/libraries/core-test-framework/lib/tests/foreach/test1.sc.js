//Generated on 2017-9-20 12:42:17 by the SCION SCXML compiler
function rootConstructor(_x,_sessionid,_ioprocessors,In){
   var _name = 'undefined';
var myArray, myItem, myIndex, sum, indexSum;
function $deserializeDatamodel($serializedDatamodel){
  myArray = $serializedDatamodel["myArray"];
  myItem = $serializedDatamodel["myItem"];
  myIndex = $serializedDatamodel["myIndex"];
  sum = $serializedDatamodel["sum"];
  indexSum = $serializedDatamodel["indexSum"];
}
function $serializeDatamodel(){
   return {
  "myArray" : myArray,
  "myItem" : myItem,
  "myIndex" : myIndex,
  "sum" : sum,
  "indexSum" : indexSum
   };
}
function $expr_l34_c38(_event){
return [sum,indexSum];
};
$expr_l34_c38.tagname='undefined';
$expr_l34_c38.line=34;
$expr_l34_c38.column=38;
function $log_l34_c13(_event){
this.log("before",$expr_l34_c38.apply(this, arguments));
};
$log_l34_c13.tagname='log';
$log_l34_c13.line=34;
$log_l34_c13.column=13;
function $expr_l36_c45(_event){
return sum + myItem;
};
$expr_l36_c45.tagname='undefined';
$expr_l36_c45.line=36;
$expr_l36_c45.column=45;
function $assign_l36_c17(_event){
sum = $expr_l36_c45.apply(this, arguments);
};
$assign_l36_c17.tagname='assign';
$assign_l36_c17.line=36;
$assign_l36_c17.column=17;
function $expr_l37_c50(_event){
return indexSum + myIndex;
};
$expr_l37_c50.tagname='undefined';
$expr_l37_c50.line=37;
$expr_l37_c50.column=50;
function $assign_l37_c17(_event){
indexSum = $expr_l37_c50.apply(this, arguments);
};
$assign_l37_c17.tagname='assign';
$assign_l37_c17.line=37;
$assign_l37_c17.column=17;
function $foreach_l35_c13(_event){
var $scionArray_11 = myArray;
if(Array.isArray($scionArray_11)){
    for(myIndex = 0; myIndex < $scionArray_11.length;myIndex++){
       myItem = $scionArray_11[myIndex];
       $assign_l36_c17.apply(this, arguments);
       $assign_l37_c17.apply(this, arguments);
       if(myIndex === ($scionArray_11.length - 1)) break;
    }
} else if (typeof $scionArray_11 === "object"){
    for(myIndex in $scionArray_11){
        if($scionArray_11.hasOwnProperty(myIndex)){
           myItem = $scionArray_11[myIndex];
           $assign_l36_c17.apply(this, arguments);
           $assign_l37_c17.apply(this, arguments);
        }
    }
} else {
   throw new Error("Variable myArray does not contain a legal array value");
}
};
$foreach_l35_c13.tagname='foreach';
$foreach_l35_c13.line=35;
$foreach_l35_c13.column=13;
function $expr_l40_c45(_event){
return sum + myItem;
};
$expr_l40_c45.tagname='undefined';
$expr_l40_c45.line=40;
$expr_l40_c45.column=45;
function $assign_l40_c17(_event){
sum = $expr_l40_c45.apply(this, arguments);
};
$assign_l40_c17.tagname='assign';
$assign_l40_c17.line=40;
$assign_l40_c17.column=17;
function $foreach_l39_c13(_event){
var $i;
var $scionArray_11 = myArray;
if(Array.isArray($scionArray_11)){
    for($i = 0; $i < $scionArray_11.length;$i++){
       myItem = $scionArray_11[$i];
       $assign_l40_c17.apply(this, arguments);
       if($i === ($scionArray_11.length - 1)) break;
    }
} else if (typeof $scionArray_11 === "object"){
    for($i in $scionArray_11){
        if($scionArray_11.hasOwnProperty($i)){
           myItem = $scionArray_11[$i];
           $assign_l40_c17.apply(this, arguments);
        }
    }
} else {
   throw new Error("Variable myArray does not contain a legal array value");
}
};
$foreach_l39_c13.tagname='foreach';
$foreach_l39_c13.line=39;
$foreach_l39_c13.column=13;
function $expr_l42_c37(_event){
return [sum,indexSum];
};
$expr_l42_c37.tagname='undefined';
$expr_l42_c37.line=42;
$expr_l42_c37.column=37;
function $log_l42_c13(_event){
this.log("after",$expr_l42_c37.apply(this, arguments));
};
$log_l42_c13.tagname='log';
$log_l42_c13.line=42;
$log_l42_c13.column=13;
function $cond_l44_c47(_event){
return sum === 50 && indexSum === 10;
};
$cond_l44_c47.tagname='undefined';
$cond_l44_c47.line=44;
$cond_l44_c47.column=47;
function $data_l25_c33(_event){
return [1,3,5,7,9];
};
$data_l25_c33.tagname='undefined';
$data_l25_c33.line=25;
$data_l25_c33.column=33;
function $data_l26_c32(_event){
return 0;
};
$data_l26_c32.tagname='undefined';
$data_l26_c32.line=26;
$data_l26_c32.column=32;
function $data_l27_c33(_event){
return 0;
};
$data_l27_c33.tagname='undefined';
$data_l27_c33.line=27;
$data_l27_c33.column=33;
function $data_l28_c29(_event){
return 0;
};
$data_l28_c29.tagname='undefined';
$data_l28_c29.line=28;
$data_l28_c29.column=29;
function $data_l29_c34(_event){
return 0;
};
$data_l29_c34.tagname='undefined';
$data_l29_c34.line=29;
$data_l29_c34.column=34;
function $datamodel_l24_c5(_event){
if(typeof myArray === "undefined")  myArray = $data_l25_c33.apply(this, arguments);
if(typeof myItem === "undefined")  myItem = $data_l26_c32.apply(this, arguments);
if(typeof myIndex === "undefined")  myIndex = $data_l27_c33.apply(this, arguments);
if(typeof sum === "undefined")  sum = $data_l28_c29.apply(this, arguments);
if(typeof indexSum === "undefined")  indexSum = $data_l29_c34.apply(this, arguments);
};
$datamodel_l24_c5.tagname='datamodel';
$datamodel_l24_c5.line=24;
$datamodel_l24_c5.column=5;
return {
 "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
 "$type": "scxml",
 "id": "$generated-scxml-0",
 "states": [
  {
   "id": "a",
   "$type": "state",
   "onEntry": [
    $log_l34_c13,
    $foreach_l35_c13,
    $foreach_l39_c13,
    $log_l42_c13
   ],
   "transitions": [
    {
     "target": "c",
     "event": "t",
     "cond": $cond_l44_c47
    }
   ]
  },
  {
   "id": "c",
   "$type": "state"
  }
 ],
 "onEntry": [
  $datamodel_l24_c5
 ],
 "$deserializeDatamodel": $deserializeDatamodel,
 "$serializeDatamodel": $serializeDatamodel,
 "docUrl": "/home/jacob/workspace/scxml-test-framework/test/foreach/test1.scxml"
};
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phY29iL3dvcmtzcGFjZS9zY3htbC10ZXN0LWZyYW1ld29yay90ZXN0L2ZvcmVhY2gvdGVzdDEuc2N4bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0NzQyxRQUFDLEdBQUcsQ0FBQyxRQUFRLEM7Ozs7OztBQUF0Qyx3RDs7Ozs7O0FBRWdDLFUsQ0FBSSxDLENBQUUsTTs7Ozs7O0FBQWxDLDJDOzs7Ozs7QUFDaUMsZSxDQUFTLEMsQ0FBRSxPOzs7Ozs7QUFBNUMsZ0Q7Ozs7OztBQUZKO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEM7Ozs7OztBQUtnQyxVLENBQUksQyxDQUFFLE07Ozs7OztBQUFsQywyQzs7Ozs7O0FBREo7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEM7Ozs7OztBQUd3QixRQUFDLEdBQUcsQ0FBQyxRQUFRLEM7Ozs7OztBQUFyQyx1RDs7Ozs7O0FBRWtDLFUsQ0FBSSxHLENBQUksRSxDQUFHLEUsQ0FBRyxRLENBQVMsRyxDQUFJLEU7Ozs7OztBQW5CekMsUUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDOzs7Ozs7QUFDWCxROzs7Ozs7QUFDQyxROzs7Ozs7QUFDSixROzs7Ozs7QUFDSyxROzs7Ozs7QUFMN0I7QUFBQTtBQUFBO0FBQUE7QUFBQSxxRiJ9