//Generated on Thursday, February 21, 2013 19:56:28 by the SCION SCXML compiler



var x;

var $scion_early_binding_datamodel_has_fired = false;
function $initEarlyBindingDatamodel(_event, In, _sessionId, _name, _ioprocessors, _x){
    if(!$scion_early_binding_datamodel_has_fired){
        $scion_early_binding_datamodel_has_fired = true; 
    }
}

function $script_line_27_column_20(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = 100;
}

function $cond_line_34_column_59(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 100;
}

module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "intitial1",
            "transitions": [
                {
                    "target": "a",
                    "onTransition": $script_line_27_column_20
                }
            ]
        },
        {
            "id": "a",
            "transitions": [
                {
                    "target": "b",
                    "event": "t",
                    "cond": $cond_line_34_column_59
                },
                {
                    "target": "f",
                    "event": "t"
                }
            ]
        },
        {
            "id": "b"
        },
        {
            "id": "f"
        }
    ],
    "onEntry": [
        $initEarlyBindingDatamodel
    ]
};
