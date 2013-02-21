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

function $assign_line_27_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    i = $expr_line_27_column_47.apply(this, arguments);
}

function $expr_line_27_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i * 2;
}

function $assign_line_30_column_55(_event, In, _sessionId, _name, _ioprocessors, _x){
    i = $expr_line_30_column_55.apply(this, arguments);
}

function $expr_line_30_column_55(_event, In, _sessionId, _name, _ioprocessors, _x){
    return Math.pow(i,3);
}

function $cond_line_39_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i === 27;
}

function $assign_line_35_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    i = $expr_line_35_column_51.apply(this, arguments);
}

function $expr_line_35_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i + 2;
}

function $data_line_22_column_31(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 1;
}

module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "A",
            "transitions": [
                {
                    "event": "foo",
                    "onTransition": $assign_line_27_column_47
                },
                {
                    "event": "bar",
                    "onTransition": $assign_line_30_column_55
                },
                {
                    "target": "done",
                    "cond": $cond_line_39_column_51
                }
            ],
            "states": [
                {
                    "id": "a",
                    "transitions": [
                        {
                            "event": "foo",
                            "onTransition": $assign_line_35_column_51
                        }
                    ]
                }
            ]
        },
        {
            "id": "done"
        }
    ]
};
