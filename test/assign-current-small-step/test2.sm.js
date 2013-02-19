//Generated on Monday, February 18, 2013 23:14:47 by the SCION SCXML compiler

var i;

function $assign_line_30_column_43(_event, In, _sessionId, _name, _ioprocessors, _x){
    i = $expr_line_30_column_41.apply(this, arguments);
}

function $expr_line_30_column_41(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 0;
}

function $assign_line_49_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    i = $expr_line_49_column_45.apply(this, arguments);
}

function $expr_line_49_column_45(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i * 2;
}

function $cond_line_48_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i === 100;
}

function $assign_line_38_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    i = $expr_line_38_column_49.apply(this, arguments);
}

function $expr_line_38_column_49(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i + 1;
}

function $cond_line_37_column_52(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i < 100;
}

function $assign_line_44_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    i = $expr_line_44_column_49.apply(this, arguments);
}

function $expr_line_44_column_49(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i + 1;
}

function $cond_line_43_column_52(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i < 100;
}

function $cond_line_55_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i === 200;
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
            "id": "A",
            "states": [
                {
                    "id": "b",
                    "transitions": [
                        {
                            "target": "c",
                            "cond": $cond_line_37_column_52,
                            "onTransition": $assign_line_38_column_51
                        }
                    ]
                },
                {
                    "id": "c",
                    "transitions": [
                        {
                            "target": "b",
                            "cond": $cond_line_43_column_52,
                            "onTransition": $assign_line_44_column_51
                        }
                    ]
                }
            ],
            "transitions": [
                {
                    "target": "d",
                    "cond": $cond_line_48_column_47,
                    "onTransition": $assign_line_49_column_47
                }
            ]
        },
        {
            "id": "d",
            "transitions": [
                {
                    "target": "e",
                    "cond": $cond_line_55_column_47
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
