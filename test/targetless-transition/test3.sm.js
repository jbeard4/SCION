//Generated on Thursday, February 21, 2013 18:44:39 by the SCION SCXML compiler



var i = $data_line_22_column_31();

function $cond_line_27_column_52(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i === 100;
}

function $expr_line_30_column_48(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i * 20;
}

function $assign_line_30_column_48(_event, In, _sessionId, _name, _ioprocessors, _x){
    i = $expr_line_30_column_48.apply(this, arguments);
}

function $expr_line_31_column_27(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i;
}

function $log_line_31_column_27(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_31_column_27.apply(this, arguments));
}

function $expr_line_37_column_55(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i * 2;
}

function $assign_line_37_column_55(_event, In, _sessionId, _name, _ioprocessors, _x){
    i = $expr_line_37_column_55.apply(this, arguments);
}

function $expr_line_38_column_35(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i;
}

function $log_line_38_column_35(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_38_column_35.apply(this, arguments));
}

function $expr_line_49_column_63(_event, In, _sessionId, _name, _ioprocessors, _x){
    return Math.pow(i,3);
}

function $assign_line_49_column_63(_event, In, _sessionId, _name, _ioprocessors, _x){
    i = $expr_line_49_column_63.apply(this, arguments);
}

function $expr_line_50_column_35(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i;
}

function $log_line_50_column_35(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_50_column_35.apply(this, arguments));
}

function $expr_line_60_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i - 3;
}

function $assign_line_60_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    i = $expr_line_60_column_51.apply(this, arguments);
}

function $expr_line_61_column_31(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i;
}

function $log_line_61_column_31(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_61_column_31.apply(this, arguments));
}

function $data_line_22_column_31(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 1;
}

module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "p",
            "type": "parallel",
            "transitions": [
                {
                    "target": "done",
                    "cond": $cond_line_27_column_52
                },
                {
                    "event": "bar",
                    "onTransition": [
                        $assign_line_30_column_48,
                        $log_line_31_column_27
                    ]
                }
            ],
            "states": [
                {
                    "id": "a",
                    "states": [
                        {
                            "id": "a1",
                            "transitions": [
                                {
                                    "event": "foo",
                                    "target": "a2",
                                    "onTransition": [
                                        $assign_line_37_column_55,
                                        $log_line_38_column_35
                                    ]
                                }
                            ]
                        },
                        {
                            "id": "a2"
                        }
                    ]
                },
                {
                    "id": "b",
                    "states": [
                        {
                            "id": "b1",
                            "transitions": [
                                {
                                    "event": "foo",
                                    "target": "b2",
                                    "onTransition": [
                                        $assign_line_49_column_63,
                                        $log_line_50_column_35
                                    ]
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
                    "transitions": [
                        {
                            "event": "foo",
                            "onTransition": [
                                $assign_line_60_column_51,
                                $log_line_61_column_31
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "id": "done"
        }
    ]
};
