//Generated on Monday, February 18, 2013 21:46:25 by the SCION SCXML compiler



function $raise_line_24_column_30(_event, In, _sessionId, _name, _ioprocessors, _x){
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
                    "event": "t",
                    "onTransition": $raise_line_24_column_30
                }
            ]
        },
        {
            "id": "b",
            "transitions": [
                {
                    "target": "c",
                    "event": "s"
                }
            ]
        },
        {
            "id": "c"
        }
    ]
};
