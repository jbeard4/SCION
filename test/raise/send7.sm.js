//Generated on Thursday, February 21, 2013 19:49:15 by the SCION SCXML compiler







function $raise_line_27_column_30(_event, In, _sessionId, _name, _ioprocessors, _x){
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
                    "onTransition": $raise_line_27_column_30
                }
            ]
        },
        {
            "id": "b",
            "initial": "b1",
            "states": [
                {
                    "id": "b1",
                    "transitions": [
                        {
                            "event": "s",
                            "target": "b2"
                        },
                        {
                            "target": "b3"
                        }
                    ]
                },
                {
                    "id": "b2"
                },
                {
                    "id": "b3"
                }
            ]
        }
    ]
};
