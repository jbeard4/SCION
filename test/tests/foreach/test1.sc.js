//Generated on Tuesday, June 17, 2014 21:23:26 by the SCION SCXML compiler
module.exports = (function(_x,_sessionid,_name,_ioprocessors,In){
    
    
    
    
    var myArray, myItem, myIndex, sum, indexSum;
    
    var $scion_early_binding_datamodel_has_fired= false;
    function $initEarlyBindingDatamodel(_event){
        if(!$scion_early_binding_datamodel_has_fired){
            myArray = $data_line_25_column_47.apply(this, arguments);
            myItem = $data_line_26_column_36.apply(this, arguments);
            myIndex = $data_line_27_column_37.apply(this, arguments);
            sum = $data_line_28_column_33.apply(this, arguments);
            indexSum = $data_line_29_column_38.apply(this, arguments);
            $scion_early_binding_datamodel_has_fired = true; 
        }
    }
    
    function $deserializeDatamodel($serializedDatamodel){
        myArray = $serializedDatamodel["myArray"];
        myItem = $serializedDatamodel["myItem"];
        myIndex = $serializedDatamodel["myIndex"];
        sum = $serializedDatamodel["sum"];
        indexSum = $serializedDatamodel["indexSum"];
        $scion_early_binding_datamodel_has_fired = true;
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
    
    function $expr_line_34_column_55(_event){
        return [sum,indexSum];
    }
    
    function $log_line_34_column_55(_event){
        this.log("before",$expr_line_34_column_55.apply(this, arguments));
    }
    
    function $expr_line_36_column_60(_event){
        return sum + myItem;
    }
    
    function $assign_line_36_column_60(_event){
        sum = $expr_line_36_column_60.apply(this, arguments);
    }
    
    function $expr_line_37_column_71(_event){
        return indexSum + myIndex;
    }
    
    function $assign_line_37_column_71(_event){
        indexSum = $expr_line_37_column_71.apply(this, arguments);
    }
    
    function $foreach_line_35_column_67(_event){
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
    
    function $expr_line_40_column_60(_event){
        return sum + myItem;
    }
    
    function $assign_line_40_column_60(_event){
        sum = $expr_line_40_column_60.apply(this, arguments);
    }
    
    function $foreach_line_39_column_51(_event){
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
    
    function $expr_line_42_column_54(_event){
        return [sum,indexSum];
    }
    
    function $log_line_42_column_54(_event){
        this.log("after",$expr_line_42_column_54.apply(this, arguments));
    }
    
    function $cond_line_44_column_87(_event){
        return sum === 50 && indexSum === 10;
    }
    
    function $data_line_25_column_47(_event){
        return [1,3,5,7,9];
    }
    
    function $data_line_26_column_36(_event){
        return 0;
    }
    
    function $data_line_27_column_37(_event){
        return 0;
    }
    
    function $data_line_28_column_33(_event){
        return 0;
    }
    
    function $data_line_29_column_38(_event){
        return 0;
    }
    
    return {
        "": "http://www.w3.org/2005/07/scxml",
        "$type": "scxml",
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
        ],
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel
    };});
