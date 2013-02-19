//Generated on Monday, February 18, 2013 23:37:27 by the SCION SCXML compiler

var x = $data_line_22_column_31();

function $assign_line_31_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_31_column_45.apply(this, arguments);
}

function $expr_line_31_column_45(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x + 1;
}

function $assign_line_27_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_27_column_45.apply(this, arguments);
}

function $expr_line_27_column_45(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x + 1;
}

function $assign_line_40_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_40_column_49.apply(this, arguments);
}

function $expr_line_40_column_49(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x + 1;
}

function $assign_line_36_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_36_column_49.apply(this, arguments);
}

function $expr_line_36_column_49(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x + 1;
}

function $cond_line_67_column_77(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 3;
}

function $assign_line_49_column_55(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_49_column_53.apply(this, arguments);
}

function $expr_line_49_column_53(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x + 1;
}

function $assign_line_45_column_55(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_45_column_53.apply(this, arguments);
}

function $expr_line_45_column_53(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x + 1;
}

function $assign_line_59_column_55(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_59_column_53.apply(this, arguments);
}

function $expr_line_59_column_53(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x + 1;
}

function $assign_line_55_column_55(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_55_column_53.apply(this, arguments);
}

function $expr_line_55_column_53(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x + 1;
}

function $cond_line_63_column_64(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 5;
}

function $cond_line_82_column_56(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 8;
}

function $data_line_22_column_31(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 0;
}

module.exports = {
    "states": [
        {
            "id": "p",
            "type": "parallel",
            "onEntry": $assign_line_27_column_47,
            "onExit": $assign_line_31_column_47,
            "states": [
                {
                    "id": "a",
                    "onEntry": $assign_line_36_column_51,
                    "onExit": $assign_line_40_column_51,
                    "states": [
                        {
                            "id": "a1",
                            "onEntry": $assign_line_45_column_55,
                            "onExit": $assign_line_49_column_55
                        },
                        {
                            "id": "a2",
                            "onEntry": $assign_line_55_column_55,
                            "onExit": $assign_line_59_column_55,
                            "transitions": [
                                {
                                    "target": "c",
                                    "event": "t2",
                                    "cond": $cond_line_63_column_64
                                }
                            ]
                        }
                    ],
                    "transitions": [
                        {
                            "target": "a2",
                            "event": "t1",
                            "type": "internal",
                            "cond": $cond_line_67_column_77
                        }
                    ]
                },
                {
                    "id": "b",
                    "states": [
                        {
                            "id": "b1"
                        },
                        {
                            "id": "b2"
                        }
                    ]
                }
            ]
        },
        {
            "id": "c",
            "transitions": [
                {
                    "target": "d",
                    "event": "t3",
                    "cond": $cond_line_82_column_56
                }
            ]
        },
        {
            "id": "d"
        }
    ]
};
