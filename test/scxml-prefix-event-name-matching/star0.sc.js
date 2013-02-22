//Generated on Thursday, February 21, 2013 19:56:28 by the SCION SCXML compiler









module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "b",
                    "event": "*"
                },
                {
                    "target": "fail",
                    "event": "foo"
                }
            ]
        },
        {
            "id": "b"
        },
        {
            "id": "fail"
        }
    ]
};
