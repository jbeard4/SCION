//Generated on Thursday, February 21, 2013 19:49:12 by the SCION SCXML compiler



var x;

var $scion_early_binding_datamodel_has_fired = false;
function $initEarlyBindingDatamodel(_event, In, _sessionId, _name, _ioprocessors, _x){
    if(!$scion_early_binding_datamodel_has_fired){
        x = $data_line_23_column_31.apply(this, arguments);
        $scion_early_binding_datamodel_has_fired = true; 
    }
}

function $expr_line_32_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x * 3;
}

function $assign_line_32_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_32_column_47.apply(this, arguments);
}

function $expr_line_33_column_37(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 'b, x:' + x;
}

function $log_line_33_column_37(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_33_column_37.apply(this, arguments));
}

function $cond_line_60_column_67(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 4410;
}

function $cond_line_62_column_71(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 1470;
}

function $expr_line_44_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x * 5;
}

function $assign_line_44_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_44_column_51.apply(this, arguments);
}

function $expr_line_45_column_42(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 'b2, x:' + x;
}

function $log_line_45_column_42(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_45_column_42.apply(this, arguments));
}

function $expr_line_52_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x * 7;
}

function $assign_line_52_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_52_column_51.apply(this, arguments);
}

function $expr_line_53_column_42(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 'b3, x:' + x;
}

function $log_line_53_column_42(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_53_column_42.apply(this, arguments));
}

function $data_line_23_column_31(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 2;
}

module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "a",
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "h",
                    "event": "t1"
                }
            ]
        },
        {
            "id": "b",
            "initial": "b1",
            "onEntry": [
                $assign_line_32_column_47,
                $log_line_33_column_37
            ],
            "states": [
                {
                    "id": "h",
                    "type": "history",
                    "transitions": [
                        {
                            "target": "b2"
                        }
                    ]
                },
                {
                    "id": "b1"
                },
                {
                    "id": "b2",
                    "onEntry": [
                        $assign_line_44_column_51,
                        $log_line_45_column_42
                    ],
                    "transitions": [
                        {
                            "event": "t2",
                            "target": "b3"
                        }
                    ]
                },
                {
                    "id": "b3",
                    "onEntry": [
                        $assign_line_52_column_51,
                        $log_line_53_column_42
                    ],
                    "transitions": [
                        {
                            "event": "t3",
                            "target": "a"
                        }
                    ]
                }
            ],
            "transitions": [
                {
                    "event": "t4",
                    "target": "success",
                    "cond": $cond_line_60_column_67
                },
                {
                    "event": "t4",
                    "target": "really-fail",
                    "cond": $cond_line_62_column_71
                },
                {
                    "event": "t4",
                    "target": "fail"
                }
            ]
        },
        {
            "id": "success"
        },
        {
            "id": "fail"
        },
        {
            "id": "really-fail"
        }
    ],
    "onEntry": [
        $initEarlyBindingDatamodel
    ]
};
