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
        x = 100;
    }
    
    function $cond_line_34_column_59(_event){
        return x === 100;
    }
    
    return {
        "": "http://www.w3.org/2005/07/scxml",
        "$type": "scxml",
        "states": [
            {
                "id": "intitial1",
                "transitions": [
                    {
                        "target": "a",
                        "onTransition": $script_line_27_column_20
                    }
                ]
            },
            {
                "id": "a",
                "transitions": [
                    {
                        "target": "b",
                        "event": "t",
                        "cond": $cond_line_34_column_59
                    },
                    {
                        "target": "f",
                        "event": "t"
                    }
                ]
            },
            {
                "id": "b"
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
