//Generated on Tuesday, June 17, 2014 21:23:25 by the SCION SCXML compiler
module.exports = (function(_x,_sessionid,_name,_ioprocessors,In){
    
    
    
    
    
    
    
    
    function $deserializeDatamodel($serializedDatamodel){
    
        $scion_early_binding_datamodel_has_fired = true;
    }
    
    function $serializeDatamodel(){
       return {
    
       };
    }
    
    function $expr_line_8_column_51(_event){
        return "exiting state A";
    }
    
    function $log_line_8_column_51(_event){
        this.log($expr_line_8_column_51.apply(this, arguments));
    }
    
    function $expr_line_5_column_52(_event){
        return "entering state A";
    }
    
    function $log_line_5_column_52(_event){
        this.log($expr_line_5_column_52.apply(this, arguments));
    }
    
    function $expr_line_11_column_51(_event){
        return "triggered by e1";
    }
    
    function $log_line_11_column_51(_event){
        this.log($expr_line_11_column_51.apply(this, arguments));
    }
    
    function $expr_line_16_column_51(_event){
        return "triggered by e2";
    }
    
    function $log_line_16_column_51(_event){
        this.log($expr_line_16_column_51.apply(this, arguments));
    }
    
    return {
        "ns0": "http://www.w3.org/2005/07/scxml",
        "name": "root",
        "$type": "scxml",
        "states": [
            {
                "id": "A",
                "onEntry": $log_line_5_column_52,
                "onExit": $log_line_8_column_51,
                "transitions": [
                    {
                        "target": "B",
                        "event": "e1",
                        "onTransition": $log_line_11_column_51
                    }
                ]
            },
            {
                "id": "B",
                "transitions": [
                    {
                        "target": "A",
                        "event": "e2",
                        "onTransition": $log_line_16_column_51
                    }
                ]
            }
        ],
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel
    };});
