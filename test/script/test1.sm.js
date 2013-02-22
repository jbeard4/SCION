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

function $script_line_35_column_20(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = x + 1;
}

function $cond_line_34_column_49(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x < 100;
}

function $cond_line_39_column_49(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 100;
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
            "id": "b",
            "transitions": [
                {
                    "target": "b",
                    "cond": $cond_line_34_column_49,
                    "onTransition": $script_line_35_column_20
                },
                {
                    "target": "c",
                    "cond": $cond_line_39_column_49
                }
            ]
        },
        {
            "id": "c"
        }
    ],
    "onEntry": [
        $initEarlyBindingDatamodel
    ]
};
