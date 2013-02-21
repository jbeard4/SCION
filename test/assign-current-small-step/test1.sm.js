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

var i;

function $assign_line_30_column_43(_event, In, _sessionId, _name, _ioprocessors, _x){
    i = $expr_line_30_column_43.apply(this, arguments);
}

function $expr_line_30_column_43(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 0;
}

function $assign_line_36_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    i = $expr_line_36_column_47.apply(this, arguments);
}

function $expr_line_36_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i + 1;
}

function $cond_line_35_column_49(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i < 100;
}

function $cond_line_38_column_49(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i === 100;
}

module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
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
                    "cond": $cond_line_35_column_49,
                    "onTransition": $assign_line_36_column_47
                },
                {
                    "target": "c",
                    "cond": $cond_line_38_column_49
                }
            ]
        },
        {
            "id": "c"
        }
    ]
};
