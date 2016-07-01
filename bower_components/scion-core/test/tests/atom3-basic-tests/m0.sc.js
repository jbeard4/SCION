//Generated on Tuesday, June 17, 2014 21:23:25 by the SCION SCXML compiler
module.exports = (function(_x,_sessionid,_name,_ioprocessors,In){
    
    
    
    
    
    
    
    
    function $deserializeDatamodel($serializedDatamodel){
    
        $scion_early_binding_datamodel_has_fired = true;
    }
    
    function $serializeDatamodel(){
       return {
    
       };
    }
    
    function $expr_line_8_column_45(_event){
        return "exiting A";
    }
    
    function $log_line_8_column_45(_event){
        this.log($expr_line_8_column_45.apply(this, arguments));
    }
    
    function $expr_line_5_column_46(_event){
        return "entering A";
    }
    
    function $log_line_5_column_46(_event){
        this.log($expr_line_5_column_46.apply(this, arguments));
    }
    
    function $expr_line_11_column_60(_event){
        return "doing A->B transition";
    }
    
    function $log_line_11_column_60(_event){
        this.log($expr_line_11_column_60.apply(this, arguments));
    }
    
    return {
        "ns0": "http://www.w3.org/2005/07/scxml",
        "name": "root",
        "$type": "scxml",
        "states": [
            {
                "id": "A",
                "onEntry": $log_line_5_column_46,
                "onExit": $log_line_8_column_45,
                "transitions": [
                    {
                        "target": "B",
                        "event": "e1",
                        "onTransition": $log_line_11_column_60
                    }
                ]
            },
            {
                "id": "B",
                "transitions": [
                    {
                        "target": "A",
                        "event": "e2"
                    }
                ]
            }
        ],
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel
    };});
