//Generated on Tuesday, June 17, 2014 21:23:29 by the SCION SCXML compiler
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
                "id": "a",
                "transitions": [
                    {
                        "target": "b",
                        "event": "foo bar bat"
                    }
                ]
            },
            {
                "id": "b",
                "transitions": [
                    {
                        "target": "c",
                        "event": "foo bar bat"
                    }
                ]
            },
            {
                "id": "c",
                "transitions": [
                    {
                        "target": "d",
                        "event": "foo bar bat"
                    }
                ]
            },
            {
                "id": "d"
            }
        ],
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel
    };});
