//Generated on Thursday, February 21, 2013 18:44:39 by the SCION SCXML compiler







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
