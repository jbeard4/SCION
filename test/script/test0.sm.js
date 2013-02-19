//Generated on Monday, February 18, 2013 23:38:31 by the SCION SCXML compiler

var x;

function $script_line_27_column_20(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = 100;
}

function $cond_line_34_column_57(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 100;
}

module.exports = {
    "states": [
        {
            "id": "intitial1",
            "transitions": [
                {
                    "target": "a",
                    "onTransition": $script_line_27_column_20
                }
            ]
        },
        {
            "id": "a",
            "transitions": [
                {
                    "target": "b",
                    "event": "t",
                    "cond": $cond_line_34_column_57
                },
                {
                    "target": "f",
                    "event": "t"
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
