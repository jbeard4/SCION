//Generated on Tuesday, June 17, 2014 21:23:25 by the SCION SCXML compiler
module.exports = (function(_x,_sessionid,_name,_ioprocessors,In){
    
    
    
    
    
    
    
    
    function $deserializeDatamodel($serializedDatamodel){
    
        $scion_early_binding_datamodel_has_fired = true;
    }
    
    function $serializeDatamodel(){
       return {
    
       };
    }
    
    function $cond_line_22_column_55(_event){
        return false;
    }
    
    function $cond_line_23_column_54(_event){
        return true;
    }
    
    return {
        "": "http://www.w3.org/2005/07/scxml",
        "$type": "scxml",
        "states": [
            {
                "id": "a",
                "transitions": [
                    {
                        "target": "f",
                        "event": "t",
                        "cond": $cond_line_22_column_55
                    },
                    {
                        "target": "b",
                        "event": "t",
                        "cond": $cond_line_23_column_54
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
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel
    };});
