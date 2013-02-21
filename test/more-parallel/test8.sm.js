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





module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "x",
            "transitions": [
                {
                    "event": "t",
                    "target": "a22"
                }
            ]
        },
        {
            "id": "p",
            "type": "parallel",
            "states": [
                {
                    "id": "a",
                    "states": [
                        {
                            "id": "a1",
                            "states": [
                                {
                                    "id": "a11"
                                },
                                {
                                    "id": "a12"
                                }
                            ]
                        },
                        {
                            "id": "a2",
                            "states": [
                                {
                                    "id": "a21"
                                },
                                {
                                    "id": "a22"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "b",
                    "states": [
                        {
                            "id": "b1",
                            "states": [
                                {
                                    "id": "b11"
                                },
                                {
                                    "id": "b12"
                                }
                            ]
                        },
                        {
                            "id": "b2",
                            "states": [
                                {
                                    "id": "b21"
                                },
                                {
                                    "id": "b22"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};
