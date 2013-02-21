//Generated on Thursday, February 21, 2013 18:37:34 by the SCION SCXML compiler

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

var x = $data_line_22_column_31();

function $log_line_26_column_33(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log("x",$expr_line_26_column_33.apply(this, arguments));
}

function $expr_line_26_column_33(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x;
}

function $assign_line_35_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_35_column_47.apply(this, arguments);
}

function $expr_line_35_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x + 1;
}

function $assign_line_31_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_31_column_47.apply(this, arguments);
}

function $expr_line_31_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x + 1;
}

function $cond_line_46_column_75(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 1;
}

function $cond_line_43_column_62(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 1;
}

function $cond_line_50_column_59(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 2;
}

function $data_line_22_column_31(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 0;
}

module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "transitions": [
        {
            "event": "*",
            "onTransition": $log_line_26_column_33
        }
    ],
    "states": [
        {
            "id": "a",
            "onEntry": $assign_line_31_column_47,
            "onExit": $assign_line_35_column_47,
            "states": [
                {
                    "id": "a1"
                },
                {
                    "id": "a2",
                    "transitions": [
                        {
                            "target": "b",
                            "event": "t2",
                            "cond": $cond_line_43_column_62
                        }
                    ]
                }
            ],
            "transitions": [
                {
                    "target": "a2",
                    "event": "t1",
                    "type": "internal",
                    "cond": $cond_line_46_column_75
                }
            ]
        },
        {
            "id": "b",
            "transitions": [
                {
                    "target": "c",
                    "event": "t3",
                    "cond": $cond_line_50_column_59
                }
            ]
        },
        {
            "id": "c"
        }
    ]
};
