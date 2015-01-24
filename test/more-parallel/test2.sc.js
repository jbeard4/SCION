//Generated on Tuesday, June 17, 2014 21:23:28 by the SCION SCXML compiler
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
                                "event": "t",
                                "target": "a"
                            }
                        ],
                        "states": [
                            {
                                "id": "a1"
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
                                        "event": "t",
                                        "target": "b2"
                                    }
                                ]
                            },
                            {
                                "id": "b2"
                            }
                        ]
                    }
                ]
            }
        ],
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel
    };});
