//Generated on Monday, February 18, 2013 23:14:47 by the SCION SCXML compiler

var i;

function $assign_line_30_column_43(_event, In, _sessionId, _name, _ioprocessors, _x){
    i = $expr_line_30_column_41.apply(this, arguments);
}

function $expr_line_30_column_41(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 0;
}

function $assign_line_36_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    i = $expr_line_36_column_45.apply(this, arguments);
}

function $expr_line_36_column_45(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i + 1;
}

function $cond_line_35_column_48(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i < 100;
}

function $cond_line_38_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i === 100;
}

module.exports = {
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "b",
                    "event": "t",
                    "onTransition": $assign_line_30_column_43
                }
            ]
        },
        {
            "id": "b",
            "transitions": [
                {
                    "target": "b",
                    "cond": $cond_line_35_column_48,
                    "onTransition": $assign_line_36_column_47
                },
                {
                    "target": "c",
                    "cond": $cond_line_38_column_47
                }
            ]
        },
        {
            "id": "c"
        }
    ]
};
