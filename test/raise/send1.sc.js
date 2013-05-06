//Generated on Thursday, February 21, 2013 19:56:28 by the SCION SCXML compiler







function $raise_line_24_column_30(_event, In, _sessionId, _name, _ioprocessors, _x){
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
