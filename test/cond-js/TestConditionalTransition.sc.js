//Generated on Thursday, February 21, 2013 19:56:24 by the SCION SCXML compiler







function $cond_line_55_column_57(_event, In, _sessionId, _name, _ioprocessors, _x){
    return false;
}

function $cond_line_56_column_56(_event, In, _sessionId, _name, _ioprocessors, _x){
    return true;
}

function $cond_line_65_column_57(_event, In, _sessionId, _name, _ioprocessors, _x){
    return false;
}

function $cond_line_66_column_57(_event, In, _sessionId, _name, _ioprocessors, _x){
    return false;
}

function $cond_line_67_column_56(_event, In, _sessionId, _name, _ioprocessors, _x){
    return true;
}

function $cond_line_92_column_58(_event, In, _sessionId, _name, _ioprocessors, _x){
    return true;
}

function $cond_line_82_column_59(_event, In, _sessionId, _name, _ioprocessors, _x){
    return true;
}

function $cond_line_87_column_60(_event, In, _sessionId, _name, _ioprocessors, _x){
    return false;
}

module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "name": "root",
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "b"
                }
            ]
        },
        {
            "id": "b",
            "transitions": [
                {
                    "target": "c",
                    "event": "t1"
                }
            ]
        },
        {
            "id": "c",
            "transitions": [
                {
                    "target": "d1"
                },
                {
                    "target": "d2"
                }
            ]
        },
        {
            "id": "d1",
            "transitions": [
                {
                    "target": "e1",
                    "event": "t2"
                },
                {
                    "target": "e2",
                    "event": "t2"
                }
            ]
        },
        {
            "id": "d2"
        },
        {
            "id": "e1",
            "transitions": [
                {
                    "target": "f1",
                    "event": "t3",
                    "cond": $cond_line_55_column_57
                },
                {
                    "target": "f2",
                    "event": "t3",
                    "cond": $cond_line_56_column_56
                }
            ]
        },
        {
            "id": "e2"
        },
        {
            "id": "f1"
        },
        {
            "id": "f2",
            "transitions": [
                {
                    "target": "g1",
                    "event": "t4",
                    "cond": $cond_line_65_column_57
                },
                {
                    "target": "g2",
                    "event": "t4",
                    "cond": $cond_line_66_column_57
                },
                {
                    "target": "g3",
                    "event": "t4",
                    "cond": $cond_line_67_column_56
                }
            ]
        },
        {
            "id": "g1"
        },
        {
            "id": "g2"
        },
        {
            "id": "g3",
            "states": [
                {
                    "type": "initial",
                    "transitions": [
                        {
                            "target": "h"
                        }
                    ]
                },
                {
                    "id": "h",
                    "transitions": [
                        {
                            "target": "i",
                            "event": "t5",
                            "cond": $cond_line_82_column_59
                        }
                    ]
                },
                {
                    "id": "i",
                    "transitions": [
                        {
                            "target": "j",
                            "event": "t5",
                            "cond": $cond_line_87_column_60
                        }
                    ]
                },
                {
                    "id": "j"
                }
            ],
            "transitions": [
                {
                    "target": "last",
                    "event": "t5",
                    "cond": $cond_line_92_column_58
                }
            ]
        },
        {
            "id": "last"
        }
    ]
};
