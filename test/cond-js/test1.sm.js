//Generated on Monday, February 18, 2013 23:15:36 by the SCION SCXML compiler



function $cond_line_22_column_53(_event, In, _sessionId, _name, _ioprocessors, _x){
    return false;
}

function $cond_line_23_column_52(_event, In, _sessionId, _name, _ioprocessors, _x){
    return true;
}

module.exports = {
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "f",
                    "event": "t",
                    "cond": $cond_line_22_column_53
                },
                {
                    "target": "b",
                    "event": "t",
                    "cond": $cond_line_23_column_52
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
