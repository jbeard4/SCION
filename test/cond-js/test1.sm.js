//Generated on Thursday, February 21, 2013 18:44:35 by the SCION SCXML compiler





function $cond_line_22_column_55(_event, In, _sessionId, _name, _ioprocessors, _x){
    return false;
}

function $cond_line_23_column_54(_event, In, _sessionId, _name, _ioprocessors, _x){
    return true;
}

module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "f",
                    "event": "t",
                    "cond": $cond_line_22_column_55
                },
                {
                    "target": "b",
                    "event": "t",
                    "cond": $cond_line_23_column_54
                }
            ]
        },
        {
            "id": "b"
        },
        {
            "id": "f"
        }
    ]
};
