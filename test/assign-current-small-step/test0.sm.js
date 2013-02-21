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

function $assign_line_28_column_44(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_28_column_44.apply(this, arguments);
}

function $expr_line_28_column_44(_event, In, _sessionId, _name, _ioprocessors, _x){
    return -1;
}

function $assign_line_29_column_44(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_29_column_44.apply(this, arguments);
}

function $expr_line_29_column_44(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 99;
}

function $assign_line_34_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_34_column_47.apply(this, arguments);
}

function $expr_line_34_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x + 1;
}

function $cond_line_33_column_58(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 99;
}

function $script_line_41_column_20(_event, In, _sessionId, _name, _ioprocessors, _x){
    x *= 2;
}

function $cond_line_46_column_49(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 200;
}

module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
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
                    "cond": $cond_line_33_column_58,
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
                    "cond": $cond_line_46_column_49
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
