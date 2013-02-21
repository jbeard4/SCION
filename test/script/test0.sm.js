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

var x;

function $script_line_27_column_20(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = 100;
}

function $cond_line_34_column_59(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 100;
}

module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "intitial1",
            "transitions": [
                {
                    "target": "a",
                    "onTransition": $script_line_27_column_20
                }
            ]
        },
        {
            "id": "a",
            "transitions": [
                {
                    "target": "b",
                    "event": "t",
                    "cond": $cond_line_34_column_59
                },
                {
                    "target": "f",
                    "event": "t"
                }
            ]
        },
        {
            "id": "b"
        },
        {
            "id": "f"
        }
    ]
};
