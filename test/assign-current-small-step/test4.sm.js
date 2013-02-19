//Generated on Monday, February 18, 2013 23:14:47 by the SCION SCXML compiler

var x;

function $assign_line_27_column_43(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_27_column_41.apply(this, arguments);
}

function $expr_line_27_column_41(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 2;
}

function $assign_line_35_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_35_column_45.apply(this, arguments);
}

function $expr_line_35_column_45(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x * 3;
}

function $log_line_36_column_37(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_36_column_35.apply(this, arguments));
}

function $expr_line_36_column_35(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 'b, x:' + x;
}

function $cond_line_53_column_46(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 30;
}

function $assign_line_41_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_41_column_49.apply(this, arguments);
}

function $expr_line_41_column_49(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x * 5;
}

function $log_line_42_column_42(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_42_column_40.apply(this, arguments));
}

function $expr_line_42_column_40(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 'b1, x:' + x;
}

function $assign_line_48_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_48_column_49.apply(this, arguments);
}

function $expr_line_48_column_49(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x * 7;
}

function $log_line_49_column_42(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_49_column_40.apply(this, arguments));
}

function $expr_line_49_column_40(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 'b2, x:' + x;
}

module.exports = {
    "states": [
        {
            "id": "a",
            "onEntry": $assign_line_27_column_43,
            "transitions": [
                {
                    "event": "t",
                    "target": "b1"
                }
            ]
        },
        {
            "id": "b",
            "onEntry": [
                $assign_line_35_column_47,
                $log_line_36_column_37
            ],
            "states": [
                {
                    "id": "b1",
                    "onEntry": [
                        $assign_line_41_column_51,
                        $log_line_42_column_42
                    ]
                },
                {
                    "id": "b2",
                    "onEntry": [
                        $assign_line_48_column_51,
                        $log_line_49_column_42
                    ]
                }
            ],
            "transitions": [
                {
                    "target": "c",
                    "cond": $cond_line_53_column_46
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
