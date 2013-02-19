//Generated on Monday, February 18, 2013 23:14:47 by the SCION SCXML compiler

var x;

function $assign_line_28_column_44(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_28_column_42.apply(this, arguments);
}

function $expr_line_28_column_42(_event, In, _sessionId, _name, _ioprocessors, _x){
    return -1;
}

function $assign_line_29_column_44(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_29_column_42.apply(this, arguments);
}

function $expr_line_29_column_42(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 99;
}

function $assign_line_34_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_34_column_45.apply(this, arguments);
}

function $expr_line_34_column_45(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x + 1;
}

function $cond_line_33_column_57(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 99;
}

function $script_line_41_column_20(_event, In, _sessionId, _name, _ioprocessors, _x){
    x *= 2;
}

function $cond_line_46_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 200;
}

module.exports = {
    "states": [
        {
            "id": "a",
            "onEntry": [
                $assign_line_28_column_44,
                $assign_line_29_column_44
            ],
            "transitions": [
                {
                    "event": "t",
                    "target": "b",
                    "cond": $cond_line_33_column_57,
                    "onTransition": $assign_line_34_column_47
                }
            ]
        },
        {
            "id": "b",
            "onEntry": $script_line_41_column_20,
            "transitions": [
                {
                    "target": "c",
                    "cond": $cond_line_46_column_47
                },
                {
                    "target": "f"
                }
            ]
        },
        {
            "id": "c"
        },
        {
            "id": "f"
        }
    ]
};
