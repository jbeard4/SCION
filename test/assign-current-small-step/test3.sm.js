//Generated on Thursday, February 21, 2013 19:49:11 by the SCION SCXML compiler



var i;

var $scion_early_binding_datamodel_has_fired = false;
function $initEarlyBindingDatamodel(_event, In, _sessionId, _name, _ioprocessors, _x){
    if(!$scion_early_binding_datamodel_has_fired){
        $scion_early_binding_datamodel_has_fired = true; 
    }
}

function $expr_line_30_column_43(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 0;
}

function $assign_line_30_column_43(_event, In, _sessionId, _name, _ioprocessors, _x){
    i = $expr_line_30_column_43.apply(this, arguments);
}

function $cond_line_58_column_58(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i === 0;
}

function $expr_line_39_column_55(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i + 1;
}

function $assign_line_39_column_55(_event, In, _sessionId, _name, _ioprocessors, _x){
    i = $expr_line_39_column_55.apply(this, arguments);
}

function $expr_line_50_column_55(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i - 1;
}

function $assign_line_50_column_55(_event, In, _sessionId, _name, _ioprocessors, _x){
    i = $expr_line_50_column_55.apply(this, arguments);
}

module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "p",
                    "event": "t1",
                    "onTransition": $assign_line_30_column_43
                }
            ]
        },
        {
            "id": "p",
            "type": "parallel",
            "states": [
                {
                    "id": "b",
                    "initial": "b1",
                    "states": [
                        {
                            "id": "b1",
                            "transitions": [
                                {
                                    "event": "t2",
                                    "target": "b2",
                                    "onTransition": $assign_line_39_column_55
                                }
                            ]
                        },
                        {
                            "id": "b2"
                        }
                    ]
                },
                {
                    "id": "c",
                    "initial": "c1",
                    "states": [
                        {
                            "id": "c1",
                            "transitions": [
                                {
                                    "event": "t2",
                                    "target": "c2",
                                    "onTransition": $assign_line_50_column_55
                                }
                            ]
                        },
                        {
                            "id": "c2"
                        }
                    ]
                }
            ],
            "transitions": [
                {
                    "event": "t3",
                    "target": "d",
                    "cond": $cond_line_58_column_58
                },
                {
                    "event": "t3",
                    "target": "f"
                }
            ]
        },
        {
            "id": "d"
        },
        {
            "id": "f"
        }
    ],
    "onEntry": [
        $initEarlyBindingDatamodel
    ]
};
