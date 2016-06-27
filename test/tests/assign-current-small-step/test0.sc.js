//Generated on Tuesday, June 17, 2014 21:23:24 by the SCION SCXML compiler
module.exports = (function(_x,_sessionid,_name,_ioprocessors,In){
    
    
    
    
    var x;
    
    var $scion_early_binding_datamodel_has_fired= false;
    function $initEarlyBindingDatamodel(_event){
        if(!$scion_early_binding_datamodel_has_fired){
            $scion_early_binding_datamodel_has_fired = true; 
        }
    }
    
    function $deserializeDatamodel($serializedDatamodel){
        x = $serializedDatamodel["x"];
        $scion_early_binding_datamodel_has_fired = true;
    }
    
    function $serializeDatamodel(){
       return {
        "x" : x
       };
    }
    
    function $expr_line_28_column_44(_event){
        return -1;
    }
    
    function $assign_line_28_column_44(_event){
        x = $expr_line_28_column_44.apply(this, arguments);
    }
    
    function $expr_line_29_column_44(_event){
        return 99;
    }
    
    function $assign_line_29_column_44(_event){
        x = $expr_line_29_column_44.apply(this, arguments);
    }
    
    function $expr_line_34_column_47(_event){
        return x + 1;
    }
    
    function $assign_line_34_column_47(_event){
        x = $expr_line_34_column_47.apply(this, arguments);
    }
    
    function $cond_line_33_column_58(_event){
        return x === 99;
    }
    
    function $script_line_41_column_20(_event){
        x *= 2;
    }
    
    function $cond_line_46_column_49(_event){
        return x === 200;
    }
    
    return {
        "": "http://www.w3.org/2005/07/scxml",
        "$type": "scxml",
        "states": [
            {
                "id": "a",
                "onEntry": [
                    $assign_line_28_column_44,
                    $assign_line_29_column_44
                ],
                "transitions": [
                    {
                        "event": "t",
                        "target": "b",
                        "cond": $cond_line_33_column_58,
                        "onTransition": $assign_line_34_column_47
                    }
                ]
            },
            {
                "id": "b",
                "onEntry": $script_line_41_column_20,
                "transitions": [
                    {
                        "target": "c",
                        "cond": $cond_line_46_column_49
                    },
                    {
                        "target": "f"
                    }
                ]
            },
            {
                "id": "c"
            },
            {
                "id": "f"
            }
        ],
        "onEntry": [
            $initEarlyBindingDatamodel
        ],
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel
    };});
