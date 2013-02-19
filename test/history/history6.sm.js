//Generated on Monday, February 18, 2013 23:33:36 by the SCION SCXML compiler

var x = $data_line_23_column_31();

function $assign_line_32_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_32_column_45.apply(this, arguments);
}

function $expr_line_32_column_45(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x * 3;
}

function $log_line_33_column_37(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_33_column_35.apply(this, arguments));
}

function $expr_line_33_column_35(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 'b, x:' + x;
}

function $cond_line_60_column_65(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 4410;
}

function $cond_line_62_column_69(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 1470;
}

function $assign_line_44_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_44_column_49.apply(this, arguments);
}

function $expr_line_44_column_49(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x * 5;
}

function $log_line_45_column_42(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_45_column_40.apply(this, arguments));
}

function $expr_line_45_column_40(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 'b2, x:' + x;
}

function $assign_line_52_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_52_column_49.apply(this, arguments);
}

function $expr_line_52_column_49(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x * 7;
}

function $log_line_53_column_42(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_53_column_40.apply(this, arguments));
}

function $expr_line_53_column_40(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 'b3, x:' + x;
}

function $data_line_23_column_31(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 2;
}

module.exports = {
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
                    "cond": $cond_line_60_column_65
                },
                {
                    "event": "t4",
                    "target": "really-fail",
                    "cond": $cond_line_62_column_69
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
    ]
};
