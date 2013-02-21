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



function $raise_line_32_column_30(_event, In, _sessionId, _name, _ioprocessors, _x){
    this.raise({ name:"s", data : {}});
}

function $raise_line_33_column_30(_event, In, _sessionId, _name, _ioprocessors, _x){
    this.raise({ name:"r", data : {}});
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
                    "event": "t"
                }
            ]
        },
        {
            "id": "b",
            "onEntry": [
                $raise_line_32_column_30,
                $raise_line_33_column_30
            ],
            "transitions": [
                {
                    "target": "c",
                    "event": "s"
                },
                {
                    "target": "f1"
                }
            ]
        },
        {
            "id": "c",
            "transitions": [
                {
                    "target": "d",
                    "event": "r"
                },
                {
                    "target": "f2"
                }
            ]
        },
        {
            "id": "f1"
        },
        {
            "id": "d"
        },
        {
            "id": "f2"
        }
    ]
};
