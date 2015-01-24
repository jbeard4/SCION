//Generated on Tuesday, June 17, 2014 21:23:27 by the SCION SCXML compiler
module.exports = (function(_x,_sessionid,_name,_ioprocessors,In){
    
    
    
    
    
    
    
    
    function $deserializeDatamodel($serializedDatamodel){
    
        $scion_early_binding_datamodel_has_fired = true;
    }
    
    function $serializeDatamodel(){
       return {
    
       };
    }
    
    
    
    return {
        "": "http://www.w3.org/2005/07/scxml",
        "$type": "scxml",
        "states": [
            {
                "id": "p",
                "$type": "parallel",
                "states": [
                    {
                        "id": "a",
                        "transitions": [
                            {
                                "target": "a",
                                "event": "t"
                            }
                        ]
                    },
                    {
                        "id": "b"
                    }
                ]
            }
        ],
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel
    };});
