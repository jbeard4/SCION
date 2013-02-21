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



function $raise_line_27_column_30(_event, In, _sessionId, _name, _ioprocessors, _x){
    this.raise({ name:"s", data : {}});
}

module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "initial": "a",
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "b",
                    "event": "t",
                    "onTransition": $raise_line_27_column_30
                }
            ]
        },
        {
            "id": "b",
            "initial": "b1",
            "states": [
                {
                    "id": "b1",
                    "transitions": [
                        {
                            "event": "s",
                            "target": "b2"
                        },
                        {
                            "target": "b3"
                        }
                    ]
                },
                {
                    "id": "b2"
                },
                {
                    "id": "b3"
                }
            ]
        }
    ]
};
