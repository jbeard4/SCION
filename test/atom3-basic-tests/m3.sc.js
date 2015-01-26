//Generated on Tuesday, June 17, 2014 21:23:25 by the SCION SCXML compiler
module.exports = (function(_x,_sessionid,_name,_ioprocessors,In){
    
    
    
    
    
    
    
    
    function $deserializeDatamodel($serializedDatamodel){
    
        $scion_early_binding_datamodel_has_fired = true;
    }
    
    function $serializeDatamodel(){
       return {
    
       };
    }
    
    function $expr_line_12_column_53(_event){
        return "exiting state A";
    }
    
    function $log_line_12_column_53(_event){
        this.log($expr_line_12_column_53.apply(this, arguments));
    }
    
    function $expr_line_9_column_54(_event){
        return "entering state A";
    }
    
    function $log_line_9_column_54(_event){
        this.log($expr_line_9_column_54.apply(this, arguments));
    }
    
    function $expr_line_15_column_53(_event){
        return "triggered by e1";
    }
    
    function $log_line_15_column_53(_event){
        this.log($expr_line_15_column_53.apply(this, arguments));
    }
    
    function $expr_line_20_column_53(_event){
        return "triggered by e2";
    }
    
    function $log_line_20_column_53(_event){
        this.log($expr_line_20_column_53.apply(this, arguments));
    }
    
    function $expr_line_30_column_51(_event){
        return "exiting state C";
    }
    
    function $log_line_30_column_51(_event){
        this.log($expr_line_30_column_51.apply(this, arguments));
    }
    
    function $expr_line_27_column_52(_event){
        return "entering state C";
    }
    
    function $log_line_27_column_52(_event){
        this.log($expr_line_27_column_52.apply(this, arguments));
    }
    
    return {
        "ns0": "http://www.w3.org/2005/07/scxml",
        "name": "root",
        "$type": "scxml",
        "states": [
            {
                "id": "AB",
                "states": [
                    {
                        "$type": "initial",
                        "transitions": [
                            {
                                "target": "A"
                            }
                        ]
                    },
                    {
                        "id": "A",
                        "onEntry": $log_line_9_column_54,
                        "onExit": $log_line_12_column_53,
                        "transitions": [
                            {
                                "target": "B",
                                "event": "e1",
                                "onTransition": $log_line_15_column_53
                            }
                        ]
                    },
                    {
                        "id": "B",
                        "transitions": [
                            {
                                "target": "A",
                                "event": "e2",
                                "onTransition": $log_line_20_column_53
                            }
                        ]
                    }
                ],
                "transitions": [
                    {
                        "target": "C",
                        "event": "e1"
                    }
                ]
            },
            {
                "id": "C",
                "onEntry": $log_line_27_column_52,
                "onExit": $log_line_30_column_51
            }
        ],
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel
    };});
