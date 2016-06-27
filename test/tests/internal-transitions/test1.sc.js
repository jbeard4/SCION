//Generated on Tuesday, June 17, 2014 21:23:27 by the SCION SCXML compiler
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
    
    function $expr_line_31_column_47(_event){
        return x + 1;
    }
    
    function $assign_line_31_column_47(_event){
        x = $expr_line_31_column_47.apply(this, arguments);
    }
    
    function $expr_line_27_column_47(_event){
        return x + 1;
    }
    
    function $assign_line_27_column_47(_event){
        x = $expr_line_27_column_47.apply(this, arguments);
    }
    
    function $expr_line_40_column_51(_event){
        return x + 1;
    }
    
    function $assign_line_40_column_51(_event){
        x = $expr_line_40_column_51.apply(this, arguments);
    }
    
    function $expr_line_36_column_51(_event){
        return x + 1;
    }
    
    function $assign_line_36_column_51(_event){
        x = $expr_line_36_column_51.apply(this, arguments);
    }
    
    function $cond_line_67_column_79(_event){
        return x === 3;
    }
    
    function $expr_line_49_column_55(_event){
        return x + 1;
    }
    
    function $assign_line_49_column_55(_event){
        x = $expr_line_49_column_55.apply(this, arguments);
    }
    
    function $expr_line_45_column_55(_event){
        return x + 1;
    }
    
    function $assign_line_45_column_55(_event){
        x = $expr_line_45_column_55.apply(this, arguments);
    }
    
    function $expr_line_59_column_55(_event){
        return x + 1;
    }
    
    function $assign_line_59_column_55(_event){
        x = $expr_line_59_column_55.apply(this, arguments);
    }
    
    function $expr_line_55_column_55(_event){
        return x + 1;
    }
    
    function $assign_line_55_column_55(_event){
        x = $expr_line_55_column_55.apply(this, arguments);
    }
    
    function $cond_line_63_column_66(_event){
        return x === 5;
    }
    
    function $cond_line_82_column_58(_event){
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
                "onEntry": $assign_line_27_column_47,
                "onExit": $assign_line_31_column_47,
                "states": [
                    {
                        "id": "a",
                        "onEntry": $assign_line_36_column_51,
                        "onExit": $assign_line_40_column_51,
                        "states": [
                            {
                                "id": "a1",
                                "onEntry": $assign_line_45_column_55,
                                "onExit": $assign_line_49_column_55
                            },
                            {
                                "id": "a2",
                                "onEntry": $assign_line_55_column_55,
                                "onExit": $assign_line_59_column_55,
                                "transitions": [
                                    {
                                        "target": "c",
                                        "event": "t2",
                                        "cond": $cond_line_63_column_66
                                    }
                                ]
                            }
                        ],
                        "transitions": [
                            {
                                "target": "a2",
                                "event": "t1",
                                "type": "internal",
                                "cond": $cond_line_67_column_79
                            }
                        ]
                    },
                    {
                        "id": "b",
                        "states": [
                            {
                                "id": "b1"
                            },
                            {
                                "id": "b2"
                            }
                        ]
                    }
                ]
            },
            {
                "id": "c",
                "transitions": [
                    {
                        "target": "d",
                        "event": "t3",
                        "cond": $cond_line_82_column_58
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
