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
            "id": "p",
            "type": "parallel",
            "states": [
                {
                    "id": "a",
                    "transitions": [
                        {
                            "target": "a",
                            "event": "t"
                        }
                    ]
                },
                {
                    "id": "b"
                }
            ]
        }
    ]
};
