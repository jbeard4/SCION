//Generated on Tuesday, June 17, 2014 21:23:24 by the SCION SCXML compiler
module.exports = (function(_x,_sessionid,_name,_ioprocessors,In){
    
    
    
    
    var i;
    
    var $scion_early_binding_datamodel_has_fired= false;
    function $initEarlyBindingDatamodel(_event){
        if(!$scion_early_binding_datamodel_has_fired){
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
    
    function $expr_line_30_column_43(_event){
        return 0;
    }
    
    function $assign_line_30_column_43(_event){
        i = $expr_line_30_column_43.apply(this, arguments);
    }
    
    function $expr_line_36_column_47(_event){
        return i + 1;
    }
    
    function $assign_line_36_column_47(_event){
        i = $expr_line_36_column_47.apply(this, arguments);
    }
    
    function $cond_line_35_column_49(_event){
        return i < 100;
    }
    
    function $cond_line_38_column_49(_event){
        return i === 100;
    }
    
    return {
        "": "http://www.w3.org/2005/07/scxml",
        "$type": "scxml",
        "states": [
            {
                "id": "a",
                "transitions": [
                    {
                        "target": "b",
                        "event": "t",
                        "onTransition": $assign_line_30_column_43
                    }
                ]
            },
            {
                "id": "b",
                "transitions": [
                    {
                        "target": "b",
                        "cond": $cond_line_35_column_49,
                        "onTransition": $assign_line_36_column_47
                    },
                    {
                        "target": "c",
                        "cond": $cond_line_38_column_49
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
