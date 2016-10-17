//Generated on Tuesday, June 17, 2014 21:23:32 by the SCION SCXML compiler
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
    
    function $script_line_27_column_20(_event){
        x = 0;
    }
    
    function $script_line_35_column_20(_event){
        x = x + 1;
    }
    
    function $cond_line_34_column_49(_event){
        return x < 100;
    }
    
    function $cond_line_39_column_49(_event){
        return x === 100;
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
                        "onTransition": $script_line_27_column_20
                    }
                ]
            },
            {
                "id": "b",
                "transitions": [
                    {
                        "target": "b",
                        "cond": $cond_line_34_column_49,
                        "onTransition": $script_line_35_column_20
                    },
                    {
                        "target": "c",
                        "cond": $cond_line_39_column_49
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
