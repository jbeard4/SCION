//Generated on Tuesday, June 17, 2014 21:23:33 by the SCION SCXML compiler
module.exports = (function(_x,_sessionid,_name,_ioprocessors,In){
    
    
    
    
    var i;
    
    var $scion_early_binding_datamodel_has_fired= false;
    function $initEarlyBindingDatamodel(_event){
        if(!$scion_early_binding_datamodel_has_fired){
            i = $data_line_22_column_31.apply(this, arguments);
            $scion_early_binding_datamodel_has_fired = true; 
        }
    }
    
    function $deserializeDatamodel($serializedDatamodel){
        i = $serializedDatamodel["i"];
        $scion_early_binding_datamodel_has_fired = true;
    }
    
    function $serializeDatamodel(){
       return {
        "i" : i
       };
    }
    
    function $cond_line_27_column_52(_event){
        return i === 100;
    }
    
    function $expr_line_30_column_48(_event){
        return i * 20;
    }
    
    function $assign_line_30_column_48(_event){
        i = $expr_line_30_column_48.apply(this, arguments);
    }
    
    function $expr_line_31_column_27(_event){
        return i;
    }
    
    function $log_line_31_column_27(_event){
        this.log($expr_line_31_column_27.apply(this, arguments));
    }
    
    function $expr_line_37_column_55(_event){
        return i * 2;
    }
    
    function $assign_line_37_column_55(_event){
        i = $expr_line_37_column_55.apply(this, arguments);
    }
    
    function $expr_line_38_column_35(_event){
        return i;
    }
    
    function $log_line_38_column_35(_event){
        this.log($expr_line_38_column_35.apply(this, arguments));
    }
    
    function $expr_line_49_column_63(_event){
        return Math.pow(i,3);
    }
    
    function $assign_line_49_column_63(_event){
        i = $expr_line_49_column_63.apply(this, arguments);
    }
    
    function $expr_line_50_column_35(_event){
        return i;
    }
    
    function $log_line_50_column_35(_event){
        this.log($expr_line_50_column_35.apply(this, arguments));
    }
    
    function $expr_line_60_column_51(_event){
        return i - 3;
    }
    
    function $assign_line_60_column_51(_event){
        i = $expr_line_60_column_51.apply(this, arguments);
    }
    
    function $expr_line_61_column_31(_event){
        return i;
    }
    
    function $log_line_61_column_31(_event){
        this.log($expr_line_61_column_31.apply(this, arguments));
    }
    
    function $data_line_22_column_31(_event){
        return 1;
    }
    
    return {
        "": "http://www.w3.org/2005/07/scxml",
        "$type": "scxml",
        "states": [
            {
                "id": "p",
                "$type": "parallel",
                "transitions": [
                    {
                        "target": "done",
                        "cond": $cond_line_27_column_52
                    },
                    {
                        "event": "bar",
                        "onTransition": [
                            $assign_line_30_column_48,
                            $log_line_31_column_27
                        ]
                    }
                ],
                "states": [
                    {
                        "id": "a",
                        "states": [
                            {
                                "id": "a1",
                                "transitions": [
                                    {
                                        "event": "foo",
                                        "target": "a2",
                                        "onTransition": [
                                            $assign_line_37_column_55,
                                            $log_line_38_column_35
                                        ]
                                    }
                                ]
                            },
                            {
                                "id": "a2"
                            }
                        ]
                    },
                    {
                        "id": "b",
                        "states": [
                            {
                                "id": "b1",
                                "transitions": [
                                    {
                                        "event": "foo",
                                        "target": "b2",
                                        "onTransition": [
                                            $assign_line_49_column_63,
                                            $log_line_50_column_35
                                        ]
                                    }
                                ]
                            },
                            {
                                "id": "b2"
                            }
                        ]
                    },
                    {
                        "id": "c",
                        "transitions": [
                            {
                                "event": "foo",
                                "onTransition": [
                                    $assign_line_60_column_51,
                                    $log_line_61_column_31
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "id": "done"
            }
        ],
        "onEntry": [
            $initEarlyBindingDatamodel
        ],
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel
    };});
