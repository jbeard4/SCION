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





module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "b",
                    "event": "foo"
                }
            ]
        },
        {
            "id": "b",
            "transitions": [
                {
                    "target": "c",
                    "event": "foo.bar"
                }
            ]
        },
        {
            "id": "c",
            "transitions": [
                {
                    "target": "d",
                    "event": "foo.bar.bat"
                }
            ]
        },
        {
            "id": "d",
            "transitions": [
                {
                    "target": "e",
                    "event": "foo"
                }
            ]
        },
        {
            "id": "e",
            "transitions": [
                {
                    "target": "f",
                    "event": "foo.bar"
                }
            ]
        },
        {
            "id": "f",
            "transitions": [
                {
                    "target": "g",
                    "event": "foo.bar.bat"
                }
            ]
        },
        {
            "id": "g"
        }
    ]
};
