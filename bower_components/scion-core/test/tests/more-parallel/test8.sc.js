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
                "id": "x",
                "transitions": [
                    {
                        "event": "t",
                        "target": "a22"
                    }
                ]
            },
            {
                "id": "p",
                "$type": "parallel",
                "states": [
                    {
                        "id": "a",
                        "states": [
                            {
                                "id": "a1",
                                "states": [
                                    {
                                        "id": "a11"
                                    },
                                    {
                                        "id": "a12"
                                    }
                                ]
                            },
                            {
                                "id": "a2",
                                "states": [
                                    {
                                        "id": "a21"
                                    },
                                    {
                                        "id": "a22"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "id": "b",
                        "states": [
                            {
                                "id": "b1",
                                "states": [
                                    {
                                        "id": "b11"
                                    },
                                    {
                                        "id": "b12"
                                    }
                                ]
                            },
                            {
                                "id": "b2",
                                "states": [
                                    {
                                        "id": "b21"
                                    },
                                    {
                                        "id": "b22"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel
    };});
