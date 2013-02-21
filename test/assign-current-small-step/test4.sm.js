//Generated on Thursday, February 21, 2013 18:37:32 by the SCION SCXML compiler

function getDelayInMs(delayString){
    if (!delayString) {
        return 0;
    } else {
        if (delayString.slice(-2) === "ms") {
            return parseFloat(delayString.slice(0, -2));
        } else if (delayString.slice(-1) === "s") {
            return parseFloat(delayString.slice(0, -1)) * 1000;
        } else {
            return parseFloat(delayString);
        }
    }
}

var x;

function $assign_line_27_column_43(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_27_column_43.apply(this, arguments);
}

function $expr_line_27_column_43(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 2;
}

function $assign_line_35_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_35_column_47.apply(this, arguments);
}

function $expr_line_35_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x * 3;
}

function $log_line_36_column_37(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_36_column_37.apply(this, arguments));
}

function $expr_line_36_column_37(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 'b, x:' + x;
}

function $cond_line_53_column_48(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 30;
}

function $assign_line_41_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_41_column_51.apply(this, arguments);
}

function $expr_line_41_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x * 5;
}

function $log_line_42_column_42(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_42_column_42.apply(this, arguments));
}

function $expr_line_42_column_42(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 'b1, x:' + x;
}

function $assign_line_48_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_48_column_51.apply(this, arguments);
}

function $expr_line_48_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x * 7;
}

function $log_line_49_column_42(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_49_column_42.apply(this, arguments));
}

function $expr_line_49_column_42(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 'b2, x:' + x;
}

module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
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
                    "cond": $cond_line_53_column_48
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
