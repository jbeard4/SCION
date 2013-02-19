//Generated on Monday, February 18, 2013 23:38:31 by the SCION SCXML compiler

var x;

function $script_line_27_column_20(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = 0;
}

function $script_line_52_column_20(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = x * 2;
}

function $cond_line_51_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 100;
}

function $script_line_37_column_24(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = x + 1;
}

function $cond_line_36_column_52(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x < 100;
}

function $script_line_45_column_24(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = x + 1;
}

function $cond_line_44_column_52(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x < 100;
}

function $cond_line_60_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 200;
}

module.exports = {
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
                            "cond": $cond_line_36_column_52,
                            "onTransition": $script_line_37_column_24
                        }
                    ]
                },
                {
                    "id": "c",
                    "transitions": [
                        {
                            "target": "b",
                            "cond": $cond_line_44_column_52,
                            "onTransition": $script_line_45_column_24
                        }
                    ]
                }
            ],
            "transitions": [
                {
                    "target": "d",
                    "cond": $cond_line_51_column_47,
                    "onTransition": $script_line_52_column_20
                }
            ]
        },
        {
            "id": "d",
            "transitions": [
                {
                    "target": "e",
                    "cond": $cond_line_60_column_47
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
    ]
};
