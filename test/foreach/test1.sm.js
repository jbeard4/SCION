var myArray = [1,3,5,7,9], myItem = 0, myIndex = 0, sum = 0, indexSum = 0;

function $log_line_34_column_55(){
    console.log("before",[sum,indexSum]);
}

function $foreach_line_35_column_67(){
    var myItem ,myIndex;
    
    function $assign_line_36_column_60(){
        sum = sum + myItem;
    }
    function $assign_line_37_column_71(){
        indexSum = indexSum + myIndex;
    }
    
    if(Array.isArray(myArray)){
        for(myIndex = 0; myIndex < myArray.length;myIndex++){
           myItem = myArray[myIndex];
           $assign_line_36_column_60();
    $assign_line_37_column_71();
        }
    } else{
        for(myIndex in myArray){
            if(myArray.hasOwnProperty(myIndex)){
               myItem = myArray[myIndex];
               $assign_line_36_column_60();
    $assign_line_37_column_71();
            }
        }
    }
}

function $foreach_line_39_column_51(){
    var myItem ,$i;
    
    function $assign_line_40_column_60(){
        sum = sum + myItem;
    }
    
    if(Array.isArray(myArray)){
        for($i = 0; $i < myArray.length;$i++){
           myItem = myArray[$i];
           $assign_line_40_column_60();
        }
    } else{
        for($i in myArray){
            if(myArray.hasOwnProperty($i)){
               myItem = myArray[$i];
               $assign_line_40_column_60();
            }
        }
    }
}

function $log_line_42_column_54(){
    console.log("after",[sum,indexSum]);
}

function $expression_line_44_column_85(){
    return sum === 50 && indexSum === 10;
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
                    "cond": $expression_line_44_column_85
                }
            ]
        },
        {
            "id": "c"
        }
    ]
};
