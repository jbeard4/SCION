//Generated on Monday, February 18, 2013 23:38:31 by the SCION SCXML compiler

var x;

function $script_line_27_column_20(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = 0;
}

function $script_line_35_column_20(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = x + 1;
}

function $cond_line_34_column_48(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x < 100;
}

function $cond_line_39_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 100;
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
            "id": "b",
            "transitions": [
                {
                    "target": "b",
                    "cond": $cond_line_34_column_48,
                    "onTransition": $script_line_35_column_20
                },
                {
                    "target": "c",
                    "cond": $cond_line_39_column_47
                }
            ]
        },
        {
            "id": "c"
        }
    ]
};
