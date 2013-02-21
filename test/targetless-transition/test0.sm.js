//Generated on Thursday, February 21, 2013 18:44:39 by the SCION SCXML compiler



var i = $data_line_22_column_31();

function $cond_line_30_column_52(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i === 100;
}

function $expr_line_32_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i + 1;
}

function $assign_line_32_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    i = $expr_line_32_column_47.apply(this, arguments);
}

function $data_line_22_column_31(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 0;
}

module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
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
            "transitions": [
                {
                    "target": "done",
                    "cond": $cond_line_30_column_52
                },
                {
                    "onTransition": $assign_line_32_column_47
                }
            ]
        },
        {
            "id": "done"
        }
    ]
};
