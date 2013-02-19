//Generated on Monday, February 18, 2013 23:32:57 by the SCION SCXML compiler

var myArray = $data_line_25_column_47(), myItem = $data_line_26_column_36(), myIndex = $data_line_27_column_37(), sum = $data_line_28_column_33(), indexSum = $data_line_29_column_38();

function $log_line_34_column_55(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log("before",$expr_line_34_column_53.apply(this, arguments));
}

function $expr_line_34_column_53(_event, In, _sessionId, _name, _ioprocessors, _x){
    return [sum,indexSum];
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

function $assign_line_36_column_60(_event, In, _sessionId, _name, _ioprocessors, _x){
    sum = $expr_line_36_column_58.apply(this, arguments);
}

function $expr_line_36_column_58(_event, In, _sessionId, _name, _ioprocessors, _x){
    return sum + myItem;
}

function $assign_line_37_column_71(_event, In, _sessionId, _name, _ioprocessors, _x){
    indexSum = $expr_line_37_column_69.apply(this, arguments);
}

function $expr_line_37_column_69(_event, In, _sessionId, _name, _ioprocessors, _x){
    return indexSum + myIndex;
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

function $assign_line_40_column_60(_event, In, _sessionId, _name, _ioprocessors, _x){
    sum = $expr_line_40_column_58.apply(this, arguments);
}

function $expr_line_40_column_58(_event, In, _sessionId, _name, _ioprocessors, _x){
    return sum + myItem;
}

function $log_line_42_column_54(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log("after",$expr_line_42_column_52.apply(this, arguments));
}

function $expr_line_42_column_52(_event, In, _sessionId, _name, _ioprocessors, _x){
    return [sum,indexSum];
}

function $cond_line_44_column_85(_event, In, _sessionId, _name, _ioprocessors, _x){
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
                    "cond": $cond_line_44_column_85
                }
            ]
        },
        {
            "id": "c"
        }
    ]
};
