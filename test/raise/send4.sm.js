//Generated on Thursday, February 21, 2013 18:44:38 by the SCION SCXML compiler





function $raise_line_32_column_30(_event, In, _sessionId, _name, _ioprocessors, _x){
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
                    "event": "t"
                }
            ]
        },
        {
            "id": "b",
            "onEntry": $raise_line_32_column_30,
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
                    "target": "f2",
                    "event": "s"
                },
                {
                    "target": "d"
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
