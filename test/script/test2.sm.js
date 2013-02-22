//Generated on Thursday, February 21, 2013 19:49:15 by the SCION SCXML compiler



var x;

var $scion_early_binding_datamodel_has_fired = false;
function $initEarlyBindingDatamodel(_event, In, _sessionId, _name, _ioprocessors, _x){
    if(!$scion_early_binding_datamodel_has_fired){
        $scion_early_binding_datamodel_has_fired = true; 
    }
}

function $script_line_27_column_20(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = 0;
}

function $script_line_52_column_20(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = x * 2;
}

function $cond_line_51_column_48(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 100;
}

function $script_line_37_column_24(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = x + 1;
}

function $cond_line_36_column_53(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x < 100;
}

function $script_line_45_column_24(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = x + 1;
}

function $cond_line_44_column_53(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x < 100;
}

function $cond_line_60_column_49(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 200;
}

module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "b",
                    "event": "t",
                    "onTransition": $script_line_27_column_20
                }
            ]
        },
        {
            "id": "A",
            "states": [
                {
                    "id": "b",
                    "transitions": [
                        {
                            "target": "c",
                            "cond": $cond_line_36_column_53,
                            "onTransition": $script_line_37_column_24
                        }
                    ]
                },
                {
                    "id": "c",
                    "transitions": [
                        {
                            "target": "b",
                            "cond": $cond_line_44_column_53,
                            "onTransition": $script_line_45_column_24
                        }
                    ]
                }
            ],
            "transitions": [
                {
                    "target": "d",
                    "cond": $cond_line_51_column_48,
                    "onTransition": $script_line_52_column_20
                }
            ]
        },
        {
            "id": "d",
            "transitions": [
                {
                    "target": "e",
                    "cond": $cond_line_60_column_49
                },
                {
                    "target": "f"
                }
            ]
        },
        {
            "id": "e"
        },
        {
            "id": "f"
        }
    ],
    "onEntry": [
        $initEarlyBindingDatamodel
    ]
};
