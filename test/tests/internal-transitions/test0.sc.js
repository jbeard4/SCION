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
    
    function $expr_line_26_column_33(_event){
        return x;
    }
    
    function $log_line_26_column_33(_event){
        this.log("x",$expr_line_26_column_33.apply(this, arguments));
    }
    
    function $expr_line_35_column_47(_event){
        return x + 1;
    }
    
    function $assign_line_35_column_47(_event){
        x = $expr_line_35_column_47.apply(this, arguments);
    }
    
    function $expr_line_31_column_47(_event){
        return x + 1;
    }
    
    function $assign_line_31_column_47(_event){
        x = $expr_line_31_column_47.apply(this, arguments);
    }
    
    function $cond_line_46_column_75(_event){
        return x === 1;
    }
    
    function $cond_line_43_column_62(_event){
        return x === 1;
    }
    
    function $cond_line_50_column_59(_event){
        return x === 2;
    }
    
    function $data_line_22_column_31(_event){
        return 0;
    }
    
    return {
        "": "http://www.w3.org/2005/07/scxml",
        "$type": "scxml",
        "transitions": [
            {
                "event": "*",
                "onTransition": $log_line_26_column_33
            }
        ],
        "states": [
            {
                "id": "a",
                "onEntry": $assign_line_31_column_47,
                "onExit": $assign_line_35_column_47,
                "states": [
                    {
                        "id": "a1"
                    },
                    {
                        "id": "a2",
                        "transitions": [
                            {
                                "target": "b",
                                "event": "t2",
                                "cond": $cond_line_43_column_62
                            }
                        ]
                    }
                ],
                "transitions": [
                    {
                        "target": "a2",
                        "event": "t1",
                        "type": "internal",
                        "cond": $cond_line_46_column_75
                    }
                ]
            },
            {
                "id": "b",
                "transitions": [
                    {
                        "target": "c",
                        "event": "t3",
                        "cond": $cond_line_50_column_59
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
