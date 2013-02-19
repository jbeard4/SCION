//Generated on Monday, February 18, 2013 21:46:25 by the SCION SCXML compiler



function $raise_line_32_column_30(_event, In, _sessionId, _name, _ioprocessors, _x){
    this.raise({ name:"s", data : {}});
}

module.exports = {
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
