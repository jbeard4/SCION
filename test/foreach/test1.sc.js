//Generated on Thursday, February 21, 2013 19:56:25 by the SCION SCXML compiler



var myArray, myItem, myIndex, sum, indexSum;

var $scion_early_binding_datamodel_has_fired = false;
function $initEarlyBindingDatamodel(_event, In, _sessionId, _name, _ioprocessors, _x){
    if(!$scion_early_binding_datamodel_has_fired){
        myArray = $data_line_25_column_47.apply(this, arguments);
        myItem = $data_line_26_column_36.apply(this, arguments);
        myIndex = $data_line_27_column_37.apply(this, arguments);
        sum = $data_line_28_column_33.apply(this, arguments);
        indexSum = $data_line_29_column_38.apply(this, arguments);
        $scion_early_binding_datamodel_has_fired = true; 
    }
}

function $expr_line_34_column_55(_event, In, _sessionId, _name, _ioprocessors, _x){
    return [sum,indexSum];
}

function $log_line_34_column_55(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log("before",$expr_line_34_column_55.apply(this, arguments));
}

function $expr_line_36_column_60(_event, In, _sessionId, _name, _ioprocessors, _x){
    return sum + myItem;
}

function $assign_line_36_column_60(_event, In, _sessionId, _name, _ioprocessors, _x){
    sum = $expr_line_36_column_60.apply(this, arguments);
}

function $expr_line_37_column_71(_event, In, _sessionId, _name, _ioprocessors, _x){
    return indexSum + myIndex;
}

function $assign_line_37_column_71(_event, In, _sessionId, _name, _ioprocessors, _x){
    indexSum = $expr_line_37_column_71.apply(this, arguments);
}

function $foreach_line_35_column_67(_event, In, _sessionId, _name, _ioprocessors, _x){
    if(Array.isArray(myArray)){
        for(myIndex = 0; myIndex < myArray.length;myIndex++){
           myItem = myArray[myIndex];
           $assign_line_36_column_60.apply(this, arguments);
           $assign_line_37_column_71.apply(this, arguments);
        }
    } else{
        for(myIndex in myArray){
            if(myArray.hasOwnProperty(myIndex)){
               myItem = myArray[myIndex];
               $assign_line_36_column_60.apply(this, arguments);
               $assign_line_37_column_71.apply(this, arguments);
            }
        }
    }
}

function $expr_line_40_column_60(_event, In, _sessionId, _name, _ioprocessors, _x){
    return sum + myItem;
}

function $assign_line_40_column_60(_event, In, _sessionId, _name, _ioprocessors, _x){
    sum = $expr_line_40_column_60.apply(this, arguments);
}

function $foreach_line_39_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    var $i;
    if(Array.isArray(myArray)){
        for($i = 0; $i < myArray.length;$i++){
           myItem = myArray[$i];
           $assign_line_40_column_60.apply(this, arguments);
        }
    } else{
        for($i in myArray){
            if(myArray.hasOwnProperty($i)){
               myItem = myArray[$i];
               $assign_line_40_column_60.apply(this, arguments);
            }
        }
    }
}

function $expr_line_42_column_54(_event, In, _sessionId, _name, _ioprocessors, _x){
    return [sum,indexSum];
}

function $log_line_42_column_54(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log("after",$expr_line_42_column_54.apply(this, arguments));
}

function $cond_line_44_column_87(_event, In, _sessionId, _name, _ioprocessors, _x){
    return sum === 50 && indexSum === 10;
}

function $data_line_25_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    return [1,3,5,7,9];
}

function $data_line_26_column_36(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 0;
}

function $data_line_27_column_37(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 0;
}

function $data_line_28_column_33(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 0;
}

function $data_line_29_column_38(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 0;
}

module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "a",
            "onEntry": [
                $log_line_34_column_55,
                $foreach_line_35_column_67,
                $foreach_line_39_column_51,
                $log_line_42_column_54
            ],
            "transitions": [
                {
                    "target": "c",
                    "event": "t",
                    "cond": $cond_line_44_column_87
                }
            ]
        },
        {
            "id": "c"
        }
    ],
    "onEntry": [
        $initEarlyBindingDatamodel
    ]
};
