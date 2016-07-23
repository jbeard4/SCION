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
    
    function $expr_line_27_column_43(_event){
        return 2;
    }
    
    function $assign_line_27_column_43(_event){
        x = $expr_line_27_column_43.apply(this, arguments);
    }
    
    function $expr_line_35_column_47(_event){
        return x * 3;
    }
    
    function $assign_line_35_column_47(_event){
        x = $expr_line_35_column_47.apply(this, arguments);
    }
    
    function $expr_line_36_column_37(_event){
        return 'b, x:' + x;
    }
    
    function $log_line_36_column_37(_event){
        this.log($expr_line_36_column_37.apply(this, arguments));
    }
    
    function $cond_line_53_column_48(_event){
        return x === 30;
    }
    
    function $expr_line_41_column_51(_event){
        return x * 5;
    }
    
    function $assign_line_41_column_51(_event){
        x = $expr_line_41_column_51.apply(this, arguments);
    }
    
    function $expr_line_42_column_42(_event){
        return 'b1, x:' + x;
    }
    
    function $log_line_42_column_42(_event){
        this.log($expr_line_42_column_42.apply(this, arguments));
    }
    
    function $expr_line_48_column_51(_event){
        return x * 7;
    }
    
    function $assign_line_48_column_51(_event){
        x = $expr_line_48_column_51.apply(this, arguments);
    }
    
    function $expr_line_49_column_42(_event){
        return 'b2, x:' + x;
    }
    
    function $log_line_49_column_42(_event){
        this.log($expr_line_49_column_42.apply(this, arguments));
    }
    
    return {
        "": "http://www.w3.org/2005/07/scxml",
        "$type": "scxml",
        "states": [
            {
                "id": "a",
                "onEntry": $assign_line_27_column_43,
                "transitions": [
                    {
                        "event": "t",
                        "target": "b1"
                    }
                ]
            },
            {
                "id": "b",
                "onEntry": [
                    $assign_line_35_column_47,
                    $log_line_36_column_37
                ],
                "states": [
                    {
                        "id": "b1",
                        "onEntry": [
                            $assign_line_41_column_51,
                            $log_line_42_column_42
                        ]
                    },
                    {
                        "id": "b2",
                        "onEntry": [
                            $assign_line_48_column_51,
                            $log_line_49_column_42
                        ]
                    }
                ],
                "transitions": [
                    {
                        "target": "c",
                        "cond": $cond_line_53_column_48
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
