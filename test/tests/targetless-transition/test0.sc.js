//Generated on Tuesday, June 17, 2014 21:23:32 by the SCION SCXML compiler
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
    
    function $cond_line_30_column_52(_event){
        return i === 100;
    }
    
    function $expr_line_32_column_47(_event){
        return i + 1;
    }
    
    function $assign_line_32_column_47(_event){
        i = $expr_line_32_column_47.apply(this, arguments);
    }
    
    function $data_line_22_column_31(_event){
        return 0;
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
                        "event": "t"
                    }
                ]
            },
            {
                "id": "b",
                "transitions": [
                    {
                        "target": "done",
                        "cond": $cond_line_30_column_52
                    },
                    {
                        "onTransition": $assign_line_32_column_47
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
