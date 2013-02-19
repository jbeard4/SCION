//Generated on Monday, February 18, 2013 23:14:47 by the SCION SCXML compiler

var i;

function $assign_line_30_column_43(_event, In, _sessionId, _name, _ioprocessors, _x){
    i = $expr_line_30_column_41.apply(this, arguments);
}

function $expr_line_30_column_41(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 0;
}

function $cond_line_58_column_56(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i === 0;
}

function $assign_line_39_column_55(_event, In, _sessionId, _name, _ioprocessors, _x){
    i = $expr_line_39_column_53.apply(this, arguments);
}

function $expr_line_39_column_53(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i + 1;
}

function $assign_line_50_column_55(_event, In, _sessionId, _name, _ioprocessors, _x){
    i = $expr_line_50_column_53.apply(this, arguments);
}

function $expr_line_50_column_53(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i - 1;
}

module.exports = {
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
                    "cond": $cond_line_58_column_56
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
    ]
};
