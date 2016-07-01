//Generated on Tuesday, June 17, 2014 21:23:32 by the SCION SCXML compiler
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
                        "event": "foo"
                    }
                ]
            },
            {
                "id": "b",
                "transitions": [
                    {
                        "target": "c",
                        "event": "foo.bar"
                    }
                ]
            },
            {
                "id": "c",
                "transitions": [
                    {
                        "target": "d",
                        "event": "foo.bar.bat"
                    }
                ]
            },
            {
                "id": "d",
                "transitions": [
                    {
                        "target": "e",
                        "event": "foo.*"
                    },
                    {
                        "target": "fail",
                        "event": "foo"
                    }
                ]
            },
            {
                "id": "e",
                "transitions": [
                    {
                        "target": "f",
                        "event": "foo.bar.*"
                    },
                    {
                        "target": "fail",
                        "event": "foo.bar"
                    }
                ]
            },
            {
                "id": "f",
                "transitions": [
                    {
                        "target": "g",
                        "event": "foo.bar.bat.*"
                    },
                    {
                        "target": "fail",
                        "event": "foo.bar.bat"
                    }
                ]
            },
            {
                "id": "g"
            },
            {
                "id": "fail"
            }
        ],
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel
    };});
