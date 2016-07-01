//Generated on Tuesday, June 17, 2014 21:23:28 by the SCION SCXML compiler
module.exports = (function(_x,_sessionid,_name,_ioprocessors,In){
    
    
    
    
    var x;
    
    var $scion_early_binding_datamodel_has_fired= false;
    function $initEarlyBindingDatamodel(_event){
        if(!$scion_early_binding_datamodel_has_fired){
            x = $data_line_22_column_31.apply(this, arguments);
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
    
    function $expr_line_30_column_47(_event){
        return x + 1;
    }
    
    function $assign_line_30_column_47(_event){
        x = $expr_line_30_column_47.apply(this, arguments);
    }
    
    function $expr_line_27_column_46(_event){
        return x +1;
    }
    
    function $assign_line_27_column_46(_event){
        x = $expr_line_27_column_46.apply(this, arguments);
    }
    
    function $cond_line_49_column_58(_event){
        return x === 6;
    }
    
    function $expr_line_38_column_51(_event){
        return x + 1;
    }
    
    function $assign_line_38_column_51(_event){
        x = $expr_line_38_column_51.apply(this, arguments);
    }
    
    function $expr_line_35_column_51(_event){
        return x + 1;
    }
    
    function $assign_line_35_column_51(_event){
        x = $expr_line_35_column_51.apply(this, arguments);
    }
    
    function $cond_line_43_column_62(_event){
        return x === 2;
    }
    
    function $cond_line_54_column_58(_event){
        return x === 8;
    }
    
    function $data_line_22_column_31(_event){
        return 0;
    }
    
    return {
        "": "http://www.w3.org/2005/07/scxml",
        "$type": "scxml",
        "states": [
            {
                "id": "p",
                "$type": "parallel",
                "onEntry": $assign_line_27_column_46,
                "onExit": $assign_line_30_column_47,
                "states": [
                    {
                        "id": "a",
                        "onEntry": $assign_line_35_column_51,
                        "onExit": $assign_line_38_column_51,
                        "transitions": [
                            {
                                "target": "a",
                                "event": "t1",
                                "cond": $cond_line_43_column_62
                            }
                        ]
                    },
                    {
                        "id": "b"
                    }
                ],
                "transitions": [
                    {
                        "target": "c",
                        "event": "t2",
                        "cond": $cond_line_49_column_58
                    }
                ]
            },
            {
                "id": "c",
                "transitions": [
                    {
                        "target": "d",
                        "event": "t3",
                        "cond": $cond_line_54_column_58
                    }
                ]
            },
            {
                "id": "d"
            }
        ],
        "onEntry": [
            $initEarlyBindingDatamodel
        ],
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel
    };});
