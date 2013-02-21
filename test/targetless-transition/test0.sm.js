//Generated on Thursday, February 21, 2013 18:37:37 by the SCION SCXML compiler

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

var i = $data_line_22_column_31();

function $cond_line_30_column_52(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i === 100;
}

function $assign_line_32_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    i = $expr_line_32_column_47.apply(this, arguments);
}

function $expr_line_32_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i + 1;
}

function $data_line_22_column_31(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 0;
}

module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "b",
                    "event": "t"
                }
            ]
        },
        {
            "id": "b",
            "transitions": [
                {
                    "target": "done",
                    "cond": $cond_line_30_column_52
                },
                {
                    "onTransition": $assign_line_32_column_47
                }
            ]
        },
        {
            "id": "done"
        }
    ]
};
